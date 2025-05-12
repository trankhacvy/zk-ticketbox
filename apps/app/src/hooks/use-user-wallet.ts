import { usePrivy, WalletWithMetadata } from "@privy-io/react-auth";
import { useMemo } from "react";

export const useUserWallet = () => {
  const { user } = usePrivy();

  const account = useMemo(() => {
    const linkedAccount = user?.linkedAccounts.find(
      (la) =>
        la.type === "wallet" &&
        la.walletClientType === "privy" &&
        la.chainType === "solana"
    );

    return linkedAccount;
  }, [user]);

  return {
    account: (account as WalletWithMetadata) ?? null,
  };
};
