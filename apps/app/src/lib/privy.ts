import { PRIVY_APP_ID, PRIVY_APP_SECRET } from "@/lib/env";
import { PrivyClient } from "@privy-io/server-auth";

export const privyServerClient = new PrivyClient(
  PRIVY_APP_ID,
  PRIVY_APP_SECRET
);
