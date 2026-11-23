import { ModulePlaceholder } from "@/components/layout/module-placeholder";

export const metadata = { title: "Electricity · OnNests" };

export default function ElectricityPage() {
  return (
    <ModulePlaceholder
      title="Electricity"
      description="Separate billing for meters — readings, consumption and electricity bills."
      primaryAction={{ label: "Add reading", href: "/electricity?reading=1" }}
      bullets={[
        "Meter management",
        "Previous / current readings",
        "Units consumed × rate",
        "Reading corrections with history",
      ]}
    />
  );
}
