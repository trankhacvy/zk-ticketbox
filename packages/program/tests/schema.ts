import {
  struct,
  u64,
  bool,
  publicKey,
  str,
  i64,
} from "@coral-xyz/borsh";
import { PublicKey } from "@solana/web3.js";
import BN from "bn.js";

export const TicketBoxAccountLayout = struct(
  [
    publicKey("authority"),
    str("id"),
    i64("startAt"),
    i64("endAt"),
    publicKey("collection"),
    u64("totalMinted"),
    u64("maxSupply"),
    bool("isActive"),
    str("eventName"),
    str("metadataUri"),
  ],
  "ticketBox"
);

export const TicketBoxEventAccountLayout = struct(
  [str("eventName"), str("metadataUri")],
  "ticketBoxEvent"
);

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

export type TicketBoxEvent = {
  eventName: string;
  metadataUri: string;
};

export const AssetV1AccountLayout = struct(
  [
    // rustEnum([struct([], "uninitialized")], "key"),
    str("key"),
    publicKey("owner"),
    // rustEnum([struct([], "none")], "updateAuthority"),
    str("updateAuthority"),
    str("name"),
    str("uri"),
  ],
  "assetV1"
);

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
