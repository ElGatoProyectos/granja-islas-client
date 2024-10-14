"use client";

import * as React from "react";

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
import { TypeReceipt } from "@/types/receipt";
import { type Row } from "@tanstack/react-table";
import { Download, Loader2 } from "lucide-react";

interface DeleteTasksDialogProps
  extends React.ComponentPropsWithoutRef<typeof Dialog> {
  tasks: Row<TypeReceipt>["original"][];
  showTrigger?: boolean;
  onSuccess?: () => void;
}

export function DownloadPdfsDialog({
  tasks,
  showTrigger = true,
  onSuccess,
  ...props
}: DeleteTasksDialogProps) {
  const [isDeletePending, startDeleteTransition] = React.useTransition();

  function onDownload() {
    startDeleteTransition(async () => {
      //   const { error } = await deleteTasks({
      //     ids: tasks.map((task) => task.id),
      //   });
      //   if (error) {
      //     toast.error(error);
      //     return;
      //   }
      //   props.onOpenChange?.(false);
      //   toast.success("Tasks deleted");
      //   onSuccess?.();
    });
  }

  return (
    <Dialog {...props}>
      {showTrigger ? (
        <DialogTrigger asChild>
          <Button variant="outline">
            <Download className="size-4 mr-2" aria-hidden="true" />
            Pdf ({tasks.length})
          </Button>
        </DialogTrigger>
      ) : null}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your{" "}
            <span className="font-medium">{tasks.length}</span>
            {tasks.length === 1 ? " task" : " tasks"} from our servers.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:space-x-0">
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button
            aria-label="Delete selected rows"
            variant="destructive"
            onClick={onDownload}
            disabled={isDeletePending}
          >
            {isDeletePending && <Loader2 className="h-5 w-5 animate-spin" />}
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
