import { MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader } from "@acme/ui/components/card";

interface EventCardVerticalProps {
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

export function EventCardVertical({
  title,
  date,
  location,
  actionLabel = "Join",
  actionVariant = "primary",
  imageSrc,
  href = "#",
  className,
}: EventCardVerticalProps) {
  return (
    <Card className="max-w-xs min-w-xs w-full py-4 gap-4">
      <CardHeader className="px-4 rounded-xl overflow-hidden aspect-video">
        <img
          src={imageSrc || "/placeholder.svg"}
          alt={title}
          className="w-full h-auto object-cover rounded-xl"
        />
      </CardHeader>
      <CardContent className="px-4">
        <div className="text-xs text-muted-foreground">
          {/* Mar 29, 2022 • 10:00 PM */}
          {date.day} {date.month} • 10:00 PM
        </div>
        <h3 className="font-bold mt-1 line-clamp-2">{title}</h3>
        <div className="flex items-center justify-between mt-1">
          <div className="flex flex-1 items-center text-muted-foreground text-xs">
            <MapPin className="h-3 w-3 mr-1" />
            {location}
          </div>
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
      </CardContent>
    </Card>
  );
}
