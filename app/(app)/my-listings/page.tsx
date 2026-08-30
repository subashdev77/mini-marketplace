"use client";

import {
  EmptyState,
  ErrorState,
  LoadingState,
  ProtectedRoute,
} from "@/components/auth/protected-route";
import { ListingStatusBadge } from "@/components/marketplace";
import { Button, PageHeader } from "@/components/ui";
import { useConfirm } from "@/hooks/use-confirm";
import { deleteListing, getMyListings } from "@/lib/api";
import { ApiError } from "@/lib/api/client";
import { formatCurrency, formatDate } from "@/lib/utils";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { Listing } from "@/types/marketplace";

function MyListingsContent() {
  const { confirm, alert, dialog } = useConfirm();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function loadListings() {
    setLoading(true);
    setError("");
    try {
      const data = await getMyListings();
      setListings(data);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to load listings");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadListings();
  }, []);

  async function handleDelete(id: string, title: string) {
    const confirmed = await confirm({
      title: "Delete listing",
      description: `Are you sure you want to delete "${title}"? This action cannot be undone.`,
      confirmLabel: "Delete",
      cancelLabel: "Cancel",
      variant: "danger",
    });

    if (!confirmed) return;

    setDeletingId(id);
    try {
      await deleteListing(id);
      setListings((prev) => prev.filter((l) => l.id !== id));
    } catch (err) {
      await alert({
        title: "Delete failed",
        description:
          err instanceof ApiError ? err.message : "Failed to delete listing",
      });
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="space-y-6">
      {dialog}

      <PageHeader
        title="My Listings"
        description="Create and manage your product listings."
        actions={
          <Link href="/my-listings/new">
            <Button>Create Listing</Button>
          </Link>
        }
      />

      {loading && <LoadingState message="Loading your listings..." />}
      {error && <ErrorState message={error} retry={loadListings} />}

      {!loading && !error && listings.length === 0 && (
        <EmptyState
          title="No listings yet"
          description="Create your first listing to start selling."
          action={
            <Link href="/my-listings/new">
              <Button>Create Listing</Button>
            </Link>
          }
        />
      )}

      {!loading && !error && listings.length > 0 && (
        <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900">
                  <th className="px-4 py-3 text-left font-semibold text-zinc-500">Title</th>
                  <th className="px-4 py-3 text-left font-semibold text-zinc-500">Price</th>
                  <th className="px-4 py-3 text-left font-semibold text-zinc-500">Status</th>
                  <th className="px-4 py-3 text-left font-semibold text-zinc-500">Created</th>
                  <th className="px-4 py-3 text-right font-semibold text-zinc-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {listings.map((listing) => (
                  <tr key={listing.id}>
                    <td className="px-4 py-3 font-medium text-zinc-900 dark:text-zinc-100">
                      {listing.title}
                    </td>
                    <td className="px-4 py-3 text-zinc-600">
                      {formatCurrency(Number(listing.price))}
                    </td>
                    <td className="px-4 py-3">
                      <ListingStatusBadge status={listing.status} />
                    </td>
                    <td className="px-4 py-3 text-zinc-500">
                      {formatDate(listing.createdAt)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <Link href={`/my-listings/${listing.id}/edit`}>
                          <Button variant="outline" size="sm">
                            Edit
                          </Button>
                        </Link>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleDelete(listing.id, listing.title)}
                          isLoading={deletingId === listing.id}
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default function MyListingsPage() {
  return (
    <ProtectedRoute roles={["SELLER"]}>
      <MyListingsContent />
    </ProtectedRoute>
  );
}
