"use client";

import { Calendar } from "lucide-react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@acme/ui/components/tabs";
import Image from "next/image";
import { Card, CardContent } from "@acme/ui/components/card";
import { format } from "date-fns";
import { useAssets } from "@/hooks/use-assets";

export default function MainTabs() {
  const { assets, isLoading } = useAssets();

  return (
    <div className="mt-6 px-4">
      <Tabs defaultValue="collection" className="w-full mt-10">
        <TabsList className="w-full grid grid-cols-2">
          <TabsTrigger value="collection">Collection</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
        </TabsList>
        <TabsContent value="collection" className="p-0">
          <div className="py-4 space-y-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <h2 className="text-sm font-medium text-muted-foreground">
                  May
                </h2>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {isLoading && (
                  <>
                    {Array.from({ length: 8 }).map((_, index) => (
                      <div
                        key={index}
                        className="rounded-2xl border border-gray-100 p-4 shadow-sm animate-pulse"
                      >
                        <div className="flex flex-col items-center">
                          <div className="w-full h-40 bg-gray-200 rounded-lg mb-4" />
                          <div className="h-6 w-3/4 bg-gray-200 rounded mb-2" />
                          <div className="h-5 w-1/2 bg-gray-200 rounded" />
                        </div>
                      </div>
                    ))}
                  </>
                )}
                {assets.map((asset) => (
                  <a
                    href={`https://photon.helius.dev/address/${asset.address.toBase58()}?cluster=devnet`}
                    target="_blank"
                    key={asset.address.toBase58()}
                    rel="noreferrer"
                  >
                    <Card key={asset.name} className="overflow-hidden py-3">
                      <CardContent className="px-3">
                        <div className="flex flex-col items-center text-center">
                          <div className="relative aspect-square w-full mb-2">
                            <Image
                              src={asset.image || "/placeholder.svg"}
                              alt={asset.name}
                              fill
                              className="object-cover rounded-full"
                            />
                          </div>
                          <h3 className="text-sm font-medium">{asset.name}</h3>
                          <p className="text-xs text-muted-foreground">
                            {format(Date.now(), "MMM d, yyyy")}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </a>
                ))}

                {assets.length === 0 && !isLoading && (
                  <div className="flex flex-col items-center justify-center h-full">
                    <p className="text-muted-foreground">No assets found</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="events">
          <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)] text-center">
            <p className="text-muted-foreground">Coming soon</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
