"use client";

import { Button, Field, Textarea } from "@/components/ui";
import {
  approveSellerOrder,
  completeSellerOrder,
  rejectSellerOrder,
} from "@/lib/api";
import { ApiError } from "@/lib/api/client";
import type { Order } from "@/types/marketplace";
import { useState } from "react";

interface SellerOrderActionsProps {
  order: Order;
  onUpdated: (order: Order) => void;
}

export function SellerOrderActions({ order, onUpdated }: SellerOrderActionsProps) {
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState("");

  async function handleAction(
    action: "approve" | "reject" | "complete",
    fn: (id: string, data?: { note?: string }) => Promise<Order>
  ) {
    setLoading(action);
    setError("");
    try {
      const updated = await fn(order.id, note.trim() ? { note: note.trim() } : {});
      onUpdated(updated);
      setNote("");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Action failed");
    } finally {
      setLoading(null);
    }
  }

  if (order.status !== "PENDING" && order.status !== "APPROVED") {
    return null;
  }

  return (
    <div className="w-full space-y-2 sm:w-64">
      <Field label="Note (optional)" htmlFor={`seller-note-${order.id}`}>
        <Textarea
          id={`seller-note-${order.id}`}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="e.g. Order confirmed, out of stock"
          className="min-h-16"
        />
      </Field>
      {error && <p className="text-xs text-red-600">{error}</p>}
      <div className="flex flex-wrap gap-2">
        {order.status === "PENDING" && (
          <>
            <Button
              size="sm"
              onClick={() => handleAction("approve", approveSellerOrder)}
              isLoading={loading === "approve"}
              disabled={!!loading}
            >
              Approve
            </Button>
            <Button
              size="sm"
              variant="danger"
              onClick={() => handleAction("reject", rejectSellerOrder)}
              isLoading={loading === "reject"}
              disabled={!!loading}
            >
              Reject
            </Button>
          </>
        )}
        {order.status === "APPROVED" && (
          <Button
            size="sm"
            variant="secondary"
            onClick={() => handleAction("complete", completeSellerOrder)}
            isLoading={loading === "complete"}
            disabled={!!loading}
          >
            Complete
          </Button>
        )}
      </div>
    </div>
  );
}
