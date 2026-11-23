"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ApiError, signUp } from "@/lib/api";
import { persistAuth } from "@/lib/auth-store";
import { signUpSchema, type SignUpFormValues } from "@/lib/validations/auth";

export function SignUpForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      organizationName: "",
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      password: "",
      confirmPassword: "",
    },
  });

  const mutation = useMutation({
    mutationFn: signUp,
    onSuccess: (res) => {
      persistAuth(res.data.token, res.data.user, res.data.organization);
      router.push("/dashboard");
    },
    onError: (error: AxiosError<ApiError>) => {
      const message =
        error.response?.data?.message ||
        "Could not create your account. Please try again.";
      setServerError(message);
    },
  });

  const onSubmit = handleSubmit((values) => {
    setServerError(null);
    mutation.mutate(values);
  });

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <FormField
        id="organizationName"
        label="Organization name"
        required
        autoComplete="organization"
        placeholder="Acme Property Group"
        error={errors.organizationName?.message}
        {...register("organizationName")}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField
          id="firstName"
          label="First name"
          required
          autoComplete="given-name"
          placeholder="Jordan"
          error={errors.firstName?.message}
          {...register("firstName")}
        />
        <FormField
          id="lastName"
          label="Last name"
          required
          autoComplete="family-name"
          placeholder="Lee"
          error={errors.lastName?.message}
          {...register("lastName")}
        />
      </div>

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

      <FormField
        id="phoneNumber"
        label="Phone number"
        required
        type="tel"
        autoComplete="tel"
        placeholder="+1 555 000 0000"
        error={errors.phoneNumber?.message}
        {...register("phoneNumber")}
      />

      <div>
        <Label htmlFor="password" required>
          Create password
        </Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            placeholder="At least 8 characters"
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
        ) : (
          <p className="mt-1.5 text-xs text-slate-400">
            Use 8+ characters with at least one letter and one number.
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="confirmPassword" required>
          Confirm password
        </Label>
        <div className="relative">
          <Input
            id="confirmPassword"
            type={showConfirm ? "text" : "password"}
            autoComplete="new-password"
            placeholder="Re-enter your password"
            aria-invalid={errors.confirmPassword ? "true" : "false"}
            className="pr-11"
            {...register("confirmPassword")}
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-slate-400 hover:text-slate-600"
            onClick={() => setShowConfirm((v) => !v)}
            aria-label={showConfirm ? "Hide password" : "Show password"}
          >
            {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {errors.confirmPassword?.message ? (
          <p className="mt-1.5 text-xs text-rose-600" role="alert">
            {errors.confirmPassword.message}
          </p>
        ) : null}
      </div>

      {serverError ? (
        <div className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2.5 text-sm text-rose-700">
          {serverError}
        </div>
      ) : null}

      <Button type="submit" className="mt-2 w-full" disabled={mutation.isPending}>
        {mutation.isPending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Creating account…
          </>
        ) : (
          "Create account"
        )}
      </Button>
    </form>
  );
}
