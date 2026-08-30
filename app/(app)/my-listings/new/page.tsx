"use client";

import { ProtectedRoute } from "@/components/auth/protected-route";
import { ListingForm } from "@/components/marketplace";
import { Card, CardContent, PageHeader } from "@/components/ui";
import { createListing } from "@/lib/api";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LuArrowLeft } from "react-icons/lu";

function CreateListingContent() {
  const router = useRouter();

  return (
    <div className="w-full space-y-6 pb-16">
      <Link
        href="/my-listings"
        className="inline-flex items-center gap-1 text-sm text-zinc-500 transition-colors hover:text-zinc-700 dark:hover:text-zinc-300"
      >
        <LuArrowLeft className="size-4" />
        Back to my listings
      </Link>

      <PageHeader
        title="Create Listing"
        description="Add a new product to the marketplace."
      />

      <Card>
        <CardContent className="p-6">
          <ListingForm
            submitLabel="Create Listing"
            cancelHref="/my-listings"
            onSubmit={async (data) => {
              await createListing({
                title: data.title,
                description: data.description,
                price: data.price,
                imageUrl: data.imageUrl,
              });
              router.push("/my-listings");
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}

export default function CreateListingPage() {
  return (
    <ProtectedRoute roles={["SELLER"]}>
      <CreateListingContent />
    </ProtectedRoute>
  );
}
