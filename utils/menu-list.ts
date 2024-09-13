import {
  Users,
  UserRound,
  Settings,
  LayoutDashboard,
  LucideIcon,
  Package,
  Receipt,
  BarChart4,
  ListTodo,
  DollarSign,
} from "lucide-react";

type Submenu = {
  href: string;
  label: string;
  active: boolean;
};

type Menu = {
  href: string;
  label: string;
  active: boolean;
  icon: LucideIcon;
  submenus: Submenu[];
};

type Group = {
  groupLabel: string;
  menus: Menu[];
};

export function getMenuList(pathname: string): Group[] {
  return [
    {
      groupLabel: "",
      menus: [
        {
          href: "/dashboard",
          label: "Registro de compras",
          active: pathname === "/dashboard",
          icon: LayoutDashboard,
          submenus: [],
        },
        {
          href: "/receipts",
          label: "Comprobantes",
          active: pathname.includes("/receipts"),
          icon: Receipt,
          submenus: [],
        },
        {
          href: "/dashboard/analytics",
          label: "Análisis",
          active: pathname.includes("/dashboard/analytics"),
          icon: BarChart4,
          submenus: [
            {
              href: "/dashboard/analytics/general",
              label: "General",
              active: pathname === "/dashboard/analytics/general",
            },
            {
              href: "/dashboard/analytics/specific",
              label: "Específico",
              active: pathname === "/dashboard/analytics/specific",
            },
          ],
        },
        {
          href: "/dashboard/suppliers",
          label: "Proveedores",
          active: pathname.includes("/dashboard/suppliers"),
          icon: Users,
          submenus: [],
        },
        {
          href: "/dashboard/products",
          label: "Productos",
          active: pathname.includes("/dashboard/products"),
          icon: Package,
          submenus: [],
        },
        {
          href: "/dashboard/list",
          label: "Lista",
          active: pathname.includes("/dashboard/list"),
          icon: ListTodo,
          submenus: [],
        },
      ],
    },
    {
      groupLabel: "Finanzas",
      menus: [
        {
          href: "/dashboard/payments",
          label: "Pagos",
          active: pathname.includes("/dashboard/payments"),
          icon: DollarSign,
          submenus: [],
        },
      ],
    },
    {
      groupLabel: "Configuración",
      menus: [
        {
          href: "/dashboard/users",
          label: "Usuarios",
          active: pathname.includes("/dashboard/users"),
          icon: UserRound,
          submenus: [],
        },
        {
          href: "/dashboard/settings",
          label: "Configuración",
          active: pathname.includes("/dashboard/settings"),
          icon: Settings,
          submenus: [],
        },
      ],
    },
  ];
}
