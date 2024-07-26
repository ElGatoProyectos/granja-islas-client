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
import { useCompanySession } from "@/context/user-context";
import { Skeleton } from "../ui/skeleton";
import { backend_url } from "@/constants/config";

export function CompanyCard({ isOpen }: { isOpen: boolean | undefined }) {
  const { company } = useCompanySession();
  return (
    <>
      {company ? (
        <Card
          className={cn(
            "border-0 mt-6 h-[160px]",
            isOpen === false ? "flex" : ""
          )}
        >
          <CardHeader
            className={cn(
              "p-0 space-y-0",
              isOpen === false ? "justify-end items-end" : ""
            )}
          >
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="link"
                  className={cn(
                    "text-wrap p-0 hover:no-underline text-left flex-col h-fit gap-y-2",
                    isOpen === false ? "justify-end items-end" : ""
                  )}
                >
                  <img
                    src={`${backend_url}/api/companies/file/${company.id}`}
                    alt="photo-bussines"
                    className={cn(
                      "rounded-full h-14 w-14 aspect-square",
                      isOpen === false ? "h-[53px]" : ""
                    )}
                  />
                  <span className={cn(isOpen === false ? "hidden" : "block")}>
                    {company.corporate_name}
                  </span>
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
                  <img
                    src={`${backend_url}/api/companies/file/${company.id}`}
                    alt="photo-bussines"
                    className="rounded-full "
                    height={100}
                    width={100}
                  />
                  <div className="flex flex-col text-sm">
                    <span className="font-semibold">RUC</span>
                    <p className="text-muted-foreground">{company.ruc}</p>
                  </div>
                  <div className="flex flex-col text-sm">
                    <span className="font-semibold">Razón social</span>
                    <p className="text-muted-foreground">
                      {company.corporate_name}
                    </p>
                  </div>
                  <div className="flex flex-col text-sm">
                    <span className="font-semibold">Tipo</span>
                    <p className="text-muted-foreground">{company.type}</p>
                  </div>
                  <div className="flex flex-col text-sm">
                    <span className="font-semibold">Estado</span>
                    <p className="text-muted-foreground">{company.status}</p>
                  </div>
                  <div className="flex flex-col text-sm">
                    <span className="font-semibold">Dirección Fiscal</span>
                    <p className="text-muted-foreground">
                      {company.fiscal_address}
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
                "flex justify-between items-center",
                isOpen === false ? "hidden" : ""
              )}
            >
              <span className="text-sm">RUC {company.ruc}</span>
              <CopyButtom copytext={company.ruc} />
            </div>
          </CardHeader>
        </Card>
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
