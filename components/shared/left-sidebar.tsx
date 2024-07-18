"use client";

import Link from "next/link";
import { buttonVariants } from "../ui/button";
import { usePathname } from "next/navigation";
import { sidebarLinks } from "@/constants/sidebar-links";
import { CompanyCard } from "./company-card";

export function LeftSidebar() {
  const pathname = usePathname();

  return (
    <section className="sticky left-0 top-0 z-20 flex h-screen w-60 flex-col justify-between overflow-auto border-r px-6 max-md:hidden">
      <CompanyCard />
      <div className="flex w-full flex-1 flex-col gap-3 mt-5">
        {sidebarLinks.map(({ label, icon, route }) => {
          const isActive =
            (pathname.includes(route) && route.length > 1) ||
            pathname === route;
          return (
            <Link
              key={label}
              href={route}
              className={`${buttonVariants({
                variant: `${isActive ? "default" : "ghost"}`,
              })} !justify-start`}
            >
              {icon}
              {label}
            </Link>
          );
        })}
      </div>
    </section>
  );
}
