import * as React from "react";
import { cn } from "@/lib/utils";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => (
    <input
      type={type}
      className={cn(
        "flex h-11 w-full rounded-lg border border-slate-200 bg-white px-3.5 text-sm text-slate-900 shadow-sm outline-none transition",
        "placeholder:text-slate-400",
        "focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20",
        "disabled:cursor-not-allowed disabled:bg-slate-50 disabled:opacity-60",
        "aria-[invalid=true]:border-rose-500 aria-[invalid=true]:focus:ring-rose-500/20",
        className
      )}
      ref={ref}
      {...props}
    />
  )
);
Input.displayName = "Input";
