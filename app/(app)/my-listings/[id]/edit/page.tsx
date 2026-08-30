"use client";

import {
  ErrorState,
  LoadingState,
  ProtectedRoute,
} from "@/components/auth/protected-route";
import { ListingForm } from "@/components/marketplace";
import { Card, CardContent, PageHeader } from "@/components/ui";
import { getMyListings, updateListing } from "@/lib/api";
import { ApiError } from "@/lib/api/client";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { LuArrowLeft } from "react-icons/lu";
import type { Listing } from "@/types/marketplace";

function EditListingContent() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const listings = await getMyListings();
        const found = listings.find((l) => l.id === id);
        if (!found) {
          setError("Listing not found or you don't have permission to edit it.");
        } else {
          setListing(found);
        }
      } catch (err) {
        setError(err instanceof ApiError ? err.message : "Failed to load listing");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  if (loading) return <LoadingState message="Loading listing..." />;
  if (error) return <ErrorState message={error} />;
  if (!listing) return null;

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
        title="Edit Listing"
        description="Update your product details."
      />

      <Card>
        <CardContent className="p-6">
          <ListingForm
            showStatus
            submitLabel="Update Listing"
            cancelHref="/my-listings"
            initial={{
              title: listing.title,
              description: listing.description,
              price: listing.price,
              imageUrl: listing.imageUrl ?? "",
              status: listing.status,
            }}
            onSubmit={async (data) => {
              await updateListing(id, data);
              router.push("/my-listings");
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}

export default function EditListingPage() {
  return (
    <ProtectedRoute roles={["SELLER"]}>
      <EditListingContent />
    </ProtectedRoute>
  );
}
