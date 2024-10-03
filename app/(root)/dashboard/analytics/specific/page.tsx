"use client";

import { FiscalConsumptionLinechart } from "@/components/analytics/specific/fiscal-consumption-linechart";
import { FiscalConsumptionMeasureLinechart } from "@/components/analytics/specific/fiscalconsumption-measure-linechart";
import { LastShoppingLinechart } from "@/components/analytics/specific/last-shopping-linechart";
import { RadioDates } from "@/components/radio-dates";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAnalyticsSpecific } from "@/hooks/useAnalyticsSpecific";

import { useLabels } from "@/hooks/useLabels";
import { formatTextDate } from "@/utils/format-text-date";
import Link from "next/link";
import { useState } from "react";
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

const dates_radio = [
  {
    id: "1",
    value: "1",
    label: "1M",
  },
  {
    id: "2",
    value: "6",
    label: "6M",
  },
  {
    id: "3",
    value: "12",
    label: "1A",
  },
];

const frameworks = [
  {
    value: "next.js",
    label: "Next.js",
  },
  {
    value: "sveltekit",
    label: "SvelteKit",
  },
  {
    value: "nuxt.js",
    label: "Nuxt.js",
  },
  {
    value: "remix",
    label: "Remix",
  },
  {
    value: "astro",
    label: "Astro",
  },
  {
    value: "gatsby",
    label: "Gatsby",
  },
  {
    value: "angular",
    label: "Angular",
  },
  {
    value: "vue",
    label: "Vue.js",
  },
  {
    value: "react",
    label: "React",
  },
  {
    value: "ember",
    label: "Ember.js",
  },
  {
    value: "solid",
    label: "Solid.js",
  },
  {
    value: "backbone",
    label: "Backbone.js",
  },
  {
    value: "express",
    label: "Express.js",
  },
  {
    value: "koa",
    label: "Koa.js",
  },
  {
    value: "hapi",
    label: "Hapi.js",
  },
  {
    value: "quasar",
    label: "Quasar",
  },
  {
    value: "blitz",
    label: "Blitz.js",
  },
  {
    value: "eleventy",
    label: "Eleventy",
  },
  {
    value: "preact",
    label: "Preact",
  },
  {
    value: "alpine",
    label: "Alpine.js",
  },
];

export default function Page() {
  const { labels } = useLabels();
  const {
    filterMonth,
    setFilterMonth,
    labelId,
    setLabelId,
    measure,
    measureSelect,
    setMeasureSelect,
    specificChart,
    specificChart2,
    specificChart3,
  } = useAnalyticsSpecific({ label: labels[0] });

  const [labelSelected] = labels.filter(
    (selected) => selected.id.toString() === labelId
  );
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  return (
    <section>
      <header className="flex justify-between mb-4">
        <div className="flex justify-center items-center gap-2">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-[250px] justify-between"
              >
                {value
                  ? frameworks.find((framework) => framework.value === value)
                      ?.label
                  : "Select framework..."}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[250px] p-0">
              <Command>
                <CommandInput placeholder="Search framework..." />
                <CommandList>
                  <CommandEmpty>No framework found.</CommandEmpty>
                  <CommandGroup>
                    {frameworks.map((framework) => (
                      <CommandItem
                        key={framework.value}
                        value={framework.value}
                        onSelect={(currentValue) => {
                          setValue(currentValue === value ? "" : currentValue);
                          setOpen(false);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            value === framework.value
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                        {framework.label}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>

          {/*  old */}
          {labels.length ? (
            <Select value={labelId} onValueChange={setLabelId}>
              <SelectTrigger className="w-[230px]">
                <SelectValue placeholder="Selecciona una etiqueta" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Etiquetas</SelectLabel>
                  {labels.map(({ id, title }) => (
                    <SelectItem key={id} value={id.toString()}>
                      {title}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          ) : (
            <Link
              href="/dashboard/settings"
              className={buttonVariants({ variant: "link" })}
            >
              Crea una etiqueta para comenzar
            </Link>
          )}
        </div>
        <RadioDates
          setRadio={setFilterMonth}
          radio={filterMonth}
          dates={dates_radio}
        />
      </header>
      <main className="grid grid-cols-1 gap-4">
        <FiscalConsumptionLinechart
          label={labelSelected?.title}
          specificChart={specificChart}
          date={formatTextDate({
            filterMonth,
          })}
        />
        <FiscalConsumptionMeasureLinechart
          label={labelSelected?.title}
          specificChart={specificChart2}
          measure={measure}
          measureSelect={measureSelect}
          setMeasureSelect={setMeasureSelect}
          date={formatTextDate({
            filterMonth,
          })}
        />
        {/* <LastShoppingLinechart
          specificChart3={specificChart3}
          label={labelSelected?.title}
          date={formatTextDate({
            filterMonth,
          })}
        /> */}
      </main>
    </section>
  );
}
