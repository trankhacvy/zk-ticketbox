"use client";

import * as React from "react";
import { SidebarInset, SidebarProvider } from "@acme/ui/components/sidebar";
import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes";
import { PrivyProvider, PrivyClientConfig } from "@privy-io/react-auth";
import { toSolanaWalletConnectors } from "@privy-io/react-auth/solana";
import SkipToMain from "./skip-to-main";
import { AppSidebar } from "./app-sidebar";
import { Header } from "./header";
import { PRIVY_APP_ID, SOLANA_RPC_URL } from "@/constants/env";
import { TicketBoxUser } from "@/types/user";
import { Toaster } from "@acme/ui/components/sonner";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      enableColorScheme
    >
      <PrivyWrapper>{children}</PrivyWrapper>
      <Toaster />
    </NextThemesProvider>
  );
}

export function DashboardProviders({
  children,
  defaultOpen = true,
  user,
}: {
  children: React.ReactNode;
  defaultOpen?: boolean;
  user?: TicketBoxUser;
}) {
  return (
    <>
      <SidebarProvider defaultOpen={defaultOpen}>
        <SkipToMain />
        {user && <AppSidebar user={user} />}
        <SidebarInset>
          <Header />
          {children}
        </SidebarInset>
      </SidebarProvider>
    </>
  );
}

const PrivyWrapper: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { theme } = useTheme();

  const solanaConnectors = toSolanaWalletConnectors({
    shouldAutoConnect: true,
  });

  const privyConfig: PrivyClientConfig = React.useMemo(() => {
    return {
      // embeddedWallets: {
      //   createOnLogin: 'users-without-wallets',
      //   requireUserPasswordOnCreate: true,
      //   noPromptOnSignature: false,
      //   showWalletUIs: true
      // },
      loginMethods: ["wallet", "email", "twitter"],
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
    <PrivyProvider appId={PRIVY_APP_ID} config={privyConfig}>
      {children}
    </PrivyProvider>
  );
};
