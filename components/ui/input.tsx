import { cn } from "@/lib/utils";
import type { InputHTMLAttributes } from "react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export function Input({ className, error, ...props }: InputProps) {
  return (
    <input
      className={cn(
        "flex h-10 w-full rounded-lg border bg-white px-3 text-sm text-zinc-900",
        "placeholder:text-zinc-400 transition-colors",
        "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-500",
        error
          ? "border-red-500 focus:ring-red-500"
          : "border-zinc-300 dark:border-zinc-700",
        className
      )}
      {...props}
    />
  );
}
