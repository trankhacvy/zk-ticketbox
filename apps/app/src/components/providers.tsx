"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes";
import {
  PrivyProvider as RawPrivyProvider,
  PrivyClientConfig,
} from "@privy-io/react-auth";
import { toSolanaWalletConnectors } from "@privy-io/react-auth/solana";
import { PRIVY_APP_ID, SOLANA_RPC_URL } from "@/lib/env";
import { Toaster } from "@acme/ui/components/sonner";
import { PWAInstallDialog } from "./pwa-install-dialog";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange
      enableColorScheme
    >
      <PrivyProvider>
        {children}
        <Toaster />
        <PWAInstallDialog />
      </PrivyProvider>
    </NextThemesProvider>
  );
}

const PrivyProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { theme } = useTheme();

  const solanaConnectors = toSolanaWalletConnectors({
    shouldAutoConnect: true,
  });

  const privyConfig: PrivyClientConfig = React.useMemo(() => {
    return {
      embeddedWallets: {
        createOnLogin: "users-without-wallets",
        requireUserPasswordOnCreate: true,
        noPromptOnSignature: false,
        showWalletUIs: true,
        ethereum: {
          createOnLogin: "off",
        },
        solana: {
          createOnLogin: "all-users",
        },
      },
      loginMethods: ["twitter"],
      appearance: {
        showWalletLoginFirst: true,
        walletChainType: "solana-only",
        theme: theme === "dark" ? "dark" : "light",
      },
      solanaClusters: [
        {
          name: "devnet",
          rpcUrl: SOLANA_RPC_URL,
        },
        // {
        //   name: "mainnet-beta",
        //   rpcUrl: SOLANA_MAINNET_RPC_URL,
        // },
      ],
      externalWallets: {
        solana: {
          connectors: solanaConnectors,
        },
      },
    };
  }, []);

  return (
    <RawPrivyProvider appId={PRIVY_APP_ID} config={privyConfig}>
      {children}
    </RawPrivyProvider>
  );
};
