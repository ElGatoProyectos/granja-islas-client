import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";

import { Plus } from "lucide-react";
import { SupplierForm } from "./supplier-form";

export function AddSupplier() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Plus className="h-4 w-4 mr-2" />
          Agregar Proveedor
        </Button>
      </DialogTrigger>
      <SupplierForm type="create" />
    </Dialog>
  );
}
