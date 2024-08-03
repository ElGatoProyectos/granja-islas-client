"use client";

import { LogOut, Settings } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOut } from "next-auth/react";
import { SUPERADMIN } from "@/constants/roles";
import Link from "next/link";
import { backend_url } from "@/constants/config";
import { UserProfile } from "./user-profile";
import { Skeleton } from "../ui/skeleton";
import { useUserInfo } from "@/context/user-context";
import { useCompanySession } from "@/context/company-context";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { getCompany } from "@/lib/actions/company.actions";
import { UpdateCompanySchema } from "@/lib/validations/auth/company";

export function UserDropdown({
  companies,
}: {
  companies?: UpdateCompanySchema[];
}) {
  const { loading, userInfo } = useUserInfo();

  const { company, setCompany } = useCompanySession();
  const [changeCompany, setChangeCompany] = useState("");
  const handleCompany = async (value: string) => {
    setChangeCompany(value);
    const companyformated = await getCompany({ idCompany: value });
    setCompany(companyformated);
  };
  useEffect(() => {
    if (company) {
      setChangeCompany(company?.id.toString());
    }
  }, [company]);

  return (
    <>
      {loading ? (
        <div className="flex gap-2 justify-center items-center">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-3 w-[100px]" />
            <Skeleton className="h-3 w-[60px]" />
          </div>
        </div>
      ) : userInfo ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="gap-x-3 hover:bg-transparent p-0 focus-visible:ring-0"
            >
              <Avatar>
                <AvatarImage
                  src={`${backend_url}/api/users/file/${userInfo.id}`}
                />
                <AvatarFallback>A</AvatarFallback>
              </Avatar>
              <div className="flex flex-col items-start">
                <p className="text-sm font-bold">{userInfo.name}</p>
                <span className="text-sm text-muted-foreground ">
                  {userInfo.role === SUPERADMIN
                    ? "Super Administrador"
                    : userInfo.role}
                </span>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>Mi cuenta</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <UserProfile />
            <DropdownMenuSeparator />
            <DropdownMenuRadioGroup
              value={changeCompany}
              onValueChange={handleCompany}
            >
              {companies?.map(({ id, business_name }) => (
                <DropdownMenuRadioItem
                  key={id}
                  className={cn("pl-2")}
                  value={id.toString()}
                >
                  <Avatar className={"mr-2 h-8 w-8"}>
                    <AvatarImage
                      src={`${backend_url}/api/companies/file/${id}`}
                    />
                    <AvatarFallback>E</AvatarFallback>
                  </Avatar>
                  <span className="text-xs">{business_name}</span>
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>

            <Link href="/onboarding">
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Configuración</span>
              </DropdownMenuItem>
            </Link>

            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                signOut();
              }}
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Cerrar Sesión</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <div className="h-80px flex gap-2 justify-center items-center">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-3 w-[130px]" />
            <Skeleton className="h-3 w-[60px]" />
          </div>
        </div>
      )}
    </>
  );
}
