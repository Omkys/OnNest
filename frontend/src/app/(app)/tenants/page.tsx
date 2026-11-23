import { ModulePlaceholder } from "@/components/layout/module-placeholder";

export const metadata = { title: "Tenants · OnNests" };

export default function TenantsPage() {
  return (
    <ModulePlaceholder
      title="Tenants"
      description="Tenant CRM with permanent profiles, KYC, tenancy history and payment records."
      primaryAction={{ label: "Add tenant", href: "/tenants?create=1" }}
      bullets={[
        "Profiles and contact info",
        "KYC / Aadhaar within organization",
        "Current and previous tenancies",
        "Documents and payment history",
      ]}
    />
  );
}
