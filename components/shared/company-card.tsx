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

export function CompanyCard() {
  return (
    <Card className="border-0 shadow-none mt-6">
      <CardHeader className="p-0 space-y-0">
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="link"
              className="text-wrap p-0 hover:no-underline text-left flex-col h-fit gap-y-2"
            >
              <img
                src="/assets/photo-bussines.png"
                alt="photo-bussines"
                className="rounded-full h-14 w-14"
              />
              Empresa de Transporte Don Agusto S.A.C
            </Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-[500px] ">
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
        <div className="flex justify-between items-center">
          <span className="text-sm">RUC 20535014940</span>
          <CopyButtom copytext="20535014940" />
        </div>
      </CardHeader>
    </Card>
  );
}
