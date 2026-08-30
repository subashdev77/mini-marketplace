"use client";

import {
  EmptyState,
  ErrorState,
  LoadingState,
} from "@/components/auth/protected-route";
import { ListingCard } from "@/components/marketplace";
import { PageHeader } from "@/components/ui";
import { getListings } from "@/lib/api";
import { ApiError } from "@/lib/api/client";
import { useEffect, useState } from "react";
import type { Listing } from "@/types/marketplace";

export default function MarketplacePage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadListings() {
    setLoading(true);
    setError("");
    try {
      const data = await getListings();
      setListings(data);
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "Failed to load listings"
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadListings();
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Marketplace"
        description="Browse active listings from sellers."
      />

      {loading && <LoadingState message="Loading listings..." />}
      {error && <ErrorState message={error} retry={loadListings} />}

      {!loading && !error && listings.length === 0 && (
        <EmptyState
          title="No listings yet"
          description="Check back later or create a listing if you are a seller."
        />
      )}

      {!loading && !error && listings.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {listings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      )}
    </div>
  );
}
