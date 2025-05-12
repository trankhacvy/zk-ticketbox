"use client";

import { format } from "date-fns";
import {
  AlertCircle,
  CalendarDays,
  Clock,
  Edit,
  ExternalLinkIcon,
  Globe,
  MapPin,
  QrCodeIcon,
  Share2Icon,
  TrashIcon,
  Users,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef } from "react";

import { Alert, AlertDescription, AlertTitle } from "@acme/ui/components/alert";
import { Badge } from "@acme/ui/components/badge";
import { Button } from "@acme/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@acme/ui/components/card";
import { Separator } from "@acme/ui/components/separator";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@acme/ui/components/tabs";
import type { EventWithCreator } from "@ticketbox/db";
import { QRCodeCanvas } from "qrcode.react";
import { USER_APP_URL } from "@/constants/env";

import { createQR, encodeURL, TransactionRequestURLFields } from "@solana/pay";
import { Keypair } from "@solana/web3.js";

export default function EventViewPage({ event }: { event: EventWithCreator }) {
  // qr
  const qrRef = useRef<HTMLDivElement>(null);
  const reference = useMemo(() => Keypair.generate().publicKey, []);

  if (!event) {
    return (
      <div className="container max-w-5xl mx-auto py-12 px-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            The event you're looking for doesn't exist or has been removed.
          </AlertDescription>
        </Alert>
        <Button asChild className="mt-6">
          <Link href="/admin/events">Back to Events</Link>
        </Button>
      </div>
    );
  }

  const spotsLeft =
    event.maxAttendees > 0 ? event.maxAttendees - event.currentAttendees : null;

  useEffect(() => {
    // The API URL, which will be used to create the Solana Pay URL
    // Append the reference address to the URL as a query parameter
    const { location } = window;
    const apiUrl = `https://nasty-dragonfly-39.telebit.io/api/pay/${event.id}?reference=${reference.toBase58()}`;

    // Create Solana Pay URL
    const urlParams: TransactionRequestURLFields = {
      link: new URL(apiUrl),
    };
    const solanaUrl = encodeURL(urlParams);

    // Create QR code encoded with Solana Pay URL
    const qr = createQR(
      solanaUrl, // The Solana Pay URL
      512, // The size of the QR code
      "transparent" // The background color of the QR code
    );

    console.log("QR Code:", qr);

    // Update the ref with the QR code
    if (qrRef.current) {
      qrRef.current.innerHTML = "";
      qr.append(qrRef.current);
    }
  }, [reference, qrRef.current]);

  return (
    <div className="container px-4 py-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Manage Event</h1>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" asChild>
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={`/events/${event.id}`}
            >
              View Public Page
            </a>
          </Button>
          <Button variant="outline" size="sm">
            <Share2Icon className="mr-2 h-4 w-4" />
            Share
          </Button>
        </div>
      </div>

      {!event.isPublished && (
        <div className="mb-6 rounded-md bg-amber-50 p-4 text-amber-800">
          <p className="text-sm font-medium">
            This event is not published yet. Publish it to make it visible to
            others.
          </p>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xl font-bold">{event.name}</CardTitle>
              <Button variant="ghost" size="sm">
                <Edit className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="mb-4 flex items-center gap-2">
                <Badge
                  variant={
                    event.locationType === "online" ? "secondary" : "outline"
                  }
                >
                  {event.locationType === "online" ? "Online" : "In Person"}
                </Badge>
                <Badge variant={event.isPublished ? "default" : "outline"}>
                  {event.isPublished ? "Published" : "Draft"}
                </Badge>
              </div>

              <div className="mb-6 grid gap-3">
                <div className="flex items-start gap-2">
                  <CalendarDays className="mt-0.5 h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">
                      {format(new Date(event.startAt), "EEEE, MMMM d, yyyy")}
                    </p>
                    {format(new Date(event.startAt), "yyyy-MM-dd") !==
                      format(new Date(event.endAt), "yyyy-MM-dd") && (
                      <p className="text-sm text-muted-foreground">
                        to {format(new Date(event.endAt), "EEEE, MMMM d, yyyy")}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <Clock className="mt-0.5 h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">
                      {format(new Date(event.startAt), "h:mm a")} -{" "}
                      {format(new Date(event.endAt), "h:mm a")}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  {event.locationType === "online" ? (
                    <Globe className="mt-0.5 h-5 w-5 text-muted-foreground" />
                  ) : (
                    <MapPin className="mt-0.5 h-5 w-5 text-muted-foreground" />
                  )}
                  <div>
                    <p className="font-medium">
                      {event.locationName ||
                        (event.locationType === "online"
                          ? "Online Event"
                          : "In Person")}
                    </p>
                    {event.locationType === "offline" &&
                      event.locationAddress && (
                        <p className="text-sm text-muted-foreground">
                          {event.locationAddress}
                        </p>
                      )}
                    {event.locationType === "online" && event.locationUrl && (
                      <p className="text-sm text-muted-foreground">
                        {event.locationUrl}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <Users className="mt-0.5 h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">
                      {event.currentAttendees} /{" "}
                      {event.maxAttendees > 0 ? event.maxAttendees : "∞"}{" "}
                      attendees
                    </p>
                    {event.maxAttendees > 0 && (
                      <p className="text-sm text-muted-foreground">
                        {spotsLeft === 0
                          ? "Event is full"
                          : `${spotsLeft} ${spotsLeft === 1 ? "spot" : "spots"} left`}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {event.thumbnailUrl && (
                <div className="mb-6 overflow-hidden rounded-lg">
                  <Image
                    src={event.thumbnailUrl || "/placeholder.svg"}
                    alt={event.name}
                    width={800}
                    height={400}
                    className="w-full object-cover"
                  />
                </div>
              )}

              <div className="prose max-w-none">
                <h3 className="text-lg font-semibold">Description</h3>
                <div className="whitespace-pre-wrap">{event.description}</div>
              </div>
            </CardContent>
          </Card>

          <div className="mt-6">
            <Tabs defaultValue="nft">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="nft">NFT Details</TabsTrigger>
                <TabsTrigger value="attendees">Attendees</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>

              <TabsContent value="nft" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>NFT Configuration</CardTitle>
                    <CardDescription>
                      Manage the NFT details for this event
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4">
                      <h4 className="mb-2 text-sm font-medium">NFT Address</h4>
                      <div className="flex items-center gap-2">
                        <code className="flex-1 break-all rounded-md bg-slate-100 p-2 text-sm font-mono">
                          {event.address}
                        </code>
                        <a
                          target="_blank"
                          rel="noopener noreferrer"
                          href={`https://photon.helius.dev/address/${event.address}?cluster=devnet`}
                        >
                          <Button variant="ghost" size="icon">
                            <ExternalLinkIcon />
                          </Button>
                        </a>
                      </div>
                    </div>

                    <div className="mb-4">
                      <h4 className="mb-2 text-sm font-medium">
                        Transaction Hash
                      </h4>
                      <div className="flex items-center gap-2">
                        <code className="flex-1 break-all rounded-md bg-slate-100 p-2 text-sm font-mono">
                          {event.transactionHash}
                        </code>
                        <a
                          target="_blank"
                          rel="noopener noreferrer"
                          href={`https://photon.helius.dev/tx/${event.transactionHash}?cluster=devnet`}
                        >
                          <Button variant="ghost" size="icon">
                            <ExternalLinkIcon />
                          </Button>
                        </a>
                      </div>
                    </div>

                    <div className="mt-6">
                      <h4 className="mb-4 text-sm font-medium">
                        QR Code Preview
                      </h4>
                      <div className="flex justify-center">
                        {/* <QRCodeCanvas
                          value={`${USER_APP_URL}/events/${event.id}/mint`}
                          size={240}
                        /> */}
                        <div className="w-[200px] h-[200px]" ref={qrRef} />
                      </div>
                      <div className="mt-4 text-center">
                        <Button variant="outline" size="sm">
                          <QrCodeIcon className="mr-2 h-4 w-4" />
                          Download QR Code
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="attendees" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Attendees</CardTitle>
                    <CardDescription>
                      Manage people who have registered for your event
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">No attendees yet</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="settings" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Event Settings</CardTitle>
                    <CardDescription>
                      Manage your event settings and configuration
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {!event.isPublished ? (
                      <Button className="w-full">Publish Event</Button>
                    ) : (
                      <Button variant="outline" className="w-full">
                        Unpublish Event
                      </Button>
                    )}

                    <Button variant="destructive" className="w-full">
                      <TrashIcon className="mr-2 h-4 w-4" />
                      Delete Event
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Event Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Attendees
                  </p>
                  <p className="text-2xl font-bold">
                    {event.currentAttendees} /{" "}
                    {event.maxAttendees > 0 ? event.maxAttendees : "∞"}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Status
                  </p>
                  <Badge
                    variant={event.isPublished ? "default" : "outline"}
                    className="mt-1"
                  >
                    {event.isPublished ? "Published" : "Draft"}
                  </Badge>
                </div>

                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Created
                  </p>
                  <p className="text-sm">
                    {format(new Date(event.createdAt), "MMMM d, yyyy")}
                  </p>
                </div>

                <Separator />

                <div className="pt-2">
                  <p className="mb-2 text-sm font-medium">Quick Actions</p>
                  <div className="space-y-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full justify-start"
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      Edit Event
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full justify-start"
                    >
                      <Share2Icon className="mr-2 h-4 w-4" />
                      Share Event
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full justify-start"
                    >
                      <QrCodeIcon className="mr-2 h-4 w-4" />
                      Download QR Code
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

interface EventQRCodeProps {
  url: string;
  size?: number;
}

// export function EventQRCode({ url, size = 200 }: EventQRCodeProps) {
//   const canvasRef = useRef<HTMLCanvasElement>(null);

//   // useEffect(() => {
//   //   if (!canvasRef.current) return;

//   //   // Create the QR code data with the event ID and NFT address
//   //   const qrData = JSON.stringify({
//   //     eventId,
//   //     address,
//   //     type: "nft-claim",
//   //   });

//   //   // Generate QR code
//   //   QRCode.toCanvas(canvasRef.current, qrData, {
//   //     width: size,
//   //     margin: 2,
//   //     color: {
//   //       dark: "#000000",
//   //       light: "#ffffff",
//   //     },
//   //     errorCorrectionLevel: "H",
//   //   });
//   // }, [eventId, address, size]);

//   return (
//     <div className="rounded-lg border p-2 bg-white">
//       <QRCodeCanvas value={url}  />
//     </div>
//   );
// }
