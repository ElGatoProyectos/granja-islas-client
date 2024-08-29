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
import { userSchemaIN } from "@/lib/validations/user";
import { EditUserFromAdmin } from "../edit-user-from-admin";
import { useState, useTransition } from "react";
import { DeleteTasksDialog } from "./user-delete-dialog";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const user = userSchemaIN.parse(row.original);

  const [isUpdatePending, startUpdateTransition] = useTransition();
  const [showDeleteUserDialog, setShowDeleteUserDialog] = useState(false);

  return (
    <>
      <DeleteTasksDialog
        open={showDeleteUserDialog}
        onOpenChange={setShowDeleteUserDialog}
        user={user}
        showTrigger={false}
      />
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
            onClick={() => navigator.clipboard.writeText(user.email)}
          >
            Copiar email
          </DropdownMenuItem>
          <EditUserFromAdmin type="edit" userInfo={user} />
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={() => setShowDeleteUserDialog(true)}>
            <span className="text-destructive">Borrar</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
