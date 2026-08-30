import { cn } from "@/lib/utils";
import type { TextareaHTMLAttributes } from "react";

export interface TextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

export function Textarea({ className, error, ...props }: TextareaProps) {
  return (
    <textarea
      className={cn(
        "flex min-h-24 w-full rounded-lg border bg-white px-3 py-2 text-sm text-zinc-900",
        "placeholder:text-zinc-400 transition-colors resize-y",
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
