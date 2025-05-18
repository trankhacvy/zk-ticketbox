"use client";

// @ts-expect-error
import { unstable_ViewTransition as ViewTransition } from "react";
import Image from "next/image";
import {
  CalendarDays,
  GlobeIcon,
  MapPinIcon,
  Search,
  User2Icon,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@acme/ui/components/card";
import { Input } from "@acme/ui/components/input";
import { ScrollArea } from "@acme/ui/components/scroll-area";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@acme/ui/components/tabs";
import type { Event } from "@ticketbox/db";
import { Badge } from "@acme/ui/components/badge";
import { format } from "date-fns";
import Link from "next/link";

export default function EventListingPage({ events }: { events: Event[] }) {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1 pb-16">
        <div className="p-4 border-b">
          <h1 className="text-xl font-bold mb-3">Explore Events</h1>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search events..." className="pl-9" />
          </div>
        </div>

        <Tabs defaultValue="upcoming" className="w-full px-4 pt-4">
          <TabsList className="w-full grid grid-cols-2">
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="popular">Popular</TabsTrigger>
          </TabsList>
          <TabsContent value="upcoming" className="p-0">
            <ScrollArea className="h-[calc(100vh-180px)]">
              <div className="space-y-4">
                {events.map((event) => (
                  <EventCard event={event} />
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
          <TabsContent value="popular" className="p-0">
            <ScrollArea className="h-[calc(100vh-180px)]">
              <div>
                {events.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

interface EventCardProps {
  event: Event;
}

export function EventCard({ event }: EventCardProps) {
  return (
    <Link href={`/explore/${event.id}`}>
      <Card key={event.id} className="overflow-hidden flex flex-col py-0">
        <ViewTransition name={`event-thumbnail-${event.id}`}>
          <div className="aspect-square relative">
            <Image
              src={
                event.thumbnailUrl || "/placeholder.svg?height=200&width=400"
              }
              alt={event.name}
              fill
              className="object-cover"
            />
            {!event.isPublished && (
              <div className="absolute top-2 left-2">
                <Badge variant="outline" className="bg-white">
                  Draft
                </Badge>
              </div>
            )}
          </div>
        </ViewTransition>
        <CardHeader>
          <div className="flex justify-between items-start">
            <ViewTransition name={`event-title-${event.id}`}>
              <CardTitle className="line-clamp-1">{event.name}</CardTitle>
            </ViewTransition>
            <Badge
              variant={
                event.locationType === "online" ? "secondary" : "outline"
              }
            >
              {event.locationType === "online" ? "Online" : "In Person"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="flex-grow">
          <div className="mb-4 space-y-2">
            <div className="flex items-center text-sm">
              <CalendarDays className="mr-2 h-4 w-4 text-muted-foreground" />
              <span>
                {format(new Date(event.startAt), "EEEE, MMMM d, yyyy")}
              </span>
            </div>
            <div className="flex items-center text-sm">
              {event.locationType === "online" ? (
                <GlobeIcon className="mr-2 h-4 w-4 text-muted-foreground" />
              ) : (
                <MapPinIcon className="mr-2 h-4 w-4 text-muted-foreground" />
              )}
              <span>
                {event.locationName ||
                  (event.locationType === "online"
                    ? "Online Event"
                    : "In Person")}
              </span>
            </div>
            <div className="flex items-center text-sm">
              <User2Icon className="mr-2 h-4 w-4 text-muted-foreground" />
              <span>
                {event.currentAttendees} /{" "}
                {event.maxAttendees > 0 ? event.maxAttendees : "∞"} attendees
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
