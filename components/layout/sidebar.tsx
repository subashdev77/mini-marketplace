"use client";

import { useAuth } from "@/hooks/use-auth";
import type { Role } from "@/types/marketplace";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { IconType } from "react-icons";
import {
  LuLayoutDashboard,
  LuLayoutGrid,
  LuPackage,
  LuSettings,
  LuShield,
  LuShoppingBag,
  LuStore,
} from "react-icons/lu";
import { cn } from "@/lib/utils";

interface NavItem {
  href: string;
  label: string;
  icon: IconType;
  roles?: Role[];
}

const navItems: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: LuLayoutDashboard },
  { href: "/marketplace", label: "Marketplace", icon: LuLayoutGrid },
  { href: "/my-orders", label: "My Orders", icon: LuShoppingBag, roles: ["BUYER"] },
  { href: "/my-listings", label: "My Listings", icon: LuStore, roles: ["SELLER"] },
  { href: "/seller-orders", label: "Seller Orders", icon: LuPackage, roles: ["SELLER"] },
  { href: "/admin", label: "Admin", icon: LuShield, roles: ["ADMIN"] },
  { href: "/profile", label: "Profile", icon: LuSettings },
];

export function Sidebar() {
  const { user } = useAuth();
  const pathname = usePathname();

  const visibleItems = navItems.filter(
    (item) => !item.roles || (user && item.roles.includes(user.role))
  );

  return (
    <aside className="flex w-64 shrink-0 flex-col border-r border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex h-16 items-center border-b border-zinc-200 px-6 dark:border-zinc-800">
        <Link href="/dashboard" className="flex items-center gap-2">
          <span className="flex size-8 items-center justify-center rounded-lg bg-blue-600 text-sm font-bold text-white">
            M
          </span>
          <span className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
            Marketplace
          </span>
        </Link>
      </div>

      <nav className="flex-1 space-y-1 p-4">
        {visibleItems.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400"
                  : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-100"
              )}
            >
              <item.icon className="size-4 shrink-0" aria-hidden />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {user && (
        <div className="border-t border-zinc-200 p-4 dark:border-zinc-800">
          <div className="flex items-center gap-3 rounded-lg px-3 py-2">
            <span className="flex size-9 items-center justify-center rounded-full bg-blue-100 text-xs font-semibold text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
              {user.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .slice(0, 2)
                .toUpperCase()}
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-zinc-900 dark:text-zinc-100">
                {user.name}
              </p>
              <p className="truncate text-xs capitalize text-zinc-500 dark:text-zinc-400">
                {user.role.toLowerCase()}
              </p>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
