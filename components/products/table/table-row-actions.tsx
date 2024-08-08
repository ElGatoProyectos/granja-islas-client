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
import { usePathname } from "next/navigation";
import Link from "next/link";
import { productSchemaIN } from "@/lib/validations/product";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const receipt = productSchemaIN.parse(row.original);
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
          onClick={() => navigator.clipboard.writeText(receipt.id.toString())}
        >
          Copiar id
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {/* <Link href={`${pathname}/${receipt.id}-${receipt.document_code}`}>
          <DropdownMenuItem>Ver detalles</DropdownMenuItem>
        </Link> */}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
