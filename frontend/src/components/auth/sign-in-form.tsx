"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ApiError, signIn } from "@/lib/api";
import { persistAuth } from "@/lib/auth-store";
import { signInSchema, type SignInFormValues } from "@/lib/validations/auth";

export function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const resetSuccess = searchParams.get("reset") === "success";
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const mutation = useMutation({
    mutationFn: (values: SignInFormValues) =>
      signIn({
        email: values.email,
        password: values.password,
      }),
    onSuccess: (res) => {
      persistAuth(res.data.token, res.data.user, res.data.organization);
      router.push("/dashboard");
    },
    onError: (error: AxiosError<ApiError>) => {
      setServerError(
        error.response?.data?.message || "Could not sign in. Please try again."
      );
    },
  });

  const onSubmit = handleSubmit((values) => {
    setServerError(null);
    mutation.mutate(values);
  });

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

      <div>
        <Label htmlFor="password" required>
          Password
        </Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            placeholder="Enter your password"
            aria-invalid={errors.password ? "true" : "false"}
            className="pr-11"
            {...register("password")}
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-slate-400 hover:text-slate-600"
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {errors.password?.message ? (
          <p className="mt-1.5 text-xs text-rose-600" role="alert">
            {errors.password.message}
          </p>
        ) : null}
        <div className="mt-2 text-right">
          <Link
            href="/forgot-password"
            className="text-sm font-medium text-teal-700 hover:text-teal-800"
          >
            Forgot password?
          </Link>
        </div>
      </div>

      {resetSuccess ? (
        <div className="rounded-lg border border-teal-200 bg-teal-50 px-3 py-2.5 text-sm text-teal-800">
          Password updated. Sign in with your new password.
        </div>
      ) : null}

      {serverError ? (
        <div className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2.5 text-sm text-rose-700">
          {serverError}
        </div>
      ) : null}

      <Button type="submit" className="mt-2 w-full" disabled={mutation.isPending}>
        {mutation.isPending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Signing in…
          </>
        ) : (
          "Sign in"
        )}
      </Button>
    </form>
  );
}
