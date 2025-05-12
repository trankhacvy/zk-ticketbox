"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Skeleton } from "@acme/ui/components/skeleton";
import { usePrivy } from "@privy-io/react-auth";

export default function RefreshPage() {
  const { getAccessToken } = usePrivy();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    async function refreshAndRedirect() {
      try {
        const token = await getAccessToken();
        
        const redirectUri = searchParams.get("redirect_uri") || "/login";

        if (token) {
          router.replace(redirectUri);
        } else {
          router.replace(
            `/${redirectUri !== "/login" ? `?redirect_uri=${redirectUri}` : ""}`
          );
        }
      } catch (error) {
        console.error("Error refreshing token:", error);
        router.replace("/login");
      }
    }

    refreshAndRedirect();
  }, [getAccessToken, router, searchParams]);

  return <Skeleton />;
}
