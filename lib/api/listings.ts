import type {
  CreateListingInput,
  Listing,
  UpdateListingInput,
} from "@/types/marketplace";
import { apiClient } from "./client";

export function getListings() {
  return apiClient<Listing[]>("/api/listings", { auth: false });
}

export function getListing(id: string) {
  return apiClient<Listing>(`/api/listings/${id}`, { auth: false });
}

export function getMyListings() {
  return apiClient<Listing[]>("/api/listings/my");
}

export function createListing(data: CreateListingInput) {
  return apiClient<Listing>("/api/listings", {
    method: "POST",
    body: data,
  });
}

export function updateListing(id: string, data: UpdateListingInput) {
  return apiClient<Listing>(`/api/listings/${id}`, {
    method: "PUT",
    body: data,
  });
}

export function deleteListing(id: string) {
  return apiClient<void>(`/api/listings/${id}`, {
    method: "DELETE",
  });
}
