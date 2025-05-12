import { IdlTypes } from "@coral-xyz/anchor";
import { Ticketbox } from "./idl";
import type { BN } from "@coral-xyz/anchor";
import type { PublicKey } from "@solana/web3.js";

export type CreateTicketBoxParams =
  IdlTypes<Ticketbox>["CreateTicketBoxParams"];

export type LightInstructionData =
  | IdlTypes<Ticketbox>["ticketbox::state::LightInstructionData"]
  | IdlTypes<Ticketbox>["zk_nft::state::LightInstructionData"];

export type TicketBox = {
  authority: PublicKey;
  id: string;
  startAt: BN;
  endAt: BN;
  collection: PublicKey;
  totalMinted: BN;
  maxSupply: BN;
  isActive: boolean;
  eventName: string;
  metadataUri: string;
};

export type Key =
  | { uninitialized: {} }
  | { assetV1: {} }
  | { collectionV1: {} };

export type UpdateAuthority =
  | { none: {} }
  | {
      address: {
        0: PublicKey;
      };
    }
  | {
      collection: {
        0: PublicKey;
      };
    };

export type AssetV1 = {
  key: Key;
  owner: PublicKey;
  updateAuthority: UpdateAuthority;
  name: string;
  uri: string;
};

export type CollectionV1 = {
  key: Key;
  updateAuthority: PublicKey;
  name: string;
  uri: string;
  numMinted: number;
  currentSize: number;
};

export type AssetV1WithAddress = AssetV1 & {
  address: PublicKey;
};
