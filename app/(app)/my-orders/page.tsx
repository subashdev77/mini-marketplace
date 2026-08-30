"use client";

import {
  EmptyState,
  ErrorState,
  LoadingState,
  ProtectedRoute,
} from "@/components/auth/protected-route";
import { OrderCard } from "@/components/marketplace";
import { PageHeader } from "@/components/ui";
import { getMyOrders } from "@/lib/api";
import { ApiError } from "@/lib/api/client";
import type { Order } from "@/types/marketplace";
import { useEffect, useState } from "react";

function MyOrdersContent() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadOrders() {
    setLoading(true);
    setError("");
    try {
      const data = await getMyOrders();
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
        title="My Orders"
        description="Track your order status — pending, approved, rejected, or completed."
      />

      {loading && <LoadingState message="Loading your orders..." />}
      {error && <ErrorState message={error} retry={loadOrders} />}

      {!loading && !error && orders.length === 0 && (
        <EmptyState
          title="No orders yet"
          description="Browse the marketplace and place your first order."
        />
      )}

      {!loading && !error && orders.length > 0 && (
        <div className="space-y-4">
          {orders.map((order) => (
            <OrderCard key={order.id} order={order} showSeller />
          ))}
        </div>
      )}
    </div>
  );
}

export default function MyOrdersPage() {
  return (
    <ProtectedRoute roles={["BUYER"]}>
      <MyOrdersContent />
    </ProtectedRoute>
  );
}
