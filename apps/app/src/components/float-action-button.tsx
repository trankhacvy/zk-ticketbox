"use client";

import { useEffect, useRef, useState } from "react";
import { Plus, QrCode, KeyRound } from "lucide-react";
import { Button } from "@acme/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@acme/ui/components/dialog";
import { cn } from "@acme/ui/lib/utils";

export default function FloatingActionButton() {
  const [open, setOpen] = useState(false);

  const [qrDialogOpen, setQrDialogOpen] = useState(false);
  const [codeDialogOpen, setCodeDialogOpen] = useState(false);

  const handleQrClick = () => {
    setOpen(false);
    setQrDialogOpen(true);
  };

  const handleCodeClick = () => {
    setOpen(false);
    setCodeDialogOpen(true);
  };

  return (
    <>
      <div className="fixed right-4 bottom-20 z-20 flex flex-col-reverse items-end gap-2">
        {open && (
          <>
            <Button
              size="sm"
              className="rounded-full shadow-lg flex items-center gap-2"
              onClick={handleQrClick}
            >
              <QrCode className="h-4 w-4" />
              <span>Scan QR Code</span>
            </Button>

            <Button
              size="sm"
              className="rounded-full shadow-lg flex items-center gap-2"
              onClick={handleCodeClick}
            >
              <KeyRound className="h-4 w-4" />
              <span>Enter Code</span>
            </Button>
          </>
        )}

        <Button
          size="icon"
          className={cn(
            "h-14 w-14 rounded-full shadow-lg transition-transform",
            open && "rotate-45"
          )}
          onClick={() => setOpen(!open)}
        >
          <Plus className="h-6 w-6" />
        </Button>
      </div>

      {/* <Dialog open={qrDialogOpen} onOpenChange={setQrDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Scan QR Code</DialogTitle>
          </DialogHeader>
          <div className="w-full aspect-square">
            <QrReader
              onResult={(result, error) => {
                if (!!result) {
                  console.log("result", result.getText());
                  // setData(result?.text);
                }

                if (!!error) {
                  console.error(error);
                }
              }}
              constraints={{ facingMode: "user" }}
              style={{ width: "100%", height: "100%" }}
            />
          </div>
        </DialogContent>
      </Dialog> */}

      <ScanDialog open={qrDialogOpen} setOpen={setQrDialogOpen} />

      <Dialog open={codeDialogOpen} onOpenChange={setCodeDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enter POAP Code</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center p-4 gap-4">
            <input
              type="text"
              placeholder="Enter code here"
              className="w-full p-4 text-center text-2xl tracking-widest border rounded-lg"
              maxLength={6}
            />
            <Button className="w-full">Mint POAP</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export function ScanDialog({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  console.log("ScanDialog open:", open);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState<string | null>(null);

  // Simulate scanning a QR code after a delay
  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     // Simulate scanning a QR code with event ID
  //     onScan("https://event-app.com/event=sample-event-123")
  //   }, 3000)

  //   return () => clearTimeout(timer)
  // }, [onScan])

  useEffect(() => {
    console.log("Initializing camera...");
    const startCamera = async () => {
      try {
        console.log("Starting camera...");
        if (videoRef.current) {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: "environment" },
          });
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        setError("Camera access denied or not available");
        console.error("Camera error:", err);
      }
    };

    setTimeout(() => {
      if (open) {
        startCamera();
      }
    }, 200);

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Scan QR Code</DialogTitle>
        </DialogHeader>
        <div className="relative aspect-square overflow-hidden rounded-lg">
          {error ? (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-900 text-red-400 p-4 text-center">
              {error}
            </div>
          ) : (
            <>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 border-2 border-emerald-500 rounded-lg" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-3/4 h-3/4 border-2 border-white/70 rounded-lg" />
              </div>
              <div className="absolute bottom-4 left-0 right-0 text-center text-white bg-black/50 py-2">
                Scanning QR code...
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
