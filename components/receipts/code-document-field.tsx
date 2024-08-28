"use client";

import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState } from "react";

import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { creditNoteSchemaCreate } from "@/lib/validations/receipt-forms/bill";
import { ReceiptSchemaIN } from "@/lib/validations/receipt";

export function CodeDocumentField({
  form,
  receipts,
}: {
  form: UseFormReturn<z.infer<typeof creditNoteSchemaCreate>>;
  receipts: ReceiptSchemaIN[];
}) {
  const [open, setOpen] = useState(false);

  const formatReceipts = receipts.map((receipt) => ({
    ...receipt,
    code: receipt.code.toLowerCase(),
    id: receipt.id.toString(),
  }));

  return (
    <FormField
      control={form.control}
      name="document_id"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Factura de referencia</FormLabel>
          <Popover open={open} onOpenChange={setOpen} modal={true}>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className={
                    "w-full justify-between overflow-hidden capitalize"
                  }
                >
                  {field.value
                    ? `${
                        formatReceipts.find(({ id }) => id === field.value)
                          ?.code
                      }`
                    : "Nro. de factura"}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-[280px] p-0">
              <Command>
                <CommandInput placeholder="Nombre..." />
                <CommandEmpty>Codigo no encontrado</CommandEmpty>
                <CommandList>
                  <CommandGroup>
                    {formatReceipts.map(({ id, code }) => (
                      <CommandItem
                        key={id}
                        value={code}
                        onSelect={() => {
                          form.setValue("supplier_id", id);
                          setOpen(false);
                        }}
                        className="capitalize"
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            id === field.value ? "opacity-100" : "opacity-0"
                          )}
                        />
                        {code}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
