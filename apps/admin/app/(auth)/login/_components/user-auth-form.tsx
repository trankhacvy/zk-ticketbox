"use client";

import type React from "react";
import { GalleryVerticalEnd } from "lucide-react";

import { cn } from "@acme/ui/lib/utils";
import { Button } from "@acme/ui/components/button";
import { Input } from "@acme/ui/components/input";
import { Label } from "@acme/ui/components/label";
import useLogin from "@/hooks/use-login";

export function LoginForm() {
  const { login, disable } = useLogin();

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div>
          <div className="flex flex-col gap-6">
            <div className="flex flex-col items-center gap-2">
              <a
                href="#"
                className="flex flex-col items-center gap-2 font-medium"
              >
                <div className="flex size-24 items-center justify-center rounded-md">
                  <img
                    src="/logo.png"
                    width={96}
                    height={96}
                    className="size-24 object-cover"
                  />
                </div>
                <span className="sr-only">TicketBox</span>
              </a>
              <h1 className="text-3xl font-bold">Welcome to TicketBox.</h1>
            </div>
            <div className="flex flex-col gap-6">
              <Button size="lg" onClick={login} className="w-full">
                Login
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
