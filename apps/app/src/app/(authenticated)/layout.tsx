import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@acme/ui/globals.css";
import "../theme.css";
import { ScrollArea } from "@acme/ui/components/scroll-area";
import BottomNavigation from "@/components/bottom-navigation";
import { Providers } from "@/components/providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TicketBox",
  description:
    "TicketBox is a ticketing platform that allows users to create and manage events, sell tickets, and track attendance.",
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>): React.ReactElement {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (localStorage.theme === 'dark' || ((!('theme' in localStorage) || localStorage.theme === 'system') && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.querySelector('meta[name="theme-color"]').setAttribute('content', '#09090b')
                }
              } catch (_) {}
            `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased theme-amber`}
        suppressHydrationWarning
      >
        <Providers>
          <div className="max-w-md flex mx-auto bg-background">
            <ScrollArea className="w-full pb-[70px]">{children}</ScrollArea>
            <BottomNavigation />
          </div>
        </Providers>
      </body>
    </html>
  );
}
