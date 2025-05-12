import { Program, Wallet, AnchorProvider } from "@coral-xyz/anchor";
import type { IdlTypes } from "@coral-xyz/anchor";
import fs from "fs";
import { Ticketbox as TicketBoxIDL } from "../target/types/ticketbox";
import { ZkNft } from "../target/types/zk_nft";
import {
  createRpc,
  LightSystemProgram,
  bn,
  buildAndSignTx,
  defaultStaticAccountsStruct,
  defaultTestStateTreeAccounts,
  deriveAddress,
  sendAndConfirmTx,
  packCompressedAccounts,
  NewAddressParams,
  toAccountMetas,
  getIndexOrAdd,
} from "@lightprotocol/stateless.js";
import {
  Keypair,
  PublicKey,
  ComputeBudgetProgram,
  SendTransactionError,
} from "@solana/web3.js";
import idl from "../target/idl/ticketbox.json";
import zkNftIdl from "../target/idl/zk_nft.json";
import { deriveAddressSeedV2, packInputData } from "./pack-account";
import { expect } from "chai";
import { TicketBoxAccountLayout, TicketBox } from "./schema";

const setComputeUnitLimitIx = ComputeBudgetProgram.setComputeUnitLimit({
  units: 900_000,
});

const setComputeUnitPriceIx = ComputeBudgetProgram.setComputeUnitPrice({
  microLamports: 1,
});

const payer = Keypair.fromSecretKey(
  Uint8Array.from(
    JSON.parse(
      fs.readFileSync("/Users/trankhacvy/.config/solana/id.json", "utf-8")
    )
  )
);

export const RPC_ENDPOINT = "http://localhost:8899";
export const COMPRESS_RPC_ENDPOINT = "http://localhost:8784";
export const PROVER_ENDPOINT = "http://localhost:3001";

// Create connection
export const connection = createRpc(
  RPC_ENDPOINT,
  COMPRESS_RPC_ENDPOINT,
  PROVER_ENDPOINT,
  {
    commitment: "confirmed",
  }
);

const PROGRAM_ID = new PublicKey(
  "91VDSbGsnyEzp4JyveazJvrWiLwKwUTDnCVTzedb9obT"
);

const ZK_NFT_PROGRAM_ID = new PublicKey(
  "GNfAaEoSYPnQVH1w8Sbd8um5T6Gr6cYryadt6uE7HbJB"
);

