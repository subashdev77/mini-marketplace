import { cn } from "@/lib/utils";
import type { SelectHTMLAttributes } from "react";
import { LuChevronDown } from "react-icons/lu";

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  error?: boolean;
}

export function Select({ className, error, children, ...props }: SelectProps) {
  return (
    <div className="relative">
      <select
        className={cn(
          "flex h-10 w-full rounded-lg border bg-white px-3 pr-10 text-sm text-zinc-900",
          "transition-colors appearance-none",
          "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "dark:bg-zinc-900 dark:text-zinc-100",
          error
            ? "border-red-500 focus:ring-red-500"
            : "border-zinc-300 dark:border-zinc-700",
          className
        )}
        {...props}
      >
        {children}
      </select>
      <LuChevronDown
        className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-zinc-400"
        aria-hidden
      />
    </div>
  );
}
