"use client";

import { MoreVertical, LogOutIcon } from "lucide-react";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@acme/ui/components/dropdown-menu";
import { usePrivy } from "@privy-io/react-auth";
import type { User } from "@privy-io/server-auth";
import { useRouter } from "next/navigation";

export default function UserProfile({ user }: { user: User }) {
  const { logout } = usePrivy();
  const router = useRouter();

  const account = user.linkedAccounts.find((lc) => lc.type === "twitter_oauth");

  return (
    <>
      <div className="relative">
        <div className="h-40 bg-gradient-to-br from-red-300 via-blue-200 to-yellow-200 relative overflow-hidden">
          <div className="absolute inset-0 opacity-80">
            <svg viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M0,100 L100,0 L200,100 L300,50 L400,150"
                fill="none"
                stroke="rgba(255,255,255,0.3)"
                strokeWidth="60"
              />
              <path
                d="M0,150 L100,50 L200,180 L300,100 L400,200"
                fill="none"
                stroke="rgba(0,200,255,0.4)"
                strokeWidth="40"
              />
              <path
                d="M0,50 L100,150 L200,50 L300,150 L400,50"
                fill="none"
                stroke="rgba(255,100,100,0.5)"
                strokeWidth="50"
              />
            </svg>
          </div>
        </div>

        <div className="absolute top-4 right-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="bg-white p-2 rounded-full shadow-md">
                <MoreVertical size={20} />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem
                onClick={() => {
                  logout();
                  router.push("/login");
                }}
                className="text-red-500"
              >
                <LogOutIcon className="mr-2 h-4 w-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="flex flex-col items-center -mt-12 px-4">
        <div className="w-24 h-24 rounded-full border-4 border-white overflow-hidden relative shadow-lg">
          <Image
            src={
              account?.profilePictureUrl?.replace("_normal", "") ??
              "/avatar.png"
            }
            alt={account?.name ?? "User"}
            width={96}
            height={96}
            className="object-cover"
          />
          <div className="absolute hidden inset-0 bg-gradient-to-br from-purple-500 via-blue-400 to-pink-400 opacity-80">
            <svg
              viewBox="0 0 100 100"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-full"
            >
              <path
                d="M30,40 C35,20 65,20 70,40 C75,60 65,80 50,70 C35,80 25,60 30,40"
                fill="none"
                stroke="#fff"
                strokeWidth="4"
              />
              <path
                d="M40,30 C45,40 55,40 60,30"
                fill="none"
                stroke="#fff"
                strokeWidth="3"
              />
            </svg>
          </div>
        </div>

        <div className="mt-3 flex items-center">
          <h1 className="text-2xl font-bold">{account?.name}</h1>
          <div className="ml-2 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
            <svg
              viewBox="0 0 24 24"
              width="14"
              height="14"
              stroke="white"
              strokeWidth="3"
              fill="none"
            >
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>
        </div>
      </div>
    </>
  );
}
