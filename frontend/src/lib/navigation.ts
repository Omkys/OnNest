import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  Building2,
  DoorOpen,
  CalendarCheck2,
  Users,
  Receipt,
  Zap,
  Wallet,
  PiggyBank,
  Warehouse,
  FolderOpen,
  BarChart3,
  ShieldCheck,
  ScrollText,
  Settings,
  LifeBuoy,
  UserCircle2,
} from "lucide-react";

export type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  description?: string;
};

export type NavGroup = {
  id: string;
  label: string;
  items: NavItem[];
};

export const workspaceNav: NavItem[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    description: "Occupancy, revenue and daily pulse",
  },
];

export const navGroups: NavGroup[] = [
  {
    id: "property",
    label: "Property",
    items: [
      {
        label: "Projects",
        href: "/projects",
        icon: Building2,
        description: "Projects, towers, floors and hierarchy",
      },
      {
        label: "Units & Inventory",
        href: "/units",
        icon: DoorOpen,
        description: "Unit status, pricing and occupancy",
      },
      {
        label: "Bookings",
        href: "/bookings",
        icon: CalendarCheck2,
        description: "Pre-move-in reservations",
      },
      {
        label: "Tenants",
        href: "/tenants",
        icon: Users,
        description: "Tenant CRM and tenancy history",
      },
    ],
  },
  {
    id: "finance",
    label: "Finance",
    items: [
      {
        label: "Rent & Billing",
        href: "/rent",
        icon: Receipt,
        description: "Monthly rent, bills and balances",
      },
      {
        label: "Electricity",
        href: "/electricity",
        icon: Zap,
        description: "Meters, readings and power bills",
      },
      {
        label: "Payments",
        href: "/payments",
        icon: Wallet,
        description: "Collections, receipts and refunds",
      },
      {
        label: "Expenses",
        href: "/expenses",
        icon: PiggyBank,
        description: "Property spend and vendor costs",
      },
    ],
  },
  {
    id: "operations",
    label: "Operations",
    items: [
      {
        label: "Facilities & Inventory",
        href: "/facilities",
        icon: Warehouse,
        description: "Amenities and physical assets",
      },
      {
        label: "Documents",
        href: "/documents",
        icon: FolderOpen,
        description: "Agreements, KYC and proofs",
      },
      {
        label: "Reports & Analytics",
        href: "/reports",
        icon: BarChart3,
        description: "Exportable operational reports",
      },
    ],
  },
  {
    id: "administration",
    label: "Administration",
    items: [
      {
        label: "Users & Roles",
        href: "/users",
        icon: ShieldCheck,
        description: "Members, invites and permissions",
      },
      {
        label: "Audit Logs",
        href: "/audit-logs",
        icon: ScrollText,
        description: "Traceable organization activity",
      },
      {
        label: "Settings",
        href: "/settings",
        icon: Settings,
        description: "Org profile and billing rules",
      },
    ],
  },
];

export const bottomNav: NavItem[] = [
  {
    label: "Help & Support",
    href: "/help",
    icon: LifeBuoy,
  },
  {
    label: "Profile",
    href: "/profile",
    icon: UserCircle2,
  },
];

export const createActions = [
  { label: "New booking", href: "/bookings?create=1" },
  { label: "Add tenant", href: "/tenants?create=1" },
  { label: "Record payment", href: "/payments?create=1" },
  { label: "Add expense", href: "/expenses?create=1" },
  { label: "Add project", href: "/projects?create=1" },
  { label: "Add unit", href: "/units?create=1" },
] as const;

export function findNavItem(pathname: string): NavItem | undefined {
  const all = [...workspaceNav, ...navGroups.flatMap((g) => g.items), ...bottomNav];
  return all.find((item) => pathname === item.href || pathname.startsWith(`${item.href}/`));
}

export function getBreadcrumbs(pathname: string) {
  const item = findNavItem(pathname);
  if (!item) {
    return [{ label: "Workspace", href: "/dashboard" }];
  }

  const group = navGroups.find((g) => g.items.some((i) => i.href === item.href));
  const crumbs = [{ label: "Workspace", href: "/dashboard" }];
  if (group) {
    crumbs.push({ label: group.label, href: item.href });
  }
  if (item.href !== "/dashboard") {
    crumbs.push({ label: item.label, href: item.href });
  } else {
    crumbs.push({ label: "Dashboard", href: "/dashboard" });
  }
  return crumbs;
}
