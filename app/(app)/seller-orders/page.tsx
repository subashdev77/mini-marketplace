"use client";

import {
  EmptyState,
  ErrorState,
  LoadingState,
  ProtectedRoute,
} from "@/components/auth/protected-route";
import { OrderCard, SellerOrderActions } from "@/components/marketplace";
import { PageHeader, Select } from "@/components/ui";
import { getSellerOrders } from "@/lib/api";
import { ApiError } from "@/lib/api/client";
import { useEffect, useMemo, useState } from "react";
import type { Order, OrderStatus } from "@/types/marketplace";

const statusFilters: { value: OrderStatus | "ALL"; label: string }[] = [
  { value: "ALL", label: "All orders" },
  { value: "PENDING", label: "Pending" },
  { value: "APPROVED", label: "Approved" },
  { value: "REJECTED", label: "Rejected" },
  { value: "COMPLETED", label: "Completed" },
];

function SellerOrdersContent() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<OrderStatus | "ALL">("ALL");

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

  const filteredOrders = useMemo(() => {
    if (filter === "ALL") return orders;
    return orders.filter((o) => o.status === filter);
  }, [orders, filter]);

  function handleOrderUpdated(updated: Order) {
    setOrders((prev) =>
      prev.map((o) => (o.id === updated.id ? updated : o))
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Seller Orders"
        description="Manage incoming orders on your listings."
        actions={
          <Select
            value={filter}
            onChange={(e) => setFilter(e.target.value as OrderStatus | "ALL")}
            className="w-40"
          >
            {statusFilters.map((f) => (
              <option key={f.value} value={f.value}>
                {f.label}
              </option>
            ))}
          </Select>
        }
      />

      <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm text-blue-800 dark:border-blue-900 dark:bg-blue-900/20 dark:text-blue-300">
        Order flow: <strong>PENDING</strong> → Approve/Reject →{" "}
        <strong>APPROVED</strong> → Complete → <strong>COMPLETED</strong>
      </div>

      {loading && <LoadingState message="Loading orders..." />}
      {error && <ErrorState message={error} retry={loadOrders} />}

      {!loading && !error && filteredOrders.length === 0 && (
        <EmptyState
          title="No orders found"
          description={
            filter === "ALL"
              ? "Orders on your listings will appear here."
              : `No orders with status "${filter}".`
          }
        />
      )}

      {!loading && !error && filteredOrders.length > 0 && (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              showBuyer
              actions={
                <SellerOrderActions
                  order={order}
                  onUpdated={handleOrderUpdated}
                />
              }
            />
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
