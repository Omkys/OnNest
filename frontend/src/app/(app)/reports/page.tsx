import { ModulePlaceholder } from "@/components/layout/module-placeholder";

export const metadata = { title: "Reports & Analytics · OnNests" };

export default function ReportsPage() {
  return (
    <ModulePlaceholder
      title="Reports & Analytics"
      description="Detailed, exportable reports — not another dashboard. Filter by property and date range."
      bullets={[
        "Occupancy and vacant units",
        "Rent collection and outstanding dues",
        "Expense and P&L summaries",
        "CSV / Excel / PDF export",
      ]}
    />
  );
}
