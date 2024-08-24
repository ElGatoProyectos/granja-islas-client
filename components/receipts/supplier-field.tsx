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
import { SupplierSchemaFilter } from "@/lib/validations/supplier";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { billSchemaCreate } from "@/lib/validations/receipt-forms/bill";

export function SupplierField({
  form,
  totalSuppliers,
}: {
  form: UseFormReturn<z.infer<typeof billSchemaCreate>>;
  totalSuppliers: SupplierSchemaFilter[];
}) {
  const [open, setOpen] = useState(false);

  const formatSuppliers = totalSuppliers.map((supplier) => ({
    ...supplier,
    business_name: supplier.business_name.toLowerCase(),
    id: supplier.id.toString(),
  }));

  return (
    <FormField
      control={form.control}
      name="supplier_id"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Proveedor</FormLabel>
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
                        formatSuppliers.find(({ id }) => id === field.value)
                          ?.business_name
                      }`
                    : "Seleccionar proveedor"}
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
                    {formatSuppliers.map(({ id, business_name }) => (
                      <CommandItem
                        key={id}
                        value={business_name}
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
                        {business_name}
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
