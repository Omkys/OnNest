import { ModulePlaceholder } from "@/components/layout/module-placeholder";

export const metadata = { title: "Settings · OnNests" };

export default function SettingsPage() {
  return (
    <ModulePlaceholder
      title="Settings"
      description="Organization-level configuration — rent rules, floor rise, electricity rates, booking and payments."
      bullets={[
        "Organization profile",
        "Rent and floor-rise defaults",
        "Electricity rates",
        "Booking rules and notifications",
      ]}
    />
  );
}
