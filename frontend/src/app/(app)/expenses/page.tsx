import { ModulePlaceholder } from "@/components/layout/module-placeholder";

export const metadata = { title: "Expenses · OnNests" };

export default function ExpensesPage() {
  return (
    <ModulePlaceholder
      title="Expenses"
      description="Track property spend across maintenance, salaries, utilities, vendors and more."
      primaryAction={{ label: "Add expense", href: "/expenses?create=1" }}
      bullets={[
        "Categories and vendors",
        "Invoices and attachments",
        "Property-wise expenses",
        "Monthly expense summary",
      ]}
    />
  );
}
