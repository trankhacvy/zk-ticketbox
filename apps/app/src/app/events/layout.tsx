import { Metadata } from "next";
import "@acme/ui/globals.css";
import { Providers } from "@/components/providers";

export const metadata: Metadata = {
  title: "TicketBox",
  description:
    "TicketBox is a ticketing platform that allows users to create and manage events, sell tickets, and track attendance.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
