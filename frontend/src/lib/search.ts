import { navGroups, workspaceNav, bottomNav } from "./navigation";

export type SearchResult = {
  id: string;
  label: string;
  category: string;
  href: string;
  description?: string;
};

/** Dynamic searchable index — extend with API-backed entities as modules ship. */
const entityIndex: SearchResult[] = [
  {
    id: "prj-lakeview",
    label: "Lakeview Residences",
    category: "Projects",
    href: "/projects",
    description: "Project · 3 towers",
  },
  {
    id: "prj-greenpark",
    label: "Green Park Towers",
    category: "Projects",
    href: "/projects",
    description: "Project · 2 towers",
  },
  {
    id: "unit-lv-1204",
    label: "LV-A-1204",
    category: "Units",
    href: "/units",
    description: "Rented · Floor 12",
  },
  {
    id: "unit-gp-508",
    label: "GP-B-508",
    category: "Units",
    href: "/units",
    description: "Available · Floor 5",
  },
  {
    id: "tenant-aisha",
    label: "Aisha Khan",
    category: "Tenants",
    href: "/tenants",
    description: "Active tenancy · LV-A-1204",
  },
  {
    id: "tenant-rahul",
    label: "Rahul Mehta",
    category: "Tenants",
    href: "/tenants",
    description: "Booking · GP-B-508",
  },
  {
    id: "pay-1042",
    label: "TX-1042 · ₹28,500",
    category: "Payments",
    href: "/payments",
    description: "Rent · Confirmed",
  },
  {
    id: "bill- overdue",
    label: "Overdue balances",
    category: "Rent & Billing",
    href: "/rent",
    description: "Finance · Outstanding",
  },
];

function navResults(): SearchResult[] {
  const items = [...workspaceNav, ...navGroups.flatMap((g) => g.items), ...bottomNav];
  return items.map((item) => ({
    id: `nav-${item.href}`,
    label: item.label,
    category: "Navigation",
    href: item.href,
    description: item.description,
  }));
}

export function searchWorkspace(query: string, limit = 8): SearchResult[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  const pool = [...navResults(), ...entityIndex];
  const scored = pool
    .map((item) => {
      const hay = `${item.label} ${item.category} ${item.description || ""}`.toLowerCase();
      let score = 0;
      if (item.label.toLowerCase().startsWith(q)) score += 40;
      if (item.label.toLowerCase().includes(q)) score += 25;
      if (item.category.toLowerCase().includes(q)) score += 15;
      if (hay.includes(q)) score += 10;
      return { item, score };
    })
    .filter((row) => row.score > 0)
    .sort((a, b) => b.score - a.score);

  return scored.slice(0, limit).map((row) => row.item);
}
