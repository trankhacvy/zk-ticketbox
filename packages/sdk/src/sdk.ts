import { bn, buildTx, Rpc } from "@lightprotocol/stateless.js";
import bs58 from "bs58";
import {
  ComputeBudgetProgram,
  PublicKey,
  Transaction,
  TransactionInstruction,
  VersionedTransaction,
} from "@solana/web3.js";
import type {
  AssetV1,
  AssetV1WithAddress,
  CollectionV1,
  CreateTicketBoxParams,
  TicketBox,
} from "./types";
import { TicketboxProgram, ZKNftProgram } from "./program";
import { TicketBoxAccountLayout } from "./schema";
import { ZK_NFT_PROGRAM_ID } from "./constants";

export async function createTicketBoxIx(
  rpc: Rpc,
  payer: PublicKey,
  params: CreateTicketBoxParams,
  collectionKey: PublicKey
) {
  const { ticketBoxAddress, instruction } =
    await TicketboxProgram.createTicketBox(rpc, payer, params, collectionKey);

  return {
    ticketBoxAddress,
    instruction,
  };
}

export async function mintPoPIx(
  rpc: Rpc,
  payer: PublicKey,
  owner: PublicKey | null,
  ticketBoxAddress: PublicKey,
  assetKey: PublicKey
) {
  const { nftAddress, instruction } = await TicketboxProgram.mintPoP(
    rpc,
    payer,
    owner,
    ticketBoxAddress,
    assetKey
  );

  return {
    nftAddress,
    instruction,
  };
}

export async function mintPoPV2Ix(
  rpc: Rpc,
  payer: PublicKey,
  owner: PublicKey,
  ticketBoxAddress: PublicKey,
  assetKey: PublicKey
) {
  const { nftAddress, instruction } = await TicketboxProgram.mintPoPv2(
    rpc,
    payer,
    owner,
    ticketBoxAddress,
    assetKey
  );

  return {
    nftAddress,
    instruction,
  };
}

export async function getTickeBox(rpc: Rpc, address: PublicKey) {
  const account = await rpc.getCompressedAccount(bn(address.toBytes()));

  if (!account || !account.data) {
    throw new Error("Account not found");
  }

  const ticketBoxAccount = TicketBoxAccountLayout.decode(
    account.data.data
  ) as TicketBox;

  return ticketBoxAccount;
}

export async function buildTxWithComputeBudget(
  rpc: Rpc,
  instructions: TransactionInstruction[],
  payerPubkey: PublicKey
): Promise<VersionedTransaction> {
  const setComputeUnitIx = ComputeBudgetProgram.setComputeUnitLimit({
    units: 1_000_000,
  });
  instructions.unshift(setComputeUnitIx);
  const { blockhash } = await rpc.getLatestBlockhash();

  const transaction = buildTx(instructions, payerPubkey, blockhash);

  return transaction;
}

export async function buildTxWithComputeBudgetv1(
  rpc: Rpc,
  instructions: TransactionInstruction[],
  payerPubkey: PublicKey
): Promise<Transaction> {
  const setComputeUnitIx = ComputeBudgetProgram.setComputeUnitLimit({
    units: 1_000_000,
  });
  instructions.unshift(setComputeUnitIx);

  const {
    value: { blockhash },
  } = await rpc.getLatestBlockhashAndContext();

  const transaction = new Transaction({
    feePayer: payerPubkey,
    recentBlockhash: blockhash,
  }).add(...instructions);

  return transaction;
}

export async function getAsset(rpc: Rpc, assetAddress: PublicKey) {
  const assetAccount = await rpc.getCompressedAccount(
    bn(assetAddress.toBytes())
  );

  if (!assetAccount || !assetAccount.data) {
    throw new Error("Asset account not found");
  }
  const asset = ZKNftProgram.decodeTypes<AssetV1>(
    rpc,
    "AssetV1",
    assetAccount.data.data
  );

  return asset;
}

export async function getCollection(rpc: Rpc, collectionAddress: PublicKey) {
  const collectionAccount = await rpc.getCompressedAccount(
    bn(collectionAddress.toBytes())
  );

  if (!collectionAccount || !collectionAccount.data) {
    throw new Error("Collection account not found");
  }
  const asset = ZKNftProgram.decodeTypes<CollectionV1>(
    rpc,
    "CollectionV1",
    collectionAccount.data.data
  );

  return asset;
}

export async function getAssets(rpc: Rpc, assetAddresses: PublicKey[]) {
  const assetAccounts = await Promise.all(
    assetAddresses.map((address) =>
      rpc.getCompressedAccount(bn(address.toBytes()))
    )
  );

  return assetAccounts.map((account, index) => {
    if (!account || !account.data) {
      throw new Error(
        `Asset account not found for address: ${assetAddresses[index].toBase58()}`
      );
    }
    return ZKNftProgram.decodeTypes<AssetV1>(rpc, "AssetV1", account.data.data);
  });
}

export async function getAssetsByOwner(
  rpc: Rpc,
  owner: PublicKey
): Promise<AssetV1WithAddress[]> {
  const assets = await rpc.getCompressedAccountsByOwner(ZK_NFT_PROGRAM_ID, {
    filters: [
      {
        memcmp: {
          bytes: bs58.encode([1]),
          offset: 0,
        },
      },
      {
        memcmp: {
          bytes: owner.toBase58(),
          offset: 1,
        },
      },
    ],
  });

  return assets.items.map((account) => {
    if (!account || !account.data || !account.address) {
      throw new Error("Asset account not found");
    }

    const asset = ZKNftProgram.decodeTypes<AssetV1>(
      rpc,
      "AssetV1",
      account.data.data
    );

    return {
      ...asset,
      address: new PublicKey(account.address),
    };
  });
}
