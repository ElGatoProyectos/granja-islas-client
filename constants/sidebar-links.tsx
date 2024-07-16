import {
  BarChart4,
  DollarSign,
  LayoutDashboard,
  ListTodo,
  Package,
  Receipt,
  UserRound,
  Users,
} from "lucide-react";
import { LinkSidebar } from "./types";

export const sidebarLinks: LinkSidebar[] = [
  {
    icon: <LayoutDashboard className="mr-2 h-4 w-4" />,
    label: "Panel de control",
    route: "/",
  },
  {
    icon: <Users className="mr-2 h-4 w-4" />,
    label: "Proveedores",
    route: "/suppliers",
  },
  {
    icon: <BarChart4 className="mr-2 h-4 w-4" />,
    label: "Análisis",
    route: "/analytics",
  },
  {
    icon: <Receipt className="mr-2 h-4 w-4" />,
    label: "Comprobantes",
    route: "/receipts",
  },
  {
    icon: <Package className="mr-2 h-4 w-4" />,
    label: "Productos",
    route: "/products",
  },
  {
    icon: <ListTodo className="mr-2 h-4 w-4" />,
    label: "Lista",
    route: "/list",
  },
  {
    icon: <DollarSign className="mr-2 h-4 w-4" />,
    label: "Pagos",
    route: "/payments",
  },
  {
    icon: <UserRound className="mr-2 h-4 w-4" />,
    label: "Usuarios",
    route: "/users",
  },
  {
    icon: <LayoutDashboard className="mr-2 h-4 w-4" />,
    label: "Configuración",
    route: "/settings",
  },
];
