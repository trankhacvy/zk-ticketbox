import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "TicketBox",
    short_name: "TicketBox",
    description:
      "TicketBox is a ticketing platform that allows users to create and manage events, sell tickets, and track attendance.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#FF3030",
    icons: [
      {
        src: "/icons/web-app-manifest-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icons/web-app-manifest-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
