"use client";

import { Button, Field, Textarea } from "@/components/ui";
import {
  approveOrder,
  completeOrder,
  rejectOrder,
} from "@/lib/api";
import { ApiError } from "@/lib/api/client";
import type { Order } from "@/types/marketplace";
import { useState } from "react";

interface AdminOrderActionsProps {
  order: Order;
  onUpdated: (order: Order) => void;
}

export function AdminOrderActions({ order, onUpdated }: AdminOrderActionsProps) {
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState("");

  async function handleAction(
    action: "approve" | "reject" | "complete",
    fn: (id: string, data?: { adminNote?: string }) => Promise<Order>
  ) {
    setLoading(action);
    setError("");
    try {
      const updated = await fn(order.id, note.trim() ? { adminNote: note.trim() } : {});
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
      <Field label="Admin note (optional)" htmlFor={`note-${order.id}`}>
        <Textarea
          id={`note-${order.id}`}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Optional note for this action"
          className="min-h-16"
        />
      </Field>
      {error && <p className="text-xs text-red-600">{error}</p>}
      <div className="flex flex-wrap gap-2">
        {order.status === "PENDING" && (
          <>
            <Button
              size="sm"
              onClick={() => handleAction("approve", approveOrder)}
              isLoading={loading === "approve"}
              disabled={!!loading}
            >
              Approve
            </Button>
            <Button
              size="sm"
              variant="danger"
              onClick={() => handleAction("reject", rejectOrder)}
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
            onClick={() => handleAction("complete", completeOrder)}
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
