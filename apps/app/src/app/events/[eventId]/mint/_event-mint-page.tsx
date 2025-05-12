"use client";

import { mutate } from "swr";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { format } from "date-fns";
import { Button } from "@acme/ui/components/button";
import { Card, CardContent, CardFooter } from "@acme/ui/components/card";
import { Badge } from "@acme/ui/components/badge";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Users,
  Award,
  Clock,
  Globe,
} from "lucide-react";
import { toast } from "sonner";
import type { EventWithCreator } from "@ticketbox/db";
import Link from "next/link";
import { CongratsModal } from "@/components/congrats-modal";
import { usePrivy } from "@privy-io/react-auth";
import { executeTransaction } from "@/lib/actions";
import { useUserWallet } from "@/hooks/use-user-wallet";

export default function MintPage({ event }: { event: EventWithCreator }) {
  const router = useRouter();
  const [isMinting, setIsMinting] = useState(false);
  const [isMinted, setIsMinted] = useState(false);
  const [showCongrats, setShowCongrats] = useState(false);

  const { ready } = usePrivy();
  const { account } = useUserWallet();

  const handleMint = async () => {
    try {
      if (!ready || !account) {
        toast.error("Wallet not connected. Please connect your wallet.");
        return;
      }

      setIsMinting(true);

      const result = await executeTransaction({
        wallet: account.address,
        ticketBoxAddress: event.address,
      });

      if (result?.data?.success) {
        setIsMinting(false);
        setIsMinted(true);
        setShowCongrats(true);
      } else {
        setIsMinting(false);
        toast.error("Error minting NFT. Please try again.");
      }
    } catch (error) {
      console.error("Error minting NFT:", error);
      toast.error("Error minting NFT. Please try again.");
      setIsMinting(false);
    } finally {
      mutate(["assets", account.address]);
    }
  };

  const formatEventDate = () => {
    if (isSameDay(event.startAt, event.endAt)) {
      return `${format(event.startAt, "MMMM d, yyyy")}`;
    }
    return `${format(event.startAt, "MMMM d")} - ${format(event.endAt, "MMMM d, yyyy")}`;
  };

  const formatEventTime = () => {
    return `${format(event.startAt, "h:mm a")} - ${format(event.endAt, "h:mm a")}`;
  };

  const isSameDay = (date1: Date, date2: Date) => {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  };

  const getLocationIcon = () => {
    if (event.locationType === "online") {
      return <Globe className="h-5 w-5 text-slate-400" />;
    }
    return <MapPin className="h-5 w-5 text-slate-400" />;
  };

  const getLocationText = () => {
    if (event.locationType === "online") {
      return (
        <div className="flex flex-col">
          <span>{event.locationName || "Online Event"}</span>
          {event.locationUrl && (
            <a
              href={event.locationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-emerald-400 hover:underline"
            >
              Join URL
            </a>
          )}
        </div>
      );
    }
    return (
      <div className="flex flex-col">
        <span>{event.locationName}</span>
        {event.locationAddress && (
          <span className="text-sm text-slate-400">
            {event.locationAddress}
          </span>
        )}
      </div>
    );
  };

  const getAttendanceText = () => {
    if (event.maxAttendees === 0) {
      return `${event.currentAttendees} attendees (unlimited capacity)`;
    }
    return `${event.currentAttendees} / ${event.maxAttendees} attendees`;
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header className="p-4 flex items-center border-b border-border">
        <Link href="/">
          <Button variant="ghost" size="icon" className="mr-2">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-xl font-bold">{event.name}</h1>
      </header>

      <main className="flex-1 p-4 overflow-auto">
        <div className="max-w-md mx-auto space-y-6">
          <div className="relative w-full aspect-square rounded-xl overflow-hidden">
            <Image
              src={
                event.thumbnailUrl || "/placeholder.svg?height=400&width=600"
              }
              alt={event.name}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4">
              <Badge className="bg-emerald-600 mb-2">POAP NFT</Badge>
              <h2 className="text-2xl font-bold text-white">{event.name}</h2>
            </div>
          </div>

          <Card className="border-border">
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-slate-400" />
                <span>{formatEventDate()}</span>
              </div>

              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-slate-400" />
                <span>{formatEventTime()}</span>
              </div>

              <div className="flex items-start gap-3">
                {getLocationIcon()}
                {getLocationText()}
              </div>

              <div className="flex items-center gap-3">
                <Users className="h-5 w-5 text-slate-400" />
                <span>{getAttendanceText()}</span>
              </div>

              <div className="pt-2 space-y-2">
                <h3 className="font-medium">About this event</h3>
                <p className="text-muted-foreground">{event.description}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex flex-col items-center">
              <h3 className="text-lg font-semibold mb-4">
                Proof-of-Participation NFT
              </h3>

              <div className="relative w-48 h-48 mb-4">
                <Image
                  src={event.thumbnailUrl ?? ""}
                  alt={event.name}
                  width={192}
                  height={192}
                  className={`rounded-lg border-2 ${isMinted ? "border-emerald-500" : "border-slate-600"}`}
                />
                {isMinted && (
                  <Badge className="absolute -top-2 -right-2 bg-emerald-600">
                    <Award className="h-3 w-3 mr-1" />
                    Collected
                  </Badge>
                )}
              </div>
            </CardContent>
            <CardFooter className="pt-0">
              <Button
                className="w-full bg-emerald-600 hover:bg-emerald-700"
                disabled={isMinting || isMinted}
                onClick={handleMint}
              >
                {isMinting
                  ? "Minting..."
                  : isMinted
                    ? "NFT Collected!"
                    : "Mint NFT"}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </main>

      {showCongrats && (
        <CongratsModal
          event={event}
          onClose={async () => {
            router.push("/");
            await mutate(["assets", account.address]);
            setShowCongrats(false);
          }}
        />
      )}
    </div>
  );
}