describe("TicketBox", () => {
  const updatedIdl = updateJsonFile(idl);
  const zkNdtUpdatedIdl = updateJsonFile(zkNftIdl);

  // Configure the client to use the local cluster.
  const program = new Program<TicketBoxIDL>(
    updatedIdl as any,
    PROGRAM_ID,
    new AnchorProvider(connection, new Wallet(payer), {
      commitment: "confirmed",
    })
  );

  const nftProgram = new Program<ZkNft>(
    zkNdtUpdatedIdl as any,
    ZK_NFT_PROGRAM_ID,
    new AnchorProvider(connection, new Wallet(payer), {
      commitment: "confirmed",
    })
  );

  const eventId = String(Date.now());
  const eventName = "Test Event";
  const metadataUri = "https://famousfoxes.com/metadata/2173.json";
  const maxSupply = 1000;

  let ticketBoxPda: PublicKey;

  const collectionKey = Keypair.generate().publicKey;
  const assetKey = Keypair.generate().publicKey;

  it("Can create Ticketbox", async () => {
    const addressTree = defaultTestStateTreeAccounts().addressTree;
    const addressQueue = defaultTestStateTreeAccounts().addressQueue;

    const ticketBoxSeed = deriveAddressSeedV2(
      [
        Buffer.from("ticket_box"),
        payer.publicKey.toBytes(),
        Buffer.from(eventId),
      ],
      program.programId,
      addressTree
    );

    const ticketBoxAddress = deriveAddress(ticketBoxSeed, addressTree);

    ticketBoxPda = ticketBoxAddress;

    // const ticketBoxEventSeed = deriveAddressSeedV2(
    //   [Buffer.from("ticket_box_event"), ticketBoxAddress.toBytes()],
    //   program.programId,
    //   addressTree
    // );

    // const ticketBoxEventAddress = deriveAddress(
    //   ticketBoxEventSeed,
    //   addressTree
    // );

    // Get a fresh proof for the node address
    const proof = await connection.getValidityProofV0(undefined, [
      {
        address: bn(ticketBoxAddress.toBytes()),
        tree: addressTree,
        queue: addressQueue,
      },
      // {
      //   address: bn(ticketBoxEventAddress.toBytes()),
      //   tree: addressTree,
      //   queue: addressQueue,
      // },
    ]);

    const newTicketBoxAddressParams: NewAddressParams = {
      seed: ticketBoxSeed,
      addressMerkleTreeRootIndex: proof.rootIndices[0],
      addressMerkleTreePubkey: proof.merkleTrees[0],
      addressQueuePubkey: proof.nullifierQueues[0],
    };

    // const newTicketBoxEventAddressParams: NewAddressParams = {
    //   seed: ticketBoxEventSeed,
    //   addressMerkleTreeRootIndex: proof.rootIndices[0],
    //   addressMerkleTreePubkey: proof.merkleTrees[0],
    //   addressQueuePubkey: proof.nullifierQueues[0],
    // };

    const ticketBoxOutputCompressedAccounts =
      LightSystemProgram.createNewAddressOutputState(
        Array.from(ticketBoxAddress.toBytes()),
        program.programId
      );

    // const ticketEventBoxOutputCompressedAccounts =
    //   LightSystemProgram.createNewAddressOutputState(
    //     Array.from(ticketBoxEventAddress.toBytes()),
    //     program.programId
    //   );

    let {
      addressMerkleContext,
      addressMerkleTreeRootIndex,
      merkleContext,
      remainingAccounts,
    } = packInputData(
      [
        ...ticketBoxOutputCompressedAccounts,
        // ...ticketEventBoxOutputCompressedAccounts,
      ],
      [newTicketBoxAddressParams],
      proof
    );

    const {
      accountCompressionAuthority,
      noopProgram,
      registeredProgramPda,
      accountCompressionProgram,
    } = defaultStaticAccountsStruct();

    const inputs: IdlTypes<TicketBoxIDL>["ticketbox::state::LightInstructionData"] =
      {
        addressMerkleContext,
        addressMerkleTreeRootIndex,
        inputs: [],
        merkleContext,
        merkleTreeRootIndex: proof.rootIndices[0],
        proof: proof.compressedProof,
      };

    // for collection
    async function createCollectionInputs() {
      const collectionSeed = deriveAddressSeedV2(
        [collectionKey.toBytes()],
        ZK_NFT_PROGRAM_ID,
        addressTree
      );

      const collectionAddress = deriveAddress(collectionSeed, addressTree);

      const proof = await connection.getValidityProofV0(undefined, [
        {
          address: bn(collectionAddress.toBytes()),
          tree: addressTree,
          queue: addressQueue,
        },
      ]);

      const newAssetAddressParams: NewAddressParams = {
        seed: collectionSeed,
        addressMerkleTreeRootIndex: proof.rootIndices[0],
        addressMerkleTreePubkey: proof.merkleTrees[0],
        addressQueuePubkey: proof.nullifierQueues[0],
      };

      const outputCompressedAccounts =
        LightSystemProgram.createNewAddressOutputState(
          Array.from(collectionAddress.toBytes()),
          ZK_NFT_PROGRAM_ID
        );

      const {
        addressMerkleContext,
        addressMerkleTreeRootIndex,
        merkleContext,
        remainingAccounts: _remainingAccounts,
      } = packInputData(
        outputCompressedAccounts,
        [newAssetAddressParams],
        proof,
        remainingAccounts
      );

      const inputs: IdlTypes<TicketBoxIDL>["zk_nft::state::LightInstructionData"] =
        {
          addressMerkleContext,
          addressMerkleTreeRootIndex,
          inputs: [],
          merkleContext,
          merkleTreeRootIndex: proof.rootIndices[0],
          proof: proof.compressedProof,
        };

      return inputs;
    }

    const collectionInputs = await createCollectionInputs();

    const params: IdlTypes<TicketBoxIDL>["CreateTicketBoxParams"] = {
      eventId,
      eventName,
      metadataUri,
      startAt: bn(0),
      endAt: bn(Date.now() + 1000 * 60 * 60 * 24),
      maxSupply: bn(maxSupply),
    };

    const ix = await program.methods
      .initializeTicketbox(inputs, collectionInputs, params, collectionKey)
      .accounts({
        signer: payer.publicKey,
        cpiSigner: PublicKey.findProgramAddressSync(
          [Buffer.from("cpi_authority")],
          program.programId
        )[0],
        selfProgram: program.programId,
        lightSystemProgram: LightSystemProgram.programId,
        accountCompressionAuthority,
        accountCompressionProgram,
        noopProgram,
        registeredProgramPda,
        zkNftProgram: ZK_NFT_PROGRAM_ID,
        zkNftCpiAuthorityPda: PublicKey.findProgramAddressSync(
          [Buffer.from("cpi_authority")],
          ZK_NFT_PROGRAM_ID
        )[0],
      })
      .remainingAccounts(toAccountMetas(remainingAccounts))
      .instruction();

    const blockhash = await connection.getLatestBlockhash();

    const tx = buildAndSignTx(
      [setComputeUnitLimitIx, setComputeUnitPriceIx, ix],
      payer,
      blockhash.blockhash
    );

    try {
      const signature = await sendAndConfirmTx(connection, tx, {
        commitment: "confirmed",
      });

      console.log("Transaction signature:", signature);
      // -----------------------
      const allAccounts = await connection.getCompressedAccountsByOwner(
        program.programId,
        {}
      );
      console.log("allAccounts", allAccounts.items.length);
      expect(allAccounts.items.length).gt(0);

      const compressedAccountData = allAccounts.items.find(
        (item) =>
          item.address.toString() === ticketBoxAddress.toBytes().toString()
      );

      const ticketBoxAccount = TicketBoxAccountLayout.decode(
        compressedAccountData.data.data
      ) as TicketBox;

      expect(new PublicKey(ticketBoxAccount.authority).toBase58()).eq(
        payer.publicKey.toBase58()
      );
      expect(ticketBoxAccount.maxSupply.toNumber()).eq(maxSupply);
    } catch (error) {
      if (error instanceof SendTransactionError) {
        const logs = await error.getLogs(connection);
        console.error("Transaction failed with logs:", logs);
      }
      throw Error(error);
    }
  });

  it("Can mint POP", async () => {
    const addressTree = defaultTestStateTreeAccounts().addressTree;
    const addressQueue = defaultTestStateTreeAccounts().addressQueue;
    // const merkleTree = defaultTestStateTreeAccounts().merkleTree;
    // const nullifierQueue = defaultTestStateTreeAccounts().nullifierQueue;

    const compressedAccountData = await connection.getCompressedAccount(
      bn(ticketBoxPda.toBytes())
    );

    const {
      accountCompressionAuthority,
      noopProgram,
      registeredProgramPda,
      accountCompressionProgram,
    } = defaultStaticAccountsStruct();

    let allRemainingAccounts = [];

    async function buildInputs() {
      const proof = await connection.getValidityProofV0([
        {
          hash: bn(compressedAccountData.hash),
          tree: addressTree,
          queue: addressQueue,
        },
      ]);

      const { remainingAccounts, packedInputCompressedAccounts } =
        packCompressedAccounts(
          [compressedAccountData],
          proof.rootIndices,
          LightSystemProgram.createNewAddressOutputState(
            Array.from(ticketBoxPda.toBytes()),
            program.programId
          )
        );

      const merkleContext = packedInputCompressedAccounts[0].merkleContext;

      allRemainingAccounts = mergeUniqueOrdered(
        allRemainingAccounts,
        remainingAccounts
      );

      const inputs: IdlTypes<TicketBoxIDL>["ticketbox::state::LightInstructionData"] =
        {
          addressMerkleContext: {
            addressMerkleTreePubkeyIndex: getIndexOrAdd(
              allRemainingAccounts,
              addressTree
            ),
            addressQueuePubkeyIndex: getIndexOrAdd(
              allRemainingAccounts,
              addressQueue
            ),
          },
          addressMerkleTreeRootIndex: proof.rootIndices[0],
          inputs: [compressedAccountData.data.data],
          merkleContext,
          merkleTreeRootIndex: proof.rootIndices[0],
          proof: proof.compressedProof,
        };

      return inputs;
    }

    async function buildNFTInputs() {
      const assetSeed = deriveAddressSeedV2(
        [assetKey.toBytes()],
        ZK_NFT_PROGRAM_ID,
        addressTree
      );

      const nftAssetAddress = deriveAddress(assetSeed, addressTree);

      const proof = await connection.getValidityProofV0(undefined, [
        {
          address: bn(nftAssetAddress.toBytes()),
          tree: addressTree,
          queue: addressQueue,
        },
      ]);

      const newNftAssetAddressParams: NewAddressParams = {
        seed: assetSeed,
        addressMerkleTreeRootIndex: proof.rootIndices[0],
        addressMerkleTreePubkey: proof.merkleTrees[0],
        addressQueuePubkey: proof.nullifierQueues[0],
      };

      const nftAssetOutputCompressedAccounts =
        LightSystemProgram.createNewAddressOutputState(
          Array.from(nftAssetAddress.toBytes()),
          ZK_NFT_PROGRAM_ID
        );

      const {
        addressMerkleContext,
        addressMerkleTreeRootIndex,
        merkleContext,
        remainingAccounts,
      } = packInputData(
        nftAssetOutputCompressedAccounts,
        [newNftAssetAddressParams],
        proof,
        allRemainingAccounts
      );

      allRemainingAccounts = mergeUniqueOrdered(
        allRemainingAccounts,
        remainingAccounts
      );

      const inputs: IdlTypes<TicketBoxIDL>["zk_nft::state::LightInstructionData"] =
        {
          addressMerkleContext,
          addressMerkleTreeRootIndex,
          inputs: [],
          merkleContext,
          merkleTreeRootIndex: proof.rootIndices[0],
          proof: proof.compressedProof,
        };

      return inputs;
    }

    const inputs = await buildInputs();
    const nftInputs = await buildNFTInputs();

    console.log("inputs", inputs);
    console.log("nftInputs", nftInputs);

    const ix = await program.methods
      .mintPop(inputs, nftInputs, assetKey)
      .accounts({
        signer: payer.publicKey,
        cpiSigner: PublicKey.findProgramAddressSync(
          [Buffer.from("cpi_authority")],
          program.programId
        )[0],
        selfProgram: program.programId,
        lightSystemProgram: LightSystemProgram.programId,
        accountCompressionAuthority,
        accountCompressionProgram,
        noopProgram,
        registeredProgramPda,
        zkNftProgram: ZK_NFT_PROGRAM_ID,
        zkNftCpiAuthorityPda: PublicKey.findProgramAddressSync(
          [Buffer.from("cpi_authority")],
          ZK_NFT_PROGRAM_ID
        )[0],
        owner: new PublicKey("63EEC9FfGyksm7PkVC6z8uAmqozbQcTzbkWJNsgqjkFs"),
      })
      .remainingAccounts(toAccountMetas(allRemainingAccounts))
      .instruction();

    const blockhash = await connection.getLatestBlockhash();

    const tx = buildAndSignTx(
      [setComputeUnitLimitIx, setComputeUnitPriceIx, ix],
      payer,
      blockhash.blockhash
    );

    try {
      const signature = await sendAndConfirmTx(connection, tx, {
        commitment: "confirmed",
      });
      console.log("Transaction signature:", signature);

      const assetSeed = deriveAddressSeedV2(
        [assetKey.toBytes()],
        ZK_NFT_PROGRAM_ID,
        addressTree
      );

      const nftAssetAddress = deriveAddress(assetSeed, addressTree);

      const compressedAccountData = await connection.getCompressedAccount(
        bn(nftAssetAddress.toBytes())
      );

      const assetAccount = nftProgram.coder.types.decode(
        "AssetV1",
        compressedAccountData.data.data
      );

      console.log("assetAccount", assetAccount);
    } catch (error) {
      if (error instanceof SendTransactionError) {
        const logs = await error.getLogs(connection);
        console.error("Transaction failed with logs:", logs);
      }
      throw Error(error);
    }
  });
});

