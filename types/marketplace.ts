export type Role = "BUYER" | "SELLER" | "ADMIN";
export type ListingStatus = "ACTIVE" | "INACTIVE";
export type OrderStatus = "PENDING" | "APPROVED" | "REJECTED" | "COMPLETED";

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  createdAt: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface Listing {
  id: string;
  title: string;
  description: string;
  price: string;
  imageUrl: string | null;
  status: ListingStatus;
  sellerId: string;
  seller: User;
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  id: string;
  quantity: number;
  totalPrice: string;
  status: OrderStatus;
  adminNote: string | null;
  buyerId: string;
  sellerId: string;
  listingId: string;
  buyer: Pick<User, "id" | "name" | "email">;
  seller: Pick<User, "id" | "name" | "email">;
  listing: Pick<Listing, "id" | "title" | "price" | "description" | "imageUrl">;
  createdAt: string;
  updatedAt: string;
}

export interface CreateListingInput {
  title: string;
  description: string;
  price: number;
  imageUrl?: string;
}

export interface UpdateListingInput {
  title?: string;
  description?: string;
  price?: number;
  imageUrl?: string;
  status?: ListingStatus;
}

export interface RegisterInput {
  email: string;
  password: string;
  name: string;
  role: Role;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface PlaceOrderInput {
  quantity?: number;
}

export interface AdminOrderActionInput {
  adminNote?: string;
}

export interface SellerOrderActionInput {
  note?: string;
}
