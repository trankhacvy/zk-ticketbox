import Link from "next/link";

import { Button } from "@acme/ui/components/button";
import { getEventById } from "@ticketbox/db";
import EventViewPage from "./_components/event-view-page";

export type paramsType = Promise<{ id: string }>;

export default async function Page(props: {
  params: Promise<{ eventId: string }>;
}) {
  const params = await props.params;
  const event = await getEventById(params.eventId);

  if (!event) {
    return (
      <div className="container max-w-4xl mx-auto py-12 px-4">
        <h1 className="text-2xl font-bold">Event not found</h1>
        <p className="mt-4">
          The event you're looking for doesn't exist or has been removed.
        </p>
        <Button asChild className="mt-6">
          <Link href="/">Browse Events</Link>
        </Button>
      </div>
    );
  }

  return <EventViewPage event={event} />;
}
