"use client";

import { usePathname, useRouter } from "next/navigation";
import { User, Compass, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

export default function BottomNavigation() {
  const pathname = usePathname();
  const router = useRouter();

  const navItems = [
    {
      name: "Profile",
      icon: User,
      path: "/",
    },
    {
      name: "Explore",
      icon: Compass,
      path: "/explore",
    },
    {
      name: "Settings",
      icon: Settings,
      path: "/settings",
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 border-t bg-background z-10">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const isActive = pathname === item.path;

          return (
            <button
              key={item.name}
              className={cn(
                "flex flex-col items-center justify-center w-full h-full",
                isActive ? "text-primary" : "text-muted-foreground"
              )}
              onClick={() => router.push(item.path)}
            >
              <item.icon
                className={cn("h-5 w-5", isActive && "text-primary")}
              />
              <span className="text-xs mt-1">{item.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
