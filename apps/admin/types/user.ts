import type {
  User as PrivyUser,
  WalletWithMetadata,
} from "@privy-io/react-auth";
import type { User as DbUser } from "@ticketbox/db";

export type TicketBoxUser = Omit<DbUser, "wallet"> & {
  privyUser: PrivyUser;
  wallet?: WalletWithMetadata;
};
