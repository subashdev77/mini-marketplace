import { Badge } from "@/components/ui/badge";
import type { ListingStatus, OrderStatus } from "@/types/marketplace";

const orderStatusConfig: Record<
  OrderStatus,
  { label: string; variant: "default" | "info" | "warning" | "success" | "danger" }
> = {
  PENDING: { label: "Pending", variant: "warning" },
  APPROVED: { label: "Approved", variant: "info" },
  REJECTED: { label: "Rejected", variant: "danger" },
  COMPLETED: { label: "Completed", variant: "success" },
};

const listingStatusConfig: Record<
  ListingStatus,
  { label: string; variant: "success" | "default" }
> = {
  ACTIVE: { label: "Active", variant: "success" },
  INACTIVE: { label: "Inactive", variant: "default" },
};

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const { label, variant } = orderStatusConfig[status];
  return <Badge variant={variant}>{label}</Badge>;
}

export function ListingStatusBadge({ status }: { status: ListingStatus }) {
  const { label, variant } = listingStatusConfig[status];
  return <Badge variant={variant}>{label}</Badge>;
}

export function RoleBadge({ role }: { role: string }) {
  const variants: Record<string, "info" | "success" | "warning"> = {
    BUYER: "info",
    SELLER: "success",
    ADMIN: "warning",
  };
  return <Badge variant={variants[role] ?? "default"}>{role}</Badge>;
}
