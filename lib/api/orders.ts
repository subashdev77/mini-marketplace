import type { Order, PlaceOrderInput, SellerOrderActionInput } from "@/types/marketplace";
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

export function approveSellerOrder(id: string, data?: SellerOrderActionInput) {
  return apiClient<Order>(`/api/orders/seller/${id}/approve`, {
    method: "PATCH",
    body: data ?? {},
  });
}

export function rejectSellerOrder(id: string, data?: SellerOrderActionInput) {
  return apiClient<Order>(`/api/orders/seller/${id}/reject`, {
    method: "PATCH",
    body: data ?? {},
  });
}

export function completeSellerOrder(id: string, data?: SellerOrderActionInput) {
  return apiClient<Order>(`/api/orders/seller/${id}/complete`, {
    method: "PATCH",
    body: data ?? {},
  });
}
