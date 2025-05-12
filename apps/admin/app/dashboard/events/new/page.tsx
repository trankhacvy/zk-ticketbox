import PageContainer from "@/components/page-container";
import EventForm from "./_components/event-form";
import { Suspense } from "react";
import { Skeleton } from "@acme/ui/components/skeleton";

export default function Page() {
  return (
    <PageContainer scrollable>
      <div className="flex-1 space-y-4">
        <Suspense fallback={<Skeleton className="w-20 h-6" />}>
          <EventForm pageTitle="New Event" />
        </Suspense>
      </div>
    </PageContainer>
  );
}
