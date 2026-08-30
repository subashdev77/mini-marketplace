import type {
  AuthResponse,
  LoginInput,
  RegisterInput,
  User,
} from "@/types/marketplace";
import { apiClient } from "./client";

export function register(data: RegisterInput) {
  return apiClient<AuthResponse>("/api/auth/register", {
    method: "POST",
    body: data,
    auth: false,
  });
}

export function login(data: LoginInput) {
  return apiClient<AuthResponse>("/api/auth/login", {
    method: "POST",
    body: data,
    auth: false,
  });
}

export function getMe() {
  return apiClient<User>("/api/auth/me");
}
