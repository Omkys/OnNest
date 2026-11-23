import { ModulePlaceholder } from "@/components/layout/module-placeholder";

export const metadata = { title: "Documents · OnNests" };

export default function DocumentsPage() {
  return (
    <ModulePlaceholder
      title="Documents"
      description="Private, organization-scoped document vault for KYC, agreements, proofs and receipts."
      bullets={[
        "Tenant and KYC documents",
        "Rental agreements",
        "Payment proofs and receipts",
        "Authorized access only",
      ]}
    />
  );
}
