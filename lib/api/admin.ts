import type { AdminOrderActionInput, Order } from "@/types/marketplace";
import { apiClient } from "./client";

export function getAllOrders() {
  return apiClient<Order[]>("/api/admin/orders");
}

export function approveOrder(id: string, data?: AdminOrderActionInput) {
  return apiClient<Order>(`/api/admin/orders/${id}/approve`, {
    method: "PATCH",
    body: data ?? {},
  });
}

export function rejectOrder(id: string, data?: AdminOrderActionInput) {
  return apiClient<Order>(`/api/admin/orders/${id}/reject`, {
    method: "PATCH",
    body: data ?? {},
  });
}

export function completeOrder(id: string, data?: AdminOrderActionInput) {
  return apiClient<Order>(`/api/admin/orders/${id}/complete`, {
    method: "PATCH",
    body: data ?? {},
  });
}
