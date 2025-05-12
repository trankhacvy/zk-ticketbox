import { notFound } from "next/navigation";
import { format } from "date-fns";
import {
  CalendarDays,
  Clock,
  MapPin,
  Globe,
  Users,
  ArrowLeftIcon,
} from "lucide-react";
import Image from "next/image";
import type { Metadata } from "next";
import { Button } from "@acme/ui/components/button";
import { Badge } from "@acme/ui/components/badge";
import { Separator } from "@acme/ui/components/separator";
import { getEventById } from "@ticketbox/db";
import Link from "next/link";
// import { EventQRCode } from "@/components/event-qr-code";
// import { getEventById, getCurrentUser, isEventCreator } from "@/lib/mock-data";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ eventId: string }>;
}): Promise<Metadata> {
  const { eventId } = await params;
  const event = await getEventById(eventId);

  if (!event) {
    return {
      title: "Event Not Found",
    };
  }

  return {
    title: event.name,
    description: event.description,
    openGraph: {
      images: event.thumbnailUrl ? [event.thumbnailUrl] : [],
    },
  };
}

export default async function EventPage({
  params,
}: {
  params: Promise<{ eventId: string }>;
}) {
  const { eventId } = await params;
  const event = await getEventById(eventId);

  if (!event) {
    notFound();
  }

  const isCreator = false; //isEventCreator(currentUser.id, event.id);
  const isPublished = event.isPublished;
  const isFull =
    event.maxAttendees > 0 && event.currentAttendees >= event.maxAttendees;
  const spotsLeft =
    event.maxAttendees > 0 ? event.maxAttendees - event.currentAttendees : null;

  // If not published and not the creator, show not found
  if (!isPublished && !isCreator) {
    notFound();
  }

  return (
    <div className="w-full">
      {!isPublished && (
        <div className="mb-6 rounded-md bg-amber-50 p-4 text-amber-800">
          <p className="text-sm font-medium">
            This event is not published yet. Only you can see it.
          </p>
        </div>
      )}

      <div className="p-4 border-b">
        <h1 className="text-xl font-bold flex items-center gap-2">
          <Link href="/explore">
            <Button size="icon" variant="ghost">
              <ArrowLeftIcon className="h-5 w-5" />
            </Button>
          </Link>
          {event.name}
        </h1>
      </div>

      <div className="grid gap-6 md:grid-cols-3 p-4">
        {event.thumbnailUrl && (
          <div className="overflow-hidden aspect-square rounded-lg">
            <Image
              src={event.thumbnailUrl || "/placeholder.svg"}
              alt={event.name}
              width={800}
              height={400}
              className="w-full object-cover"
            />
          </div>
        )}

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
