import { ModulePlaceholder } from "@/components/layout/module-placeholder";

export const metadata = { title: "Bookings · OnNests" };

export default function BookingsPage() {
  return (
    <ModulePlaceholder
      title="Bookings"
      description="Manage the booking stage before a tenant officially moves in — pending, confirmed, cancelled and expired."
      primaryAction={{ label: "New booking", href: "/bookings?create=1" }}
      bullets={[
        "All / Pending / Confirmed / Cancelled / Expired",
        "Applicant and selected unit",
        "Advance payments and documents",
        "Auto-release expired bookings (SRD)",
      ]}
    />
  );
}
