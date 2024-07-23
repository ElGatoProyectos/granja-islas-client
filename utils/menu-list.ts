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
          href: "/",
          label: "Registro de compras",
          active: pathname === "/",
          icon: LayoutDashboard,
          submenus: [],
        },
        {
          href: "/analytics",
          label: "Análisis",
          active: pathname.includes("/analytics"),
          icon: BarChart4,
          submenus: [
            {
              href: "/analytics/general",
              label: "General",
              active: pathname === "/analytics/general",
            },
            {
              href: "/analytics/specific",
              label: "Específico",
              active: pathname === "/analytics/specific",
            },
          ],
        },
        {
          href: "/suppliers",
          label: "Proveedores",
          active: pathname.includes("/suppliers"),
          icon: Users,
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
          href: "/products",
          label: "Productos",
          active: pathname.includes("/products"),
          icon: Package,
          submenus: [],
        },
        {
          href: "/list",
          label: "Lista",
          active: pathname.includes("/list"),
          icon: ListTodo,
          submenus: [],
        },
      ],
    },
    {
      groupLabel: "Finanzas",
      menus: [
        {
          href: "/payments",
          label: "Pagos",
          active: pathname.includes("/payments"),
          icon: DollarSign,
          submenus: [],
        },
      ],
    },
    {
      groupLabel: "Configuración",
      menus: [
        {
          href: "/users",
          label: "Usuarios",
          active: pathname.includes("/users"),
          icon: UserRound,
          submenus: [],
        },
        {
          href: "/settings",
          label: "Configuración",
          active: pathname.includes("/settings"),
          icon: Settings,
          submenus: [],
        },
      ],
    },
  ];
}
