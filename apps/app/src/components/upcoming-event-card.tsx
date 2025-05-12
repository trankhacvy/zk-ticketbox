import Image from "next/image";
import { MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@acme/ui/components/card";

interface UpcomingEventCardProps {
  title: string;
  date: {
    day: string;
    month: string;
  };
  location: string;
  actionLabel?: string;
  actionVariant?: "primary" | "secondary" | "outline" | "free";
  imageSrc: string;
  href?: string;
  className?: string;
}

export function UpcomingEventCard({
  title,
  date,
  location,
  actionLabel = "Join",
  actionVariant = "primary",
  imageSrc,
  href = "#",
  className,
}: UpcomingEventCardProps) {
  return (
    <Card className={cn("py-4", className)}>
      <CardContent className="px-4 gap-4 flex items-center">
        <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg">
          <Image
            src={imageSrc || "/placeholder.svg"}
            alt={title}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 p-1 text-center">
            <span className="text-xl font-bold">{date.day}</span>
            <span className="text-sm text-gray-500">{date.month}</span>
          </div>
        </div>

        <div className="flex-1">
          <h3 className="text-sm font-bold line-clamp-2">{title}</h3>
          <div className="flex items-center justify-between mt-2">
            <div className="mt-1 flex items-center">
              <MapPin className="mr-1 h-4 w-4" />
              <span className="text-sm text-muted-foreground">{location}</span>
            </div>
            <div>
              {actionVariant === "free" ? (
                <div className="rounded-full bg-gray-100 px-6 py-2 text-sm font-medium text-orange-500">
                  FREE
                </div>
              ) : (
                <a
                  href={href}
                  className={cn(
                    "rounded-full px-4 py-2 text-center text-sm font-medium",
                    actionVariant === "primary" && "bg-orange-500 text-white",
                    actionVariant === "secondary" && "bg-blue-500 text-white",
                    actionVariant === "outline" &&
                      "border border-gray-300 text-gray-700"
                  )}
                >
                  {actionLabel}
                </a>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
