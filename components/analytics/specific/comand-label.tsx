"use client";

import { Button, buttonVariants } from "@/components/ui/button";
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
import { useQueryParams } from "@/hooks/useQueryParams";
import { cn } from "@/lib/utils";
import { TypeLabel } from "@/types/label";
import { capitalizeFirstLetter } from "@/utils/capitalize-first-letter";
import { Check, ChevronsUpDown } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";

export function ComandLabel({ labels }: { labels: TypeLabel[] }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const [isPending, startTransition] = useTransition();
  const { createQueryString } = useQueryParams();

  const [open, setOpen] = useState(false);
  const labelId = searchParams.get("labelId") ?? "";

  return labels.length ? (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[250px] justify-between truncate"
          disabled={isPending}
        >
          {labelId
            ? labels.find((label) => label.id.toString() === labelId)?.title
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
                    startTransition(() => {
                      replace(
                        pathname + "?" + createQueryString({ labelId: id }),
                        { scroll: false }
                      );
                    });
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      labelId === id.toString() ? "opacity-100" : "opacity-0"
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
