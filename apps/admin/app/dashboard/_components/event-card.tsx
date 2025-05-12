import Image from "next/image";
import {
  CalendarDays,
  Edit,
  EyeIcon,
  GlobeIcon,
  MapPinIcon,
  User2Icon,
} from "lucide-react";
import { format } from "date-fns";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@acme/ui/components/card";
import { Badge } from "@acme/ui/components/badge";
import { Button } from "@acme/ui/components/button";
import type { Event } from "@ticketbox/db";
import Link from "next/link";

interface EventCardProps {
  event: Event;
}

export function EventCard({ event }: EventCardProps) {
  return (
    <Card key={event.id} className="overflow-hidden flex flex-col py-0">
      <div className="aspect-video relative">
        <Image
          src={event.thumbnailUrl || "/placeholder.svg?height=200&width=400"}
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
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="line-clamp-1">{event.name}</CardTitle>
          <Badge
            variant={event.locationType === "online" ? "secondary" : "outline"}
          >
            {event.locationType === "online" ? "Online" : "In Person"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="mb-4 space-y-2">
          <div className="flex items-center text-sm">
            <CalendarDays className="mr-2 h-4 w-4 text-muted-foreground" />
            <span>{format(new Date(event.startAt), "EEEE, MMMM d, yyyy")}</span>
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
      <CardFooter className="flex gap-2 pb-6">
        <Button variant="outline" asChild className="flex-1">
          <a target="_blank" rel="noopener" href={`/events/${event.id}`}>
            <EyeIcon className="mr-2 h-4 w-4" />
            View
          </a>
        </Button>
        <Button asChild className="flex-1">
          <Link href={`/dashboard/events/${event.id}`}>
            <Edit className="mr-2 h-4 w-4" />
            Manage
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
