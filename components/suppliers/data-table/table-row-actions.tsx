"use client";

import { Row } from "@tanstack/react-table";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Ellipsis } from "lucide-react";
import { supplierSchemaIN } from "@/lib/validations/supplier";
import { SupplierForm } from "../supplier-form";
import { useSupplier } from "@/context/sections/suppliers-context";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const supplier = supplierSchemaIN.parse(row.original);
  const { getSuppliers } = useSupplier();
  const pathname = usePathname();

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
        <DropdownMenuItem
          onClick={() => navigator.clipboard.writeText(supplier.ruc)}
        >
          Copiar RUC
        </DropdownMenuItem>

        <SupplierForm
          type="edit"
          getSuppliers={getSuppliers}
          supplier={supplier}
        />
        <DropdownMenuSeparator />

        <DropdownMenuItem>
          <Link href={`${pathname}/${supplier.id}`}>Ver Proveedor</Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
