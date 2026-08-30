import type { Order, PlaceOrderInput } from "@/types/marketplace";
import { apiClient } from "./client";

export function placeOrder(listingId: string, data?: PlaceOrderInput) {
  return apiClient<Order>(`/api/orders/${listingId}`, {
    method: "POST",
    body: data ?? {},
  });
}

export function getMyOrders() {
  return apiClient<Order[]>("/api/orders/my");
}

export function getSellerOrders() {
  return apiClient<Order[]>("/api/orders/seller");
}
