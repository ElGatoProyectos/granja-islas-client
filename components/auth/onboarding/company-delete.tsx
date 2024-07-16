"use client";

import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export function CompanyDelete({ ruc, name }: { ruc: string; name: string }) {
  const [value, setValue] = useState<string>();

  return (
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
        <h3 className="text-foreground text-sm">{name}</h3>
        <p className="text-foreground text-sm">{ruc}</p>
      </div>

      <p className="text-sm text-muted-foreground">
        Para confirmar, escribe &quot;{ruc}&quot; en el cuadro a continuacion.
      </p>

      <Input
        type="text"
        onChange={(e) => setValue(e.currentTarget.value)}
        value={value}
      />

      <Button variant="destructive" disabled={value !== ruc}>
        Borrar esta empresa
      </Button>
    </DialogContent>
  );
}
