import { AppShell } from "@/components/layout/app-shell";

/** Auth-gated ERP shell is not expected to navigate instantly from outside. */
export const instant = false;

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return <AppShell>{children}</AppShell>;
}
