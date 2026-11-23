import * as React from "react";
import { Label } from "./label";
import { Input } from "./input";
import { cn } from "@/lib/utils";

type FormFieldProps = {
  id: string;
  label: string;
  required?: boolean;
  error?: string;
  className?: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

export const FormField = React.forwardRef<HTMLInputElement, FormFieldProps>(
  ({ id, label, required, error, className, ...inputProps }, ref) => (
    <div className={cn("w-full", className)}>
      <Label htmlFor={id} required={required}>
        {label}
      </Label>
      <Input
        id={id}
        ref={ref}
        aria-invalid={error ? "true" : "false"}
        aria-describedby={error ? `${id}-error` : undefined}
        {...inputProps}
      />
      {error ? (
        <p id={`${id}-error`} className="mt-1.5 text-xs text-rose-600" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  )
);
FormField.displayName = "FormField";
