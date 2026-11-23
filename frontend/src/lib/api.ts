import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export const api = axios.create({
  baseURL: `${API_URL}/api`,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("onnests_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export type AuthUser = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  role: string;
  fullName: string;
};

export type AuthOrganization = {
  id: string;
  organizationId: string;
  name: string;
  slug: string;
  plan: string;
};

export type AuthResponse = {
  token: string;
  user: AuthUser;
  organization: AuthOrganization;
};

export type ApiSuccess<T> = {
  success: true;
  message?: string;
  data: T;
};

export type ApiError = {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
};

export async function signUp(payload: {
  organizationName: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
}) {
  const { data } = await api.post<ApiSuccess<AuthResponse>>(
    "/auth/signup",
    payload
  );
  return data;
}

export async function signIn(payload: {
  email: string;
  password: string;
}) {
  const { data } = await api.post<ApiSuccess<AuthResponse>>(
    "/auth/signin",
    payload
  );
  return data;
}

export async function fetchMe() {
  const { data } = await api.get<
    ApiSuccess<{ user: AuthUser; organization: AuthOrganization }>
  >("/auth/me");
  return data;
}

export async function signOut() {
  const { data } = await api.post<ApiSuccess<null>>("/auth/logout");
  return data;
}

export async function forgotPassword(payload: { email: string }) {
  const { data } = await api.post<ApiSuccess<null>>(
    "/auth/forgot-password",
    payload
  );
  return data;
}

export async function resetPassword(payload: {
  token: string;
  password: string;
  confirmPassword: string;
}) {
  const { data } = await api.post<ApiSuccess<null>>(
    "/auth/reset-password",
    payload
  );
  return data;
}
