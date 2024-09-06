"use client";

import { Card, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CopyButtom } from "../copy-button";
import { cn } from "@/lib/utils";
import { useCompanySession } from "@/context/company-context";
import { Skeleton } from "../ui/skeleton";
import { backend_url } from "@/constants/config";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function CompanyCard({ isOpen }: { isOpen: boolean | undefined }) {
  const { company } = useCompanySession();

  return (
    <>
      {company ? (
        <div
          className={cn(
            "flex flex-col px-2 py-0 my-6",
            isOpen === false ? "h-[124px] justify-end" : ""
          )}
        >
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="link"
                className={cn(
                  "text-wrap p-0 hover:no-underline text-left flex-col h-fit gap-y-2 justify-center items-center",
                  isOpen === false ? "justify-end items-end" : ""
                )}
              >
                <Avatar className="h-12 w-12">
                  <AvatarImage
                    src={`${backend_url}/api/companies/file/${company.id}`}
                    className="object-cover"
                  />
                  <AvatarFallback>E</AvatarFallback>
                </Avatar>
                <p
                  className={cn(
                    "text-center capitalize",
                    isOpen === false ? "hidden" : "block"
                  )}
                >
                  {company.business_name.toLowerCase()}
                </p>
              </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle className="text-3xl font-bold">
                  Empresa
                </DialogTitle>
                <DialogDescription>
                  Esta información es esencial para la identificación y el
                  análisis detallado de la entidad empresarial.
                </DialogDescription>
              </DialogHeader>

              <div className="w-full flex flex-col space-y-4">
                <Avatar className="h-24 w-24">
                  <AvatarImage
                    src={`${backend_url}/api/companies/file/${company.id}`}
                    className="object-cover"
                  />
                  <AvatarFallback>E</AvatarFallback>
                </Avatar>

                <div className="flex flex-col text-sm">
                  <span className="font-semibold">RUC</span>
                  <p className="text-muted-foreground">{company.ruc}</p>
                </div>
                <div className="flex flex-col text-sm">
                  <span className="font-semibold">Razón social</span>
                  <p className="text-muted-foreground capitalize">
                    {company.business_name.toLowerCase()}
                  </p>
                </div>
                <div className="flex flex-col text-sm">
                  <span className="font-semibold">Tipo</span>
                  <p className="text-muted-foreground">
                    {company.business_type}
                  </p>
                </div>
                <div className="flex flex-col text-sm">
                  <span className="font-semibold">Estado</span>
                  <p className="text-muted-foreground capitalize">
                    {company.business_status.toLowerCase()}
                  </p>
                </div>
                <div className="flex flex-col text-sm">
                  <span className="font-semibold">Dirección Fiscal</span>
                  <p className="text-muted-foreground capitalize">
                    {company.business_direction_fiscal.toLowerCase()}
                  </p>
                </div>
                <div className="flex flex-col text-sm">
                  <span className="font-semibold">Celular</span>
                  <p className="text-muted-foreground">
                    {company.country_code} {company.phone}
                  </p>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          <div
            className={cn(
              "flex justify-center items-center text-muted-foreground",
              isOpen === false ? "hidden" : ""
            )}
          >
            <span className="text-sm mr-1">RUC {company.ruc}</span>
            <CopyButtom copytext={company.ruc} />
          </div>
        </div>
      ) : (
        <div className="h-[160px] flex flex-col gap-2 justify-center items-center">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[200px]" />
            <Skeleton className="h-4 w-[150px]" />
          </div>
        </div>
      )}
    </>
  );
}
