import { useCallback, useEffect, useState } from "react";
import useSWR, { KeyedMutator } from "swr";
import { getUser } from "@/lib/actions";
import { PrivyInterface, usePrivy } from "@privy-io/react-auth";
import { useRouter } from "next/navigation";
import type { TicketBoxUser } from "@/types/user";

export const USER_STORAGE_KEY = "ticketbox-user";

const useTicketBoxUser = (): {
  user: TicketBoxUser | null | undefined;
  isLoading: boolean;
  logout: () => Promise<void>;
  reloadUser: KeyedMutator<TicketBoxUser | null>;
} & Omit<PrivyInterface, "logout" | "user" | "ready"> => {
  const { ready, user, logout: privyLogout, ...rest } = usePrivy();
  const router = useRouter();

  const [initialUser, setInitialUser] = useState<TicketBoxUser | null>(null);

  const queryKey = ready && user ? ["user", user.id] : null;

  const {
    data: ticketBoxUser,
    isLoading,
    mutate,
  } = useSWR<TicketBoxUser | null>(
    queryKey,
    async () => {
      if (!ready || !user) return null;

      const makeUserData = await getUser();

      if (!makeUserData?.data?.data) return null;

      return makeUserData.data.data;
    },
    {
      fallbackData: initialUser,
      revalidateOnFocus: false,
      shouldRetryOnError: false,
    }
  );

  const logout = useCallback(async () => {
    router.push("/refresh");

    try {
      await privyLogout();

      localStorage.removeItem(USER_STORAGE_KEY);

      router.replace("/login");
    } catch (error) {
      console.error("Failed to logout user", error);
      router.replace("/");
    }
  }, [privyLogout, router]);

  useEffect(() => {
    function loadCachedUser() {
      const userStr = localStorage.getItem(USER_STORAGE_KEY);
      try {
        const user = userStr ? JSON.parse(userStr) : null;
        if (user) {
          setInitialUser(user);
        }
      } catch (error) {
        console.error("Failed to parse user from local storage", error);
      }
    }

    loadCachedUser();
  }, []);

  useEffect(() => {
    function saveUser() {
      if (ticketBoxUser) {
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(ticketBoxUser));
      }
    }

    saveUser();
  }, [ticketBoxUser]);

  return {
    user: ticketBoxUser,
    isLoading: isLoading || !initialUser || !ticketBoxUser,
    logout,
    reloadUser: mutate,
    ...rest,
  };
};

export default useTicketBoxUser;
