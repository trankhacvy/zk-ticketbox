import EventListingPage from "./_components/event-listing-page";
import { getEvents } from "@ticketbox/db";

export default async function ExplorePage() {
  const events = await getEvents();

  return <EventListingPage events={events} />;
}
