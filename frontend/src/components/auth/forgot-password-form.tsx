"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { ApiError, forgotPassword } from "@/lib/api";
import {
  forgotPasswordSchema,
  type ForgotPasswordFormValues,
} from "@/lib/validations/auth";

export function ForgotPasswordForm() {
  const [serverError, setServerError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const mutation = useMutation({
    mutationFn: forgotPassword,
    onSuccess: () => {
      setSent(true);
      setServerError(null);
    },
    onError: (error: AxiosError<ApiError>) => {
      setServerError(
        error.response?.data?.message ||
          "Could not send reset email. Please try again."
      );
    },
  });

  const onSubmit = handleSubmit((values) => {
    setServerError(null);
    mutation.mutate(values);
  });

  if (sent) {
    return (
      <div className="rounded-xl border border-teal-100 bg-teal-50/70 px-4 py-5 text-sm text-slate-700">
        <div className="mb-2 flex items-center gap-2 font-semibold text-teal-800">
          <CheckCircle2 className="h-4 w-4" />
          Check your email
        </div>
        <p>
          If an account exists for that address, we sent a password reset link.
          It expires in 1 hour.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <FormField
        id="email"
        label="Email"
        required
        type="email"
        autoComplete="email"
        placeholder="you@company.com"
        error={errors.email?.message}
        {...register("email")}
      />

      {serverError ? (
        <div className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2.5 text-sm text-rose-700">
          {serverError}
        </div>
      ) : null}

      <Button type="submit" className="w-full" disabled={mutation.isPending}>
        {mutation.isPending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Sending link…
          </>
        ) : (
          "Send reset link"
        )}
      </Button>
    </form>
  );
}
