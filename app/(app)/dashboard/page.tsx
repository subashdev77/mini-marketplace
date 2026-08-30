"use client";

import { PageHeader } from "@/components/ui";
import { useAuth } from "@/hooks/use-auth";
import { getAllOrders, getMyListings, getMyOrders, getSellerOrders } from "@/lib/api";
import Link from "next/link";
import { useEffect, useState } from "react";
import { LuArrowRight, LuPackage, LuShoppingBag, LuStore } from "react-icons/lu";

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ orders: 0, listings: 0, pending: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      if (!user) return;
      try {
        if (user.role === "BUYER") {
          const orders = await getMyOrders();
          setStats({ orders: orders.length, listings: 0, pending: orders.filter((o) => o.status === "PENDING").length });
        } else if (user.role === "SELLER") {
          const [listings, orders] = await Promise.all([getMyListings(), getSellerOrders()]);
          setStats({ orders: orders.length, listings: listings.length, pending: orders.filter((o) => o.status === "PENDING").length });
        } else if (user.role === "ADMIN") {
          const orders = await getAllOrders();
          setStats({ orders: orders.length, listings: 0, pending: orders.filter((o) => o.status === "PENDING").length });
        }
      } catch {
        // Stats are optional on dashboard
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, [user]);

  const cards = [
    user?.role === "BUYER" && {
      label: "My Orders",
      value: loading ? "—" : stats.orders,
      href: "/my-orders",
      icon: LuShoppingBag,
    },
    user?.role === "SELLER" && {
      label: "My Listings",
      value: loading ? "—" : stats.listings,
      href: "/my-listings",
      icon: LuStore,
    },
    (user?.role === "SELLER" || user?.role === "ADMIN") && {
      label: user.role === "ADMIN" ? "Total Orders" : "Seller Orders",
      value: loading ? "—" : stats.orders,
      href: user.role === "ADMIN" ? "/admin" : "/seller-orders",
      icon: LuPackage,
    },
    user?.role === "ADMIN" && {
      label: "Pending Review",
      value: loading ? "—" : stats.pending,
      href: "/admin",
      icon: LuPackage,
    },
  ].filter(Boolean) as { label: string; value: string | number; href: string; icon: typeof LuShoppingBag }[];

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Welcome, ${user?.name ?? "User"}`}
        description={`You are logged in as ${user?.role.toLowerCase() ?? "user"}.`}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="group rounded-xl border border-zinc-200 bg-white p-6 transition-shadow hover:shadow-md dark:border-zinc-800 dark:bg-zinc-950"
          >
            <div className="flex items-center justify-between">
              <card.icon className="size-8 text-blue-600" />
              <LuArrowRight className="size-4 text-zinc-400 transition-transform group-hover:translate-x-1" />
            </div>
            <p className="mt-4 text-sm text-zinc-500">{card.label}</p>
            <p className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">{card.value}</p>
          </Link>
        ))}

        <Link
          href="/marketplace"
          className="group rounded-xl border border-zinc-200 bg-white p-6 transition-shadow hover:shadow-md dark:border-zinc-800 dark:bg-zinc-950"
        >
          <div className="flex items-center justify-between">
            <LuStore className="size-8 text-blue-600" />
            <LuArrowRight className="size-4 text-zinc-400 transition-transform group-hover:translate-x-1" />
          </div>
          <p className="mt-4 text-sm text-zinc-500">Browse Marketplace</p>
          <p className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">View all listings</p>
        </Link>
      </div>

      <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
        <h2 className="font-semibold text-zinc-900 dark:text-zinc-50">Quick actions</h2>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link href="/marketplace" className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
            Browse Marketplace
          </Link>
          {user?.role === "BUYER" && (
            <Link href="/my-orders" className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-900">
              My Orders
            </Link>
          )}
          {user?.role === "SELLER" && (
            <Link href="/my-listings/new" className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-900">
              Create Listing
            </Link>
          )}
          {user?.role === "ADMIN" && (
            <Link href="/admin" className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-900">
              Manage Orders
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
