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
import { useAllSuppliers } from "@/hooks/useAllSuppliers";

export function SupplierField({ form }: { form: any }) {
  const [open, setOpen] = useState(false);
  const { totalSuppliers } = useAllSuppliers();
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
                  className={"w-full justify-between overflow-hidden"}
                >
                  {field.value
                    ? `${
                        formatSuppliers.find(
                          ({ business_name }) =>
                            business_name.toLowerCase().trim() ===
                            field.value.toLowerCase().trim()
                        )?.business_name
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
                        onSelect={(currentValue) => {
                          form.setValue("supplier_id", currentValue);
                          setOpen(false);
                        }}
                        className="capitalize"
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            business_name.toLowerCase().trim() ===
                              field.value.toLowerCase().trim()
                              ? "opacity-100"
                              : "opacity-0"
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
