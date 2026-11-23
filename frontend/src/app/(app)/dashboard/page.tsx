import { DashboardView } from "@/components/dashboard/dashboard-view";

export const metadata = {
  title: "Dashboard · OnNests",
};

/** Dashboard depends on client auth + org context; skip instant-nav validation. */
export const instant = false;

export default function DashboardPage() {
  return <DashboardView />;
}
