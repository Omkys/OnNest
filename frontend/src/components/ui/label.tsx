import * as React from "react";
import { cn } from "@/lib/utils";

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
}

export const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, children, required, ...props }, ref) => (
    <label
      ref={ref}
      className={cn(
        "mb-1.5 block text-sm font-medium text-slate-700",
        className
      )}
      {...props}
    >
      {children}
      {required ? (
        <span className="ml-0.5 text-rose-600" aria-hidden="true">
          *
        </span>
      ) : null}
    </label>
  )
);
Label.displayName = "Label";
