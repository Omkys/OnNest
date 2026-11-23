import { ModulePlaceholder } from "@/components/layout/module-placeholder";

export const metadata = { title: "Units & Inventory · OnNests" };

export default function UnitsPage() {
  return (
    <ModulePlaceholder
      title="Units & Inventory"
      description="Track every rental unit with status, pricing, floor-rise and occupancy history."
      primaryAction={{ label: "Add unit", href: "/units?create=1" }}
      bullets={[
        "Available · Reserved · Blocked · Booked · Rented",
        "Filter by project, tower, floor, type, status",
        "Unit pricing and floor-rise",
        "Block / unblock units",
        "Unit detail and history",
      ]}
    />
  );
}
