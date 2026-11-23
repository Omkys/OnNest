import { ModulePlaceholder } from "@/components/layout/module-placeholder";

export const metadata = { title: "Facilities & Inventory · OnNests" };

export default function FacilitiesPage() {
  return (
    <ModulePlaceholder
      title="Facilities & Inventory"
      description="Manage amenities and physical assets — parking, gym, furniture, appliances and equipment."
      primaryAction={{ label: "Add inventory item", href: "/facilities?create=1" }}
      bullets={[
        "Facilities and amenities",
        "Inventory status lifecycle",
        "Assigned unit / location",
        "Condition and history",
      ]}
    />
  );
}
