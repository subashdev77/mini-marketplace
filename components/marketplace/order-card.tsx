import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { Order } from "@/types/marketplace";
import { OrderStatusBadge } from "./status-badge";

interface OrderCardProps {
  order: Order;
  showBuyer?: boolean;
  showSeller?: boolean;
  actions?: React.ReactNode;
}

export function OrderCard({
  order,
  showBuyer = false,
  showSeller = false,
  actions,
}: OrderCardProps) {
  return (
    <Card>
      <CardContent className="space-y-3 p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-semibold text-zinc-900 dark:text-zinc-50">
                {order.listing.title}
              </h3>
              <OrderStatusBadge status={order.status} />
            </div>
            <p className="text-sm text-zinc-500">
              Qty: {order.quantity} · Total:{" "}
              {formatCurrency(Number(order.totalPrice))}
            </p>
            {showSeller && (
              <p className="text-sm text-zinc-500">Seller: {order.seller.name}</p>
            )}
            {showBuyer && (
              <p className="text-sm text-zinc-500">
                Buyer: {order.buyer.name} ({order.buyer.email})
              </p>
            )}
            <p className="text-xs text-zinc-400">
              Ordered {formatDate(order.createdAt)}
            </p>
            {order.adminNote && (
              <p className="mt-2 rounded-lg bg-zinc-50 p-2 text-sm text-zinc-600 dark:bg-zinc-900 dark:text-zinc-400">
                Note: {order.adminNote}
              </p>
            )}
          </div>
          {actions && (
            <div className="flex shrink-0 flex-wrap gap-2">{actions}</div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
