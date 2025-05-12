import { Program, Wallet, AnchorProvider } from "@coral-xyz/anchor";
import type { IdlTypes } from "@coral-xyz/anchor";
import fs from "fs";
import { ZkNft as ZkNft } from "../target/types/zk_nft";
import idl from "../target/idl/zk_nft.json";
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
import { deriveAddressSeedV2, packInputData } from "./pack-account";
import { expect } from "chai";
import { AssetV1, CollectionV1 } from "./schema";

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
  "A9j21mfH4nKEfGYmsqZPX1j5H1H8WpD2of8aiyAnPUQU"
);

describe("ZKNFT", () => {
  const updatedIdl = updateJsonFile(idl);

  // Configure the client to use the local cluster.
  const program = new Program<ZkNft>(
    updatedIdl as any,
    PROGRAM_ID,
    new AnchorProvider(connection, new Wallet(payer), {
      commitment: "confirmed",
    })
  );

  //   const owner = Keypair.generate().publicKey;
  const collectionKey = Keypair.generate().publicKey;
  const assetKey = Keypair.generate().publicKey;
  const assetWithColKey = Keypair.generate().publicKey;

  it("Can create Collection", async () => {
    const addressTree = defaultTestStateTreeAccounts().addressTree;
    const addressQueue = defaultTestStateTreeAccounts().addressQueue;

    // asset
    const collectionSeed = deriveAddressSeedV2(
      [collectionKey.toBytes()],
      program.programId,
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
        program.programId
      );

    const {
      addressMerkleContext,
      addressMerkleTreeRootIndex,
      merkleContext,
      remainingAccounts,
    } = packInputData(outputCompressedAccounts, [newAssetAddressParams], proof);

    const {
      accountCompressionAuthority,
      noopProgram,
      registeredProgramPda,
      accountCompressionProgram,
    } = defaultStaticAccountsStruct();

    const [_, bump] = PublicKey.findProgramAddressSync(
      [Buffer.from("cpi_authority")],
      program.programId
    );

    const inputs: IdlTypes<ZkNftV2>["LightInstructionData"] = {
      addressMerkleContext,
      addressMerkleTreeRootIndex,
      inputs: [],
      merkleContext,
      merkleTreeRootIndex: proof.rootIndices[0],
      proof: proof.compressedProof,
    };

    const params: IdlTypes<ZkNft>["CreateCollectionV1Args"] = {
      derivationKey: collectionKey,
      name: "TicketBox Collection",
      uri: "https://example.com",
      collection: null,
    };

    const ix = await program.methods
      .createCollection(inputs, params, bump)
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
        updateAuthority: payer.publicKey,
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
      // // -----------------------
      const allAccounts = await connection.getCompressedAccountsByOwner(
        program.programId,
        {}
      );
      console.log("allAccounts", allAccounts.items.length);
      //   expect(allAccounts.items.length).gt(0);

      const compressedAccountData = allAccounts.items.find(
        (item) =>
          item.address.toString() === collectionAddress.toBytes().toString()
      );

      const assetAccount = program.coder.types.decode<CollectionV1>(
        "CollectionV1",
        compressedAccountData.data.data
      );

      expect(assetAccount.name).eq("TicketBox Collection");
      expect(assetAccount.updateAuthority.toBase58()).eq(
        payer.publicKey.toBase58()
      );
    } catch (error) {
      if (error instanceof SendTransactionError) {
        const logs = await error.getLogs(connection);
        console.error("Transaction failed with logs:", logs);
      }
      throw Error(error);
    }
  });

  it("Can create Asset", async () => {
    const addressTree = defaultTestStateTreeAccounts().addressTree;
    const addressQueue = defaultTestStateTreeAccounts().addressQueue;

    // asset
    const assetSeed = deriveAddressSeedV2(
      [assetKey.toBytes()],
      program.programId,
      addressTree
    );

    const assetAddress = deriveAddress(assetSeed, addressTree);

    const proof = await connection.getValidityProofV0(undefined, [
      {
        address: bn(assetAddress.toBytes()),
        tree: addressTree,
        queue: addressQueue,
      },
    ]);

    const newAssetAddressParams: NewAddressParams = {
      seed: assetSeed,
      addressMerkleTreeRootIndex: proof.rootIndices[0],
      addressMerkleTreePubkey: proof.merkleTrees[0],
      addressQueuePubkey: proof.nullifierQueues[0],
    };

    const outputCompressedAccounts =
      LightSystemProgram.createNewAddressOutputState(
        Array.from(assetAddress.toBytes()),
        program.programId
      );

    const {
      addressMerkleContext,
      addressMerkleTreeRootIndex,
      merkleContext,
      remainingAccounts,
    } = packInputData(outputCompressedAccounts, [newAssetAddressParams], proof);

    const {
      accountCompressionAuthority,
      noopProgram,
      registeredProgramPda,
      accountCompressionProgram,
    } = defaultStaticAccountsStruct();

    const [_, bump] = PublicKey.findProgramAddressSync(
      [Buffer.from("cpi_authority")],
      program.programId
    );

    const inputs: IdlTypes<ZkNft>["LightInstructionData"] = {
      addressMerkleContext,
      addressMerkleTreeRootIndex,
      inputs: [],
      merkleContext,
      merkleTreeRootIndex: proof.rootIndices[0],
      proof: proof.compressedProof,
    };

    const params: IdlTypes<ZkNft>["CreateV1Args"] = {
      derivationKey: assetKey,
      name: "TicketBox",
      uri: "https://example.com",
      collectionKey: null,
      asset: null,
    };

    const ix = await program.methods
      .create(inputs, null, params, bump)
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
        owner: payer.publicKey,
        updateAuthority: payer.publicKey,
        authority: payer.publicKey,
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
      //   expect(allAccounts.items.length).gt(0);

      const compressedAccountData = allAccounts.items.find(
        (item) => item.address.toString() === assetAddress.toBytes().toString()
      );

      const assetAccount = program.coder.types.decode<AssetV1>(
        "AssetV1",
        compressedAccountData.data.data
      );

      expect(assetAccount.name).eq("TicketBox");
      expect(assetAccount.owner.toBase58()).eq(payer.publicKey.toBase58());
    } catch (error) {
      if (error instanceof SendTransactionError) {
        const logs = await error.getLogs(connection);
        console.error("Transaction failed with logs:", logs);
      }
      throw Error(error);
    }
  });

  it.skip("Can create Asset With Collection", async () => {
    const addressTree = defaultTestStateTreeAccounts().addressTree;
    const addressQueue = defaultTestStateTreeAccounts().addressQueue;

    // asset
    const assetSeed = deriveAddressSeedV2(
      [assetWithColKey.toBytes()],
      program.programId,
      addressTree
    );

    const assetAddress = deriveAddress(assetSeed, addressTree);

    const proof = await connection.getValidityProofV0(undefined, [
      {
        address: bn(assetAddress.toBytes()),
        tree: addressTree,
        queue: addressQueue,
      },
    ]);

    const newAssetAddressParams: NewAddressParams = {
      seed: assetSeed,
      addressMerkleTreeRootIndex: proof.rootIndices[0],
      addressMerkleTreePubkey: proof.merkleTrees[0],
      addressQueuePubkey: proof.nullifierQueues[0],
    };

    const outputCompressedAccounts =
      LightSystemProgram.createNewAddressOutputState(
        Array.from(assetAddress.toBytes()),
        program.programId
      );

    let {
      addressMerkleContext,
      addressMerkleTreeRootIndex,
      merkleContext,
      remainingAccounts,
    } = packInputData(outputCompressedAccounts, [newAssetAddressParams], proof);

    const {
      accountCompressionAuthority,
      noopProgram,
      registeredProgramPda,
      accountCompressionProgram,
    } = defaultStaticAccountsStruct();

    const [_, bump] = PublicKey.findProgramAddressSync(
      [Buffer.from("cpi_authority")],
      program.programId
    );

    const inputs: IdlTypes<ZkNft>["LightInstructionData"] = {
      addressMerkleContext,
      addressMerkleTreeRootIndex,
      inputs: [],
      merkleContext,
      merkleTreeRootIndex: proof.rootIndices[0],
      proof: proof.compressedProof,
    };

    // collection
    const collectionSeed = deriveAddressSeedV2(
      [collectionKey.toBytes()],
      program.programId,
      addressTree
    );

    const collectionAddress = deriveAddress(collectionSeed, addressTree);

    const collectionCompressedAccount = await connection.getCompressedAccount(
      bn(collectionAddress.toBytes())
    );

    const collectionProof = await connection.getValidityProofV0([
      {
        hash: bn(collectionCompressedAccount.hash),
        tree: addressTree,
        queue: addressQueue,
      },
    ]);

    const {
      remainingAccounts: _remainingAccounts,
      packedInputCompressedAccounts,
    } = packCompressedAccounts(
      [collectionCompressedAccount],
      proof.rootIndices,
      LightSystemProgram.createNewAddressOutputState(
        Array.from(collectionAddress.toBytes()),
        program.programId
      )
    );

    remainingAccounts = mergeUniqueOrdered(
      remainingAccounts,
      _remainingAccounts
    );

    const collectionInputs: IdlTypes<ZkNft>["LightInstructionData"] = {
      addressMerkleContext: {
        addressMerkleTreePubkeyIndex: getIndexOrAdd(
          remainingAccounts,
          addressTree
        ),
        addressQueuePubkeyIndex: getIndexOrAdd(remainingAccounts, addressQueue),
      },
      addressMerkleTreeRootIndex: collectionProof.rootIndices[0],
      inputs: [collectionCompressedAccount.data.data],
      merkleContext: packedInputCompressedAccounts[0].merkleContext,
      merkleTreeRootIndex: collectionProof.rootIndices[0],
      proof: collectionProof.compressedProof,
    };

    const params: IdlTypes<ZkNft>["CreateV1Args"] = {
      derivationKey: assetWithColKey,
      name: "TicketBox",
      uri: "https://example.com",
      collectionKey: collectionKey,
      asset: null,
    };

    const ix = await program.methods
      .create(inputs, collectionInputs, params, bump)
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
        owner: payer.publicKey,
        updateAuthority: null, //payer.publicKey,
        authority: payer.publicKey,
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
      //   expect(allAccounts.items.length).gt(0);

      const compressedAccountData = allAccounts.items.find(
        (item) => item.address.toString() === assetAddress.toBytes().toString()
      );

      const assetAccount = program.coder.types.decode<AssetV1>(
        "AssetV1",
        compressedAccountData.data.data
      );

      expect(assetAccount.name).eq("TicketBox");
      expect(assetAccount.owner.toBase58()).eq(payer.publicKey.toBase58());
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
      if (type.name === "LightInstructionData") {
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
