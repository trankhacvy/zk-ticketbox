"use client";

import { usePathname, useRouter } from "next/navigation";
import { Compass, Home, Settings2 } from "lucide-react";

export function BottomNav() {
  const router = useRouter();
  const pathname = usePathname();

  const tabs = [
    { name: "home", path: "/", icon: Home },
    { name: "explore", path: "/explore", icon: Compass },
    { name: "Settings", path: "/settings", icon: Settings2 },
  ];

  return (
    <div className="fixed max-w-md mx-auto w-full bottom-0 left-0 right-0 border-t bg-white">
      <div className="flex justify-between px-4 py-3 max-w-md mx-auto">
        {tabs.map((tab) => {
          const isActive = pathname === tab.path;
          const Icon = tab.icon;

          return (
            <button
              key={tab.name}
              className={`flex flex-col items-center w-1/5 ${
                isActive ? "text-orange-400" : "text-gray-400"
              }`}
              onClick={() => router.push(tab.path)}
            >
              <Icon className="h-6 w-6" />
              <span className="text-xs mt-1 capitalize">{tab.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
