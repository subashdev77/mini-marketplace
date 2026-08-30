"use client";

import {
  EmptyState,
  ErrorState,
  LoadingState,
} from "@/components/auth/protected-route";
import { Button, Field, Input, PageHeader } from "@/components/ui";
import { useAuth } from "@/hooks/use-auth";
import { getListing, placeOrder } from "@/lib/api";
import { ApiError } from "@/lib/api/client";
import { formatCurrency, formatDate } from "@/lib/utils";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { LuArrowLeft, LuImage } from "react-icons/lu";
import type { Listing } from "@/types/marketplace";

export default function ListingDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const router = useRouter();

  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [ordering, setOrdering] = useState(false);
  const [orderError, setOrderError] = useState("");
  const [orderSuccess, setOrderSuccess] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const data = await getListing(id);
        setListing(data);
      } catch (err) {
        setError(
          err instanceof ApiError ? err.message : "Failed to load listing"
        );
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  async function handleOrder() {
    if (!listing) return;
    setOrdering(true);
    setOrderError("");
    setOrderSuccess(false);

    try {
      await placeOrder(listing.id, { quantity });
      setOrderSuccess(true);
    } catch (err) {
      setOrderError(
        err instanceof ApiError ? err.message : "Failed to place order"
      );
    } finally {
      setOrdering(false);
    }
  }

  const canOrder =
    user?.role === "BUYER" &&
    listing?.status === "ACTIVE" &&
    listing.sellerId !== user.id;

  if (loading) return <LoadingState message="Loading listing..." />;
  if (error) return <ErrorState message={error} />;
  if (!listing) return <EmptyState title="Listing not found" />;

  return (
    <div className="space-y-6">
      <Link
        href="/marketplace"
        className="inline-flex items-center gap-1 text-sm text-zinc-500 hover:text-zinc-700"
      >
        <LuArrowLeft className="size-4" />
        Back to marketplace
      </Link>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="aspect-square overflow-hidden rounded-xl bg-zinc-100 dark:bg-zinc-900">
          {listing.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={listing.imageUrl}
              alt={listing.title}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-zinc-400">
              <LuImage className="size-16" />
            </div>
          )}
        </div>

        <div className="space-y-4">
          <PageHeader title={listing.title} />
          <p className="text-3xl font-bold text-blue-600">
            {formatCurrency(Number(listing.price))}
          </p>
          <p className="text-zinc-600 dark:text-zinc-400">
            {listing.description}
          </p>
          <div className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
            <p className="text-sm text-zinc-500">Sold by</p>
            <p className="font-medium text-zinc-900 dark:text-zinc-100">
              {listing.seller.name}
            </p>
            <p className="text-sm text-zinc-500">{listing.seller.email}</p>
          </div>
          <p className="text-xs text-zinc-400">
            Listed {formatDate(listing.createdAt)}
          </p>

          {canOrder && (
            <div className="space-y-3 rounded-xl border border-zinc-200 p-4 dark:border-zinc-800">
              <Field label="Quantity" htmlFor="quantity">
                <Input
                  id="quantity"
                  type="number"
                  min={1}
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                />
              </Field>
              {orderError && (
                <p className="text-sm text-red-600">{orderError}</p>
              )}
              {orderSuccess && (
                <div className="space-y-2">
                  <p className="text-sm text-green-600">
                    Order placed successfully!
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.push("/my-orders")}
                  >
                    View My Orders
                  </Button>
                </div>
              )}
              {!orderSuccess && (
                <Button
                  onClick={handleOrder}
                  isLoading={ordering}
                  className="w-full"
                >
                  Place Order
                </Button>
              )}
            </div>
          )}

          {!user && listing.status === "ACTIVE" && (
            <p className="text-sm text-zinc-500">
              <Link
                href={`/login?redirect=${encodeURIComponent(`/listings/${listing.id}`)}`}
                className="text-blue-600 hover:underline"
              >
                Log in as a buyer
              </Link>{" "}
              to place an order.
            </p>
          )}

          {user?.role === "BUYER" && listing.sellerId === user.id && (
            <p className="text-sm text-zinc-500">This is your own listing.</p>
          )}

          {user && user.role !== "BUYER" && (
            <p className="text-sm text-zinc-500">
              Only buyers can place orders. You are logged in as {user.role.toLowerCase()}.
            </p>
          )}

          {user?.role === "BUYER" && listing.status !== "ACTIVE" && (
            <p className="text-sm text-zinc-500">This listing is not available for ordering.</p>
          )}
        </div>
      </div>
    </div>
  );
}
