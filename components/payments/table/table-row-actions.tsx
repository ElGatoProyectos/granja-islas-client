"use client";

import { Row } from "@tanstack/react-table";

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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { backend_url } from "@/constants/config";
import { status_payment } from "@/constants/status-payment";
import { useCompanySession } from "@/context/company-context";
import { usePayment } from "@/context/sections/payments-context";
import { useUserInfo } from "@/context/user-context";
import { paymentGeneralSchemaIN } from "@/lib/validations/payment";
import { translateStatus } from "@/utils/translate-states-payment";
import { Ellipsis, Loader2 } from "lucide-react";
import Link from "next/link";
import { MutableRefObject, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const payment = paymentGeneralSchemaIN.parse(row.original);
  const [currentState, setCurrentState] = useState<string>(payment.status);
  const { updateState, loading, deleteVoucher } = usePayment();
  const { company } = useCompanySession();
  const { tokenBack } = useUserInfo();
  const socket: MutableRefObject<Socket | undefined> = useRef();

  const handleStatus = async (value: string) => {
    setCurrentState(value);
    await updateState({ idVoucher: payment.id.toString(), statusNew: value });
    if (!company) return;
    socket.current = io(`${backend_url}`);
    socket.current.emit("create-voucher", {
      ruc: company?.ruc,
      token: `Bearer ${tokenBack}`,
    });
  };

  const id = payment.document.id;
  const document_code = payment.document.document_code;

  const [open, setOpen] = useState(false);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
        >
          <Ellipsis className="h-4 w-4" />
          <span className="sr-only">Abrir menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px]">
        <DropdownMenuLabel>Acciones</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>Estados</DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuRadioGroup
              value={currentState}
              onValueChange={handleStatus}
            >
              {status_payment.map((status) => (
                <DropdownMenuRadioItem
                  key={status}
                  value={status}
                  className={"pl-2"}
                >
                  {translateStatus(status)}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        <Link href={`/receipts/${id}-${document_code}`}>
          <DropdownMenuItem>Ver detalles</DropdownMenuItem>
        </Link>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <DropdownMenuItem
              onSelect={(e) => e.preventDefault()}
              className="!text-destructive !hover:bg-destructive/10"
            >
              Borrar pago
            </DropdownMenuItem>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[430px]">
            <DialogHeader>
              <div className="flex justify-between">
                <DialogTitle className="text-xl font-bold">
                  ¿Estás absolutamente seguro de eliminar el pago{" "}
                  <span className="text-primary">
                    {payment.operation_number}
                  </span>{" "}
                  ?
                </DialogTitle>
              </div>
              <DialogDescription>
                Esta acción no se puede deshacer. Esto eliminará permanentemente
                al invitado y sus regalos de nuestros servidores.
              </DialogDescription>
            </DialogHeader>

            <DialogFooter className="sm:justify-end">
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Close
                </Button>
              </DialogClose>
              <Button
                variant="destructive"
                disabled={loading}
                onClick={() => deleteVoucher(payment.id)}
              >
                {loading && <Loader2 className="h-5 w-5 mr-2 animate-spin" />}
                Borrar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
