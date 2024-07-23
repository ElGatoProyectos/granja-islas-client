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

export function CompanyCard({ isOpen }: { isOpen: boolean | undefined }) {
  return (
    <Card
      className={cn("border-0 mt-6 h-[160px]", isOpen === false ? "flex" : "")}
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
                src="/assets/photo-bussines.png"
                alt="photo-bussines"
                className={cn(
                  "rounded-full h-14 w-14 aspect-square",
                  isOpen === false ? "h-[53px]" : ""
                )}
              />
              <span className={cn(isOpen === false ? "hidden" : "block")}>
                Empresa de Transporte Don Agusto S.A.C
              </span>
            </Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle className="text-3xl font-bold">Empresa</DialogTitle>
              <DialogDescription>
                Esta información es esencial para la identificación y el
                análisis detallado de la entidad empresarial.
              </DialogDescription>
            </DialogHeader>

            <div className="w-full flex flex-col space-y-4">
              <img
                src="/assets/photo-bussines.png"
                alt="photo-bussines"
                className="rounded-full "
                height={100}
                width={100}
              />
              <div className="flex flex-col text-sm">
                <span className="font-semibold">RUC</span>
                <p className="text-muted-foreground">20535014940</p>
              </div>
              <div className="flex flex-col text-sm">
                <span className="font-semibold">Razón social</span>
                <p className="text-muted-foreground">
                  Empresa de Transporte Don Agusto S.A.C.
                </p>
              </div>
              <div className="flex flex-col text-sm">
                <span className="font-semibold">Tipo</span>
                <p className="text-muted-foreground">
                  Sociedad Anonima Cerrada
                </p>
              </div>
              <div className="flex flex-col text-sm">
                <span className="font-semibold">Estado</span>
                <p className="text-muted-foreground">Habido</p>
              </div>
              <div className="flex flex-col text-sm">
                <span className="font-semibold">Dirección Fiscal</span>
                <p className="text-muted-foreground">Manual</p>
              </div>
              <div className="flex flex-col text-sm">
                <span className="font-semibold">Celular</span>
                <p className="text-muted-foreground">+51 998-846-156</p>
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
          <span className="text-sm">RUC 20535014940</span>
          <CopyButtom copytext="20535014940" />
        </div>
      </CardHeader>
    </Card>
  );
}
