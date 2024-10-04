"use client";

import { useCallback, useState } from "react";
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
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import { TypeLabel } from "@/types/label";
import Link from "next/link";
import { capitalizeFirstLetter } from "@/utils/capitalize-first-letter";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export function ComandLabel({ labels }: { labels: TypeLabel[] }) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { push } = useRouter();

  const createQueryString = useCallback(
    (params: Record<string, string | number | null>) => {
      const newSearchParams = new URLSearchParams(searchParams?.toString());

      for (const [key, value] of Object.entries(params)) {
        if (
          value === null ||
          (typeof value === "string" && value.trim() === "")
        ) {
          newSearchParams.delete(key);
        } else {
          newSearchParams.set(key, String(value));
        }
      }

      return newSearchParams.toString();
    },
    [searchParams]
  );

  return labels.length ? (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[250px] justify-between"
        >
          {value
            ? labels.find((label) => label.id.toString() === value)?.title
            : "Escoje una etiqueta"}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[250px] p-0">
        <Command>
          <CommandInput placeholder="Buscar etiqueta..." />
          <CommandList>
            <CommandEmpty>No encontramos la etiqueta.</CommandEmpty>
            <CommandGroup>
              {labels.map(({ id, title }) => (
                <CommandItem
                  key={id}
                  value={title}
                  onSelect={() => {
                    setValue(id.toString());
                    push(pathname + "?" + createQueryString({ labelId: id }));
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === id.toString() ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {capitalizeFirstLetter(title)}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  ) : (
    <Link
      href="/dashboard/settings"
      className={buttonVariants({ variant: "link" })}
    >
      Crea una etiqueta para comenzar
    </Link>
  );
}
