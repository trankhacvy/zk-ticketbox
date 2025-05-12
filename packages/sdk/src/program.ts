import {
  Program,
  Wallet,
  AnchorProvider,
  setProvider,
  IdlTypes,
} from "@coral-xyz/anchor";
import {
  PublicKey,
  Keypair,
  Connection,
  Transaction,
  VersionedTransaction,
} from "@solana/web3.js";
import {
  confirmConfig,
  getIndexOrAdd,
  NewAddressParams,
  Rpc,
  deriveAddress,
  packCompressedAccounts,
  toAccountMetas,
  bn,
  defaultTestStateTreeAccounts,
  LightSystemProgram,
  defaultStaticAccountsStruct,
} from "@lightprotocol/stateless.js";
import { Ticketbox as TicketBoxProgramType, IDL } from "./idl";
import { ZkNft as ZkNftProgramType, IDL as ZkNftIdl } from "./idl/zk-nft";
import { TICKET_BOX_PROGRAM_ID, ZK_NFT_PROGRAM_ID } from "./constants";
import { deriveAddressSeed, mergeUniqueOrdered, packInputData } from "./utils";
import {
  CreateTicketBoxParams,
  LightInstructionData,
  TicketBox,
} from "./types";
import { TicketBoxAccountLayout } from "./schema";

export class TicketboxProgram {
  private static instance: TicketboxProgram;
  private _program: Program<TicketBoxProgramType> | null = null;

  private constructor() {}

  static getInstance(): TicketboxProgram {
    if (!TicketboxProgram.instance) {
      TicketboxProgram.instance = new TicketboxProgram();
    }
    return TicketboxProgram.instance;
  }

  getProgram(connection: Connection): Program<TicketBoxProgramType> {
    if (!this._program) {
      this.initializeProgram(connection);
    }
    return this._program!;
  }

  private initializeProgram(connection: Connection): void {
    if (!this._program) {
      const mockKeypair = Keypair.generate();

      const mockProvider = new AnchorProvider(
        connection,
        new TicketBoxWallet(mockKeypair),
        confirmConfig
      );

      setProvider(mockProvider);

      this._program = new Program(IDL, TICKET_BOX_PROGRAM_ID, mockProvider);
    }
  }