function updateJsonFile(jsonData: any): any {
  // Create a deep copy of the input data
  const updatedJson = JSON.parse(JSON.stringify(jsonData));

  // Add the AnchorCompressedProof type to the types array
  const anchorCompressedProofType = {
    name: "CompressedProof",
    type: {
      kind: "struct",
      fields: [
        {
          name: "a",
          type: {
            array: ["u8", 32],
          },
        },
        {
          name: "b",
          type: {
            array: ["u8", 64],
          },
        },
        {
          name: "c",
          type: {
            array: ["u8", 32],
          },
        },
      ],
    },
  };

  // Make sure types array exists
  if (!updatedJson.types) {
    updatedJson.types = [];
  }

  // Add the new type
  updatedJson.types.push(anchorCompressedProofType);

  // Update all occurrences of the proof field with empty defined to use AnchorCompressedProof
  if (updatedJson.instructions) {
    updatedJson.instructions.forEach((instruction: any) => {
      if (instruction.args) {
        instruction.args.forEach((arg: any) => {
          if (arg.name === "proof" && arg.type && arg.type.defined === "") {
            arg.type.defined = "CompressedProof";
          }
        });
      }
    });
  }

  if (updatedJson.types) {
    updatedJson.types.forEach((type: any) => {
      if (
        type.name === "ticketbox::state::LightInstructionData" ||
        type.name === "zk_nft::state::LightInstructionData"
      ) {
        type.type.fields.forEach((arg: any) => {
          if (arg.name === "proof" && arg.type && arg.type.defined === "") {
            arg.type.defined = "CompressedProof";
          }
        });
      }
    });
  }

  return updatedJson;
}

function mergeUniqueOrdered<T>(arr1: T[], arr2: T[]): T[] {
  const seen = new Set<T>();
  const result: T[] = [];

  for (const item of [...arr1, ...arr2]) {
    if (!seen.has(item)) {
      seen.add(item);
      result.push(item);
    }
  }

  return result;
}
