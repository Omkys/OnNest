import { ModulePlaceholder } from "@/components/layout/module-placeholder";

export const metadata = { title: "Projects · OnNests" };
export const instant = false;

export default function ProjectsPage() {
  return (
    <ModulePlaceholder
      title="Projects"
      description="Manage the project hierarchy — towers, floors, addresses and project-level configuration."
      primaryAction={{ label: "Add project", href: "/projects?create=1" }}
      bullets={[
        "Create and edit projects",
        "Add towers / buildings",
        "Configure floors",
        "Tree / list hierarchy view",
        "Project-specific settings",
        "Addresses and metadata",
      ]}
    />
  );
}
