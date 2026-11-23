import { ModulePlaceholder } from "@/components/layout/module-placeholder";

export const metadata = { title: "Audit Logs · OnNests" };

export default function AuditLogsPage() {
  return (
    <ModulePlaceholder
      title="Audit Logs"
      description="Trace who changed what — unit status, bookings, payments, tenant edits and permissions."
      bullets={[
        "Actor, action and timestamp",
        "Record and organization context",
        "Previous and new values",
        "Money and tenant-critical events",
      ]}
    />
  );
}
