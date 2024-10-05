import { Card, CardHeader } from "@/components/ui/card";
import { ModeToggle } from "../dark-mode/mode-toggle";
import { SheetMenu } from "./left-sidebar/sheet-menu";
import { UserDropdown } from "./user-dropdown";
import { getCompanies } from "@/lib/actions/company.actions";
import { Notifications } from "../notifications";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth-options";
import { ADMIN, SUPERADMIN } from "@/constants/roles";
import { Suspense } from "react";

export async function TopBar() {
  const now = new Date();
  const formattedDate = now.toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const companies = await getCompanies();
  const { user } = await getServerSession(authOptions);

  return (
    <Card className="w-full mb-6 flex-row justify-between border-0 lg:border">
      <CardHeader className="p-0 lg:p-8 lg:py-4 flex-row justify-between space-y-0 items-center">
        <SheetMenu />
        <div className="hidden lg:flex gap-x-2 justify-center items-end">
          <span className="font-bold text-xl">Plan de hoy</span>
          <span className="text-sm font-normal leading-relaxed">
            {formattedDate}
          </span>
        </div>
        <div className="flex gap-2">
          {(user.role === SUPERADMIN || user.role === ADMIN) && (
            <Notifications />
          )}
          <ModeToggle />
          <div className="flex gap-x-2">
            <Suspense fallback="Cargando empresas">
              <UserDropdown companies={companies} />
            </Suspense>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
}
