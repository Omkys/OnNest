import { ModulePlaceholder } from "@/components/layout/module-placeholder";

export const metadata = { title: "Payments · OnNests" };

export default function PaymentsPage() {
  return (
    <ModulePlaceholder
      title="Payments"
      description="Record money received — cash, UPI, transfer — with verification before outstanding balances change."
      primaryAction={{ label: "Record payment", href: "/payments?create=1" }}
      bullets={[
        "All payments and receipts",
        "Pending verification",
        "Allocate against bills",
        "Partial payments and refunds",
      ]}
    />
  );
}
