import { ModulePlaceholder } from "@/components/layout/module-placeholder";

export const metadata = { title: "Users & Roles · OnNests" };

export default function UsersPage() {
  return (
    <ModulePlaceholder
      title="Users & Roles"
      description="Invite members, assign granular permissions and manage organization access."
      primaryAction={{ label: "Invite user", href: "/users?invite=1" }}
      bullets={[
        "Owner · Admin · Manager · Accountant · Staff",
        "Pending invitations",
        "Granular permissions",
        "Deactivate access",
      ]}
    />
  );
}