  static async createTicketBox(
    rpc: Rpc,
    payer: PublicKey,
    params: CreateTicketBoxParams,
    collectionKey: PublicKey
  ) {
    const addressTree = defaultTestStateTreeAccounts().addressTree;
    const addressQueue = defaultTestStateTreeAccounts().addressQueue;

    const {
      accountCompressionAuthority,
      noopProgram,
      registeredProgramPda,
      accountCompressionProgram,
    } = defaultStaticAccountsStruct();

    const ticketBoxSeed = deriveAddressSeed(
      [Buffer.from("ticket_box"), payer.toBytes(), Buffer.from(params.eventId)],
      TICKET_BOX_PROGRAM_ID,
      addressTree
    );

    const ticketBoxAddress = deriveAddress(ticketBoxSeed, addressTree);

    const proof = await rpc.getValidityProofV0(undefined, [
      {
        address: bn(ticketBoxAddress.toBytes()),
        tree: addressTree,
        queue: addressQueue,
      },
    ]);

    const newTicketBoxAddressParams: NewAddressParams = {
      seed: ticketBoxSeed,
      addressMerkleTreeRootIndex: proof.rootIndices[0],
      addressMerkleTreePubkey: proof.merkleTrees[0],
      addressQueuePubkey: proof.nullifierQueues[0],
    };

    const ticketBoxOutputCompressedAccounts =
      LightSystemProgram.createNewAddressOutputState(
        Array.from(ticketBoxAddress.toBytes()),
        TICKET_BOX_PROGRAM_ID
      );

    const {
      addressMerkleContext,
      addressMerkleTreeRootIndex,
      merkleContext,
      remainingAccounts,
    } = packInputData(
      ticketBoxOutputCompressedAccounts,
      [newTicketBoxAddressParams],
      proof
    );

    const inputs: LightInstructionData = {
      addressMerkleContext,
      addressMerkleTreeRootIndex,
      inputs: [],
      merkleContext,
      merkleTreeRootIndex: proof.rootIndices[0],
      proof: proof.compressedProof,
    };

    // Need better code :()
    async function createCollectionInputs() {
      const collectionSeed = deriveAddressSeed(
        [collectionKey.toBytes()],
        ZK_NFT_PROGRAM_ID,
        addressTree
      );

      const collectionAddress = deriveAddress(collectionSeed, addressTree);

      const proof = await rpc.getValidityProofV0(undefined, [
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

      const inputs: IdlTypes<TicketBoxProgramType>["zk_nft::state::LightInstructionData"] =
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

    const ix = await TicketboxProgram.getInstance()
      .getProgram(rpc)
      .methods.initializeTicketbox(
        inputs,
        collectionInputs,
        params,
        collectionKey
      )
      .accounts({
        signer: payer,
        cpiSigner: PublicKey.findProgramAddressSync(
          [Buffer.from("cpi_authority")],
          TICKET_BOX_PROGRAM_ID
        )[0],
        selfProgram: TICKET_BOX_PROGRAM_ID,
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

    return {
      instruction: ix,
      ticketBoxAddress,
    };
  }

  static async mintPoP(
    rpc: Rpc,
    payer: PublicKey,
    owner: PublicKey | null,
    ticketBoxAddress: PublicKey,
    assetKey: PublicKey
  ) {
    const addressTree = defaultTestStateTreeAccounts().addressTree;
    const addressQueue = defaultTestStateTreeAccounts().addressQueue;

    const {
      accountCompressionAuthority,
      noopProgram,
      registeredProgramPda,
      accountCompressionProgram,
    } = defaultStaticAccountsStruct();

    const ticketBoxAccountData = await rpc.getCompressedAccount(
      bn(ticketBoxAddress.toBytes())
    );

    if (!ticketBoxAccountData) {
      throw new Error("TicketBox account not found");
    }

    let allRemainingAccounts: PublicKey[] = [];

    async function buildInputs() {
      const proof = await rpc.getValidityProofV0([
        {
          hash: bn(ticketBoxAccountData!.hash),
          tree: addressTree,
          queue: addressQueue,
        },
      ]);

      const { remainingAccounts, packedInputCompressedAccounts } =
        packCompressedAccounts(
          [ticketBoxAccountData!],
          proof.rootIndices,
          LightSystemProgram.createNewAddressOutputState(
            Array.from(ticketBoxAddress.toBytes()),
            TICKET_BOX_PROGRAM_ID
          )
        );

      const merkleContext = packedInputCompressedAccounts[0].merkleContext;

      allRemainingAccounts = mergeUniqueOrdered(
        allRemainingAccounts,
        remainingAccounts
      );

      const inputs: LightInstructionData = {
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
        inputs: [ticketBoxAccountData!.data!.data],
        merkleContext,
        merkleTreeRootIndex: proof.rootIndices[0],
        proof: proof.compressedProof,
      };

      return inputs;
    }

    async function buildNFTInputs() {
      const nftSeed = deriveAddressSeed(
        [assetKey.toBytes()],
        ZK_NFT_PROGRAM_ID,
        addressTree
      );

      const nftAddress = deriveAddress(nftSeed, addressTree);

      const proof = await rpc.getValidityProofV0(undefined, [
        {
          address: bn(nftAddress.toBytes()),
          tree: addressTree,
          queue: addressQueue,
        },
      ]);

      const newNftAssetAddressParams: NewAddressParams = {
        seed: nftSeed,
        addressMerkleTreeRootIndex:
          proof.rootIndices[proof.rootIndices.length - 1],
        addressMerkleTreePubkey:
          proof.merkleTrees[proof.merkleTrees.length - 1],
        addressQueuePubkey:
          proof.nullifierQueues[proof.nullifierQueues.length - 1],
      };

      const nftAssetOutputCompressedAccounts =
        LightSystemProgram.createNewAddressOutputState(
          Array.from(nftAddress.toBytes()),
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

      const inputs: LightInstructionData = {
        addressMerkleContext,
        addressMerkleTreeRootIndex,
        inputs: [],
        merkleContext,
        merkleTreeRootIndex: proof.rootIndices[0],
        proof: proof.compressedProof,
      };

      return [inputs, nftAddress];
    }

    const inputs = await buildInputs();
    const [nftInputs, nftAddress] = await buildNFTInputs();

    const ix = await TicketboxProgram.getInstance()
      .getProgram(rpc)
      // @ts-expect-error
      .methods.mintPop(inputs, nftInputs, assetKey)
      .accounts({
        signer: payer,
        cpiSigner: PublicKey.findProgramAddressSync(
          [Buffer.from("cpi_authority")],
          TICKET_BOX_PROGRAM_ID
        )[0],
        selfProgram: TICKET_BOX_PROGRAM_ID,
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
        owner,
      })
      .remainingAccounts(toAccountMetas(allRemainingAccounts))
      .instruction();

    return {
      instruction: ix,
      nftAddress,
    };
  }

  static async mintPoPv2(
    rpc: Rpc,
    payer: PublicKey,
    owner: PublicKey | null,
    ticketBoxAddress: PublicKey,
    assetKey: PublicKey
  ) {
    const addressTree = defaultTestStateTreeAccounts().addressTree;
    const addressQueue = defaultTestStateTreeAccounts().addressQueue;

    const {
      accountCompressionAuthority,
      noopProgram,
      registeredProgramPda,
      accountCompressionProgram,
    } = defaultStaticAccountsStruct();

    const ticketBoxAccountData = await rpc.getCompressedAccount(
      bn(ticketBoxAddress.toBytes())
    );

    if (!ticketBoxAccountData) {
      throw new Error("TicketBox account not found");
    }

    const ticketBoxAccount = TicketBoxAccountLayout.decode(
      ticketBoxAccountData.data
    ) as TicketBox;

    let allRemainingAccounts: PublicKey[] = [];

    async function buildNFTInputs() {
      const nftSeed = deriveAddressSeed(
        [assetKey.toBytes()],
        ZK_NFT_PROGRAM_ID,
        addressTree
      );

      const nftAddress = deriveAddress(nftSeed, addressTree);

      const proof = await rpc.getValidityProofV0(undefined, [
        {
          address: bn(nftAddress.toBytes()),
          tree: addressTree,
          queue: addressQueue,
        },
      ]);

      const newNftAssetAddressParams: NewAddressParams = {
        seed: nftSeed,
        addressMerkleTreeRootIndex:
          proof.rootIndices[proof.rootIndices.length - 1],
        addressMerkleTreePubkey:
          proof.merkleTrees[proof.merkleTrees.length - 1],
        addressQueuePubkey:
          proof.nullifierQueues[proof.nullifierQueues.length - 1],
      };

      const nftAssetOutputCompressedAccounts =
        LightSystemProgram.createNewAddressOutputState(
          Array.from(nftAddress.toBytes()),
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

      const inputs: IdlTypes<TicketBoxProgramType>["zk_nft::state::LightInstructionData"] =
        {
          addressMerkleContext,
          addressMerkleTreeRootIndex,
          inputs: [],
          merkleContext,
          merkleTreeRootIndex: proof.rootIndices[0],
          proof: proof.compressedProof,
        };

      return [inputs, nftAddress];
    }

    const [nftInputs, nftAddress] = await buildNFTInputs();

    const ix = await TicketboxProgram.getInstance()
      .getProgram(rpc)
      .methods.mintPopV2(
        // @ts-expect-error
        nftInputs,
        assetKey,
        ticketBoxAccount.eventName,
        ticketBoxAccount.metadataUri
      )
      .accounts({
        signer: payer,
        cpiSigner: PublicKey.findProgramAddressSync(
          [Buffer.from("cpi_authority")],
          TICKET_BOX_PROGRAM_ID
        )[0],
        selfProgram: TICKET_BOX_PROGRAM_ID,
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
        owner,
      })
      .remainingAccounts(toAccountMetas(allRemainingAccounts))
      .instruction();

    return {
      instruction: ix,
      nftAddress,
    };
  }

  static decodeTypes<T>(typeName: string, data: Buffer) {
    return TicketboxProgram.getInstance()._program!.coder.types.decode<T>(
      typeName,
      data
    );
  }
}

export class ZKNftProgram {
  private static instance: ZKNftProgram;
  private _program: Program<ZkNftProgramType> | null = null;

  private constructor() {}

  static getInstance(): ZKNftProgram {
    if (!ZKNftProgram.instance) {
      ZKNftProgram.instance = new ZKNftProgram();
    }
    return ZKNftProgram.instance;
  }

  getProgram(connection: Connection): Program<ZkNftProgramType> {
    if (!this._program) {
      this.initializeProgram(connection);
    }
    return this._program!;
  }

  private initializeProgram(connection: Connection): void {
    if (!this._program) {
      const mockKeypair = Keypair.generate();

      const mockProvider = new AnchorProvider(
        connection,
        new TicketBoxWallet(mockKeypair),
        confirmConfig
      );

      setProvider(mockProvider);

      this._program = new Program(ZkNftIdl, ZK_NFT_PROGRAM_ID, mockProvider);
    }
  }

  static decodeTypes<T>(
    connection: Connection,
    typeName: string,
    data: Buffer
  ) {
    return ZKNftProgram.getInstance()
      .getProgram(connection)
      .coder.types.decode<T>(typeName, data);
  }
}

const isVersionedTransaction = (
  tx: Transaction | VersionedTransaction
): tx is VersionedTransaction => {
  return "version" in tx;
};

export default class TicketBoxWallet implements Wallet {
  constructor(readonly payer: Keypair) {}

  async signTransaction<T extends Transaction | VersionedTransaction>(
    tx: T
  ): Promise<T> {
    if (isVersionedTransaction(tx)) {
      tx.sign([this.payer]);
    } else {
      tx.partialSign(this.payer);
    }

    return tx;
  }

  async signAllTransactions<T extends Transaction | VersionedTransaction>(
    txs: T[]
  ): Promise<T[]> {
    return txs.map((t) => {
      if (isVersionedTransaction(t)) {
        t.sign([this.payer]);
      } else {
        t.partialSign(this.payer);
      }
      return t;
    });
  }

  get publicKey(): PublicKey {
    return this.payer.publicKey;
  }
}
