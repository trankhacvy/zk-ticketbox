"use client";

import { useEffect } from "react";
import Image from "next/image";
import { Button } from "@acme/ui/components/button";
import { Card, CardContent } from "@acme/ui/components/card";
import { Award, Share2, X } from "lucide-react";
import confetti from "@/lib/confetti";
import type { EventWithCreator } from "@ticketbox/db";

interface CongratsModalProps {
  event: EventWithCreator;
  onClose: () => void;
}

export function CongratsModal({ event, onClose }: CongratsModalProps) {
  useEffect(() => {
    confetti();
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <Card className="relative w-full max-w-sm border border-border overflow-hidden">
        <CardContent>
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </Button>

          <div className="flex flex-col items-center text-center pt-4">
            <div className="relative w-24 h-24 mb-6">
              <div className="absolute inset-0 rounded-full bg-emerald-500/20 animate-pulse" />
              <div className="absolute inset-2 rounded-full bg-emerald-600/30" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Award className="h-12 w-12 text-emerald-500" />
              </div>
            </div>

            <h2 className="text-2xl font-bold mb-2">Congratulations!</h2>
            <p className="text-muted-foreground mb-6 text-center">
              You've successfully minted your proof of attendance NFT for{" "}
              <span className="font-medium text-foreground">{event.name}</span>
            </p>

            <div className="relative w-full max-w-[240px] aspect-square mb-6 rounded-lg overflow-hidden border-2 border-emerald-500/50">
              <Image
                src={event.thumbnailUrl ?? ""}
                alt={event.name}
                fill
                className="object-contain p-2"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-emerald-600/90 py-2 px-3 text-sm font-medium">
                Added to your collection
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 w-full">
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
              <Button className="bg-emerald-600 hover:bg-emerald-700">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
