"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { deleteCompany } from "@/lib/actions/company.actions";
import { Trash } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export function CompanyDelete({
  ruc,
  corporate_name,
  companyId,
}: {
  ruc: string;
  corporate_name: string;
  companyId: number;
}) {
  const [value, setValue] = useState<string>("");
  const [submitting, setSubmitting] = useState<boolean>(false);

  const route = useRouter();
  const { data: session }: { data: any } = useSession();
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.currentTarget.value);
  };

  const handledelete = async () => {
    setSubmitting(true);

    try {
      await deleteCompany({
        companyId,
        password: value,
        tokenBack: session.user.tokenBack,
      });

      toast.success(`Se eliminó correctamente la empresa`);
      route.refresh();
      setOpen(false);
    } catch (e) {
      toast.error(`Ocurrio un error al eliminar la empresa, intenta otra vez.`);
    } finally {
      setSubmitting(false);
    }
  };

  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Trash className="stroke-red-500" />
          <span className="sr-only">Borrar empresa</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader className="text-center">
          <DialogTitle className="text-xl font-bold">
            Confirmación de eliminación de empresa
          </DialogTitle>
          <DialogDescription>
            Esta acción es irreversible y eliminará permanentemente todos los
            datos asociados con la empresa.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col justify-center items-center font-semibold">
          <h3 className="text-foreground text-sm">{corporate_name}</h3>
          <p className="text-foreground text-sm">{ruc}</p>
        </div>
        <div className="flex flex-col gap-y-1">
          <p className="text-sm font-medium text-foreground">
            Para confirmar, escribe la contraseña de administrador en el cuadro
            a continuacion.
          </p>

          <Input type="text" value={value} onChange={handleChange} />
        </div>

        <Button
          variant="destructive"
          disabled={submitting}
          onClick={handledelete}
          type="button"
        >
          {submitting ? "Borrando empresa" : "Borrar la empresa"}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
