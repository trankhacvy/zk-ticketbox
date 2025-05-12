import { Main } from "@/components/main";
import { Button } from "@acme/ui/components/button";
import Link from "next/link";
import { PlusIcon } from "lucide-react";
import { EventCard } from "../_components/event-card";
import { getEvents } from "@ticketbox/db";

export default async function Page() {
  const events = await getEvents();

  return (
    <Main>
      <div className="mb-2 flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Events</h2>
          <p className="text-muted-foreground">
            Manage your events, track attendance, and configure NFT settings.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Link href="/dashboard/events/new">
            <Button>
              <PlusIcon />
              New Event
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {events.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </Main>
  );
}
