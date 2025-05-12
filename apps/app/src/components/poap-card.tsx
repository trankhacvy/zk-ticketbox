import { Card, CardContent } from "@acme/ui/components/card";

interface PoapCardProps {
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

export function PoapCard() {
  return (
    <Card className="w-full py-4">
      <CardContent className="px-4">
        <div className="w-full aspect-square overflow-hidden rounded-2xl">
          <img
            src="https://api-prod-minimal-v700.pages.dev/assets/images/m-product/product-5.webp"
            className="w-full h-auto object-cover"
          />
        </div>
      </CardContent>
    </Card>
  );
}
