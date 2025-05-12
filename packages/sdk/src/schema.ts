import { struct, u64, bool, publicKey, str, i64 } from "@coral-xyz/borsh";

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
