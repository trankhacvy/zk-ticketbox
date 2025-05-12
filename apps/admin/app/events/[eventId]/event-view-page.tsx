"use client";

import { format } from "date-fns";
import {
  AlertCircle,
  CalendarDays,
  Clock,
  Globe,
  MapPin,
  Users,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef } from "react";

import { Alert, AlertDescription, AlertTitle } from "@acme/ui/components/alert";
import { Badge } from "@acme/ui/components/badge";
import { Button } from "@acme/ui/components/button";
import { Separator } from "@acme/ui/components/separator";
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

  const isCreator = false; //isEventCreator(currentUser.id, event.id);
  const isPublished = event.isPublished;
  const isFull =
    event.maxAttendees > 0 && event.currentAttendees >= event.maxAttendees;
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
    <div className="container mx-auto max-w-4xl py-10">
      {!isPublished && (
        <div className="mb-6 rounded-md bg-amber-50 p-4 text-amber-800">
          <p className="text-sm font-medium">
            This event is not published yet. Only you can see it.
          </p>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-3 items-start">
        <div className="md:col-span-2">
          <div className="mb-4 flex items-center gap-2">
            <Badge
              variant={
                event.locationType === "online" ? "secondary" : "outline"
              }
            >
              {event.locationType === "online" ? "Online" : "In Person"}
            </Badge>
            {isCreator && (
              <Badge variant="outline" className="ml-auto">
                Creator View
              </Badge>
            )}
          </div>

          <h1 className="mb-4 text-3xl font-bold">{event.name}</h1>

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
                <p className="text-sm text-muted-foreground">
                  {Math.round(
                    (new Date(event.endAt).getTime() -
                      new Date(event.startAt).getTime()) /
                      (1000 * 60 * 60)
                  )}{" "}
                  hours
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
                {event.locationType === "offline" && event.locationAddress && (
                  <p className="text-sm text-muted-foreground">
                    {event.locationAddress}
                  </p>
                )}
                {event.locationType === "online" &&
                  event.locationUrl &&
                  isCreator && (
                    <p className="text-sm text-muted-foreground">
                      {event.locationUrl}
                    </p>
                  )}
              </div>
            </div>

            {event.maxAttendees > 0 && (
              <div className="flex items-start gap-2">
                <Users className="mt-0.5 h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">
                    {event.currentAttendees} / {event.maxAttendees} attendees
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {spotsLeft === 0
                      ? "Event is full"
                      : `${spotsLeft} ${spotsLeft === 1 ? "spot" : "spots"} left`}
                  </p>
                </div>
              </div>
            )}
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
            <h2 className="text-xl font-semibold">About this event</h2>
            <div className="whitespace-pre-wrap">{event.description}</div>
          </div>

          <Separator className="my-8" />

          <div className="mb-6">
            <h2 className="mb-4 text-xl font-semibold">NFT Details</h2>
            <div className="rounded-md bg-slate-50 p-4">
              <p className="mb-2 text-sm font-medium">NFT Address</p>
              <p className="mb-4 break-all rounded-md bg-white p-2 text-sm font-mono">
                {event.address}
              </p>
              <p className="mb-2 text-sm font-medium">Transaction Hash</p>
              <p className="break-all rounded-md bg-white p-2 text-sm font-mono">
                {event.transactionHash}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border p-6">
          <div className="mb-4 text-center">
            <h2 className="text-xl font-semibold">Event NFT</h2>
            <p className="text-sm text-muted-foreground">
              Scan to claim your NFT
            </p>
          </div>

          <div className="mb-6 flex justify-center">
            {/* <EventQRCode eventId={event.id} address={event.address} /> */}
            <QRCodeCanvas
              value={`${USER_APP_URL}/events/${event.id}/mint`}
              size={240}
            />
          </div>

          {!isCreator && (
            <Button className="w-full" disabled={isFull}>
              {isFull ? "Event is Full" : "Register Now"}
            </Button>
          )}

          {isCreator && (
            <div className="space-y-3">
              <Button className="w-full" variant="outline" asChild>
                <a href={`/admin/events/${event.id}`}>Manage Event</a>
              </Button>

              {!isPublished && (
                <Button className="w-full">Publish Event</Button>
              )}
            </div>
          )}

          <div className="mt-4 text-center text-sm text-muted-foreground">
            <p>{event.currentAttendees} people attending</p>
          </div>
        </div>
      </div>
    </div>
  );
}
