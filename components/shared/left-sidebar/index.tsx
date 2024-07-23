"use client";

import { useToggle } from "@/hooks/use-toggle";
import { SidebarToggle } from "./sidebar-toggle";
import { cn } from "@/lib/utils";
import { CompanyCard } from "../company-card";
import { Menu } from "./menu";

export function LeftSidebar() {
  const [sidebar, toogleSidebar] = useToggle();

  return (
    <aside
      className={cn(
        "sticky left-0 top-0 z-20 h-screen flex flex-col justify-between border-r px-6 max-md:hidden ease-in-out duration-300",
        !sidebar === false ? "w-[100px]" : "w-64"
      )}
    >
      <SidebarToggle isOpen={!sidebar} setIsOpen={toogleSidebar} />
      <CompanyCard isOpen={!sidebar} />
      <Menu isOpen={!sidebar} />
    </aside>
  );
}
