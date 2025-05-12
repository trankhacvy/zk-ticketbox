import { Geist, Geist_Mono } from "next/font/google";

import "@acme/ui/globals.css";
import { DashboardProviders } from "@/components/providers";
import { cookies } from "next/headers";
import { getUser } from "@/lib/actions";

const fontSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
});

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";
  
  const userData = await getUser();

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${fontSans.variable} ${fontMono.variable} font-sans antialiased `}
      >
        <DashboardProviders
          defaultOpen={defaultOpen}
          user={userData?.data?.data}
        >
          {children}
        </DashboardProviders>
      </body>
    </html>
  );
}
