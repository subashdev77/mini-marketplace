import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import type { Listing } from "@/types/marketplace";
import { LuImage } from "react-icons/lu";

export function ListingCard({ listing }: { listing: Listing }) {
  return (
    <Link href={`/listings/${listing.id}`}>
      <Card className="h-full overflow-hidden transition-shadow hover:shadow-md">
        <div className="relative aspect-[4/3] bg-zinc-100 dark:bg-zinc-900">
          {listing.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={listing.imageUrl}
              alt={listing.title}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-zinc-400">
              <LuImage className="size-10" />
            </div>
          )}
        </div>
        <CardContent className="p-4">
          <h3 className="line-clamp-1 font-semibold text-zinc-900 dark:text-zinc-50">
            {listing.title}
          </h3>
          <p className="mt-1 text-lg font-bold text-blue-600">
            {formatCurrency(Number(listing.price))}
          </p>
          <p className="mt-1 line-clamp-2 text-sm text-zinc-500 dark:text-zinc-400">
            {listing.description}
          </p>
          <p className="mt-2 text-xs text-zinc-400">by {listing.seller.name}</p>
        </CardContent>
      </Card>
    </Link>
  );
}
