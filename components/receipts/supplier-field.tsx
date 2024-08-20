"use client";

import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
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
import { countryCodes } from "@/constants/country-code";
import { useAllSuppliers } from "@/hooks/useAllSuppliers";

export function SupplierField({ form }: { form: any }) {
  const [open, setOpen] = useState(false);
  const { totalSuppliers } = useAllSuppliers();

  const formatSuppliers = totalSuppliers.map((supplier) => ({
    ...supplier,
    id: supplier.id.toString(),
  }));

  return (
    <FormField
      control={form.control}
      name="supplier_id"
      render={({ field }) => (
        <FormItem>
          <Popover open={open} onOpenChange={setOpen} modal={true}>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className={"justify-between"}
                >
                  {field.value
                    ? `${
                        countryCodes.find(({ code }) => code === field.value)
                          ?.code
                      } ${
                        countryCodes.find(({ code }) => code === field.value)
                          ?.country
                      }`
                    : "País"}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-[140px] p-0">
              <Command>
                <CommandInput placeholder="Codigo..." />
                <CommandEmpty>Codigo no encontrado</CommandEmpty>
                <CommandList>
                  <CommandGroup>
                    {countryCodes.map(({ code, country }) => (
                      <CommandItem
                        key={code}
                        value={code}
                        onSelect={(currentValue) => {
                          form.setValue("country_code", currentValue);
                          setOpen(false);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            code === field.value ? "opacity-100" : "opacity-0"
                          )}
                        />
                        {code + " " + country}
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
