"use client";

import { Row } from "@tanstack/react-table";

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
import { Button } from "@/components/ui/button";
import { Ellipsis } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";

import { paymentGeneralSchemaIN } from "@/lib/validations/payment";
import { status_payment } from "@/constants/status-payment";
import { translateStatus } from "@/utils/translate-states-payment";
import { useState } from "react";
import { usePayment } from "@/context/sections/payments-context";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const payment = paymentGeneralSchemaIN.parse(row.original);
  const pathname = usePathname();
  const [currentState, setCurrentState] = useState<string>(payment.status);
  const { updateState } = usePayment();
  const handleStatus = async (value: string) => {
    setCurrentState(value);
    await updateState({ idVoucher: payment.id.toString(), statusNew: value });
  };

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
        <Link href={`${pathname}/${payment.id}`}>
          <DropdownMenuItem>Ver detalles</DropdownMenuItem>
        </Link>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
