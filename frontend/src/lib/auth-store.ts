import type { AuthOrganization, AuthUser } from "./api";

const TOKEN_KEY = "onnests_token";
const USER_KEY = "onnests_user";
const ORG_KEY = "onnests_organization";

export function persistAuth(
  token: string,
  user: AuthUser,
  organization: AuthOrganization
) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  localStorage.setItem(ORG_KEY, JSON.stringify(organization));
}

export function clearAuth() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(ORG_KEY);
}

export function getStoredToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function getStoredUser(): AuthUser | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(USER_KEY);
  return raw ? (JSON.parse(raw) as AuthUser) : null;
}

export function getStoredOrganization(): AuthOrganization | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(ORG_KEY);
  return raw ? (JSON.parse(raw) as AuthOrganization) : null;
}
