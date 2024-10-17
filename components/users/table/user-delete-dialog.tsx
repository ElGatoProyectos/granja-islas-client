"use client";

import { type Row } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { useTransition } from "react";
import { Loader2, TrashIcon } from "lucide-react";
import { deleteUser } from "@/lib/actions/users.actions";
import { useUserInfo } from "@/context/user-context";
import { UserSchemaIN } from "@/lib/validations/user";
import { toast } from "sonner";

interface DeleteTasksDialogProps
  extends React.ComponentPropsWithoutRef<typeof Dialog> {
  user: UserSchemaIN;
  showTrigger?: boolean;
  onSuccess?: () => void;
}

export function DeleteTasksDialog({
  user,
  showTrigger = true,
  onSuccess,
  ...props
}: DeleteTasksDialogProps) {
  const [isDeletePending, startDeleteTransition] = useTransition();
  const { tokenBack } = useUserInfo();

  function onDelete() {
    startDeleteTransition(async () => {
      try {
        await deleteUser({ tokenBack, userId: user.id });

        toast.success(`Se eliminó correctamente el usuario`);
      } catch (e: any) {
        toast.error("Ocurrio un error al eliminar usuario");
      } finally {
        props.onOpenChange?.(false);
      }
    });
  }

  return (
    <Dialog {...props}>
      {showTrigger ? (
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            <TrashIcon className="mr-2 size-4" aria-hidden="true" />
            Borrar
          </Button>
        </DialogTrigger>
      ) : null}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>¿Estás absolutamente seguro?</DialogTitle>
          <DialogDescription>
            Esta acción no se puede deshacer. Esto eliminará permanentemente al
            usuario de nuestros servidores.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:space-x-0">
          <DialogClose asChild>
            <Button variant="outline">Cancelar</Button>
          </DialogClose>
          <Button
            aria-label="Delete selected rows"
            variant="destructive"
            onClick={onDelete}
            disabled={isDeletePending}
          >
            {isDeletePending && (
              <Loader2 className="animate-spin size-4 mr-2" />
            )}
            Borrar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
