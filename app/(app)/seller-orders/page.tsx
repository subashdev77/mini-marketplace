"use client";

import {
  EmptyState,
  ErrorState,
  LoadingState,
  ProtectedRoute,
} from "@/components/auth/protected-route";
import { OrderCard } from "@/components/marketplace";
import { PageHeader } from "@/components/ui";
import { getSellerOrders } from "@/lib/api";
import { ApiError } from "@/lib/api/client";
import type { Order } from "@/types/marketplace";
import { useEffect, useState } from "react";

function SellerOrdersContent() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadOrders() {
    setLoading(true);
    setError("");
    try {
      const data = await getSellerOrders();
      setOrders(data);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to load orders");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadOrders();
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Seller Orders"
        description="Orders placed on your listings (read-only)."
      />

      {loading && <LoadingState message="Loading orders..." />}
      {error && <ErrorState message={error} retry={loadOrders} />}

      {!loading && !error && orders.length === 0 && (
        <EmptyState
          title="No orders yet"
          description="Orders on your listings will appear here."
        />
      )}

      {!loading && !error && orders.length > 0 && (
        <div className="space-y-4">
          {orders.map((order) => (
            <OrderCard key={order.id} order={order} showBuyer />
          ))}
        </div>
      )}
    </div>
  );
}

export default function SellerOrdersPage() {
  return (
    <ProtectedRoute roles={["SELLER"]}>
      <SellerOrdersContent />
    </ProtectedRoute>
  );
}
