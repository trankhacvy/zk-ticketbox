import { Suspense } from "react";
import { Skeleton } from "@acme/ui/components/skeleton";
import RefreshPage from "./_refresh-page";

export default function Page() {
  return (
    <Suspense fallback={<Skeleton />}>
      <RefreshPage />
    </Suspense>
  );
}
