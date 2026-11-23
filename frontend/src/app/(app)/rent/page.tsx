import { ModulePlaceholder } from "@/components/layout/module-placeholder";

export const metadata = { title: "Rent & Billing · OnNests" };

export default function RentPage() {
  return (
    <ModulePlaceholder
      title="Rent & Billing"
      description="Generate monthly rent from tenancy pricing snapshots — bills, outstanding balances, overdue and adjustments."
      primaryAction={{ label: "Generate rent", href: "/rent?generate=1" }}
      bullets={[
        "Monthly rent and bills",
        "Outstanding / overdue balances",
        "Floor-rise and late charges",
        "Paid / unpaid / partial tracking",
      ]}
    />
  );
}
