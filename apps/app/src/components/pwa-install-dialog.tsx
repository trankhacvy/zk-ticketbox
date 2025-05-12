"use client";

import { useEffect, useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@acme/ui/components/alert-dialog";
import { Checkbox } from "@acme/ui/components/checkbox";
import { Label } from "@acme/ui/components/label";

export function PWAInstallDialog() {
  const [open, setOpen] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [dontShowAgain, setDontShowAgain] = useState(false);

  useEffect(() => {
    // Check if user has previously chosen not to see the prompt
    const dontShowPWAPrompt = localStorage.getItem("dontShowPWAPrompt");

    if (dontShowPWAPrompt === "true") {
      return;
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      console.log("beforeinstallprompt event fired");
      e.preventDefault();

      setDeferredPrompt(e);

      setOpen(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) {
      return;
    }

    const { outcome } = await deferredPrompt.prompt();

    console.log(`User response to the install prompt: ${outcome}`);

    setDeferredPrompt(null);
    setOpen(false);
  };

  const handleCancel = () => {
    setOpen(false);

    if (dontShowAgain) {
      localStorage.setItem("dontShowPWAPrompt", "true");
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Install TicketBox</AlertDialogTitle>
          <AlertDialogDescription>
            Would you like to install this app on your device? It will be
            available offline and provide a better experience.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="flex items-center space-x-2 py-4">
          <Checkbox
            id="dontShowAgain"
            checked={dontShowAgain}
            onCheckedChange={(checked) => setDontShowAgain(checked as boolean)}
          />
          <Label htmlFor="dontShowAgain">Don&apos;t show this again</Label>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleCancel}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleInstall}>Install</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
