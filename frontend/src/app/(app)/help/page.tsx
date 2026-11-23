import { ModulePlaceholder } from "@/components/layout/module-placeholder";

export const metadata = { title: "Help & Support · OnNests" };

export default function HelpPage() {
  return (
    <ModulePlaceholder
      title="Help & Support"
      description="Guides, contact support and product documentation for your OnNests workspace."
      bullets={["Getting started", "Billing workflows", "Contact support"]}
    />
  );
}
