import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ProductDetailSchemaIN } from "@/lib/validations/product";
import { X } from "lucide-react";
import { Dispatch, SetStateAction, useState } from "react";

function DialogRemove({
  open,
  setOpen,
  title,
  submitting,
  handledelete,
  id,
}: {
  id: string;
  submitting: boolean;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  title: string;
  handledelete: ({ label_id }: { label_id: string }) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="icon" variant="ghost" className="h-fit w-fit ml-2">
          <X className="w-4 h-4" />
          <span className="sr-only">Borrar label</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Remover etiqueta</DialogTitle>
          <DialogDescription>
            ¿Esta seguro de remover la etiqueta{" "}
            <span className="font-bold">{title}</span>?
          </DialogDescription>
        </DialogHeader>

        <Button
          variant="destructive"
          disabled={submitting}
          onClick={() => {
            handledelete({ label_id: id });
          }}
          type="button"
        >
          {submitting ? "Removiendo etiqueta" : "Remover etiqueta"}
        </Button>
      </DialogContent>
    </Dialog>
  );
}

export function ProductLabels({
  productDetails,
  removeLabelOfProduct,
}: {
  productDetails: ProductDetailSchemaIN;
  removeLabelOfProduct: ({ label_id }: { label_id: string }) => Promise<void>;
}) {
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [openDialogId, setOpenDialogId] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  const handledelete = async ({ label_id }: { label_id: string }) => {
    setSubmitting(true);
    try {
      await removeLabelOfProduct({ label_id });
      setOpen(false);
    } catch (error) {
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <div className="mb-4 flex gap-2">
      {productDetails.labels.map(({ id, title }) => (
        <Badge key={id} className="text-sm" variant="secondary">
          {title}
          <DialogRemove
            id={id.toString()}
            handledelete={handledelete}
            open={openDialogId === id.toString()}
            setOpen={(isOpen) => setOpenDialogId(isOpen ? id.toString() : null)}
            submitting={submitting}
            title={title}
          />
        </Badge>
      ))}
    </div>
  );
}
