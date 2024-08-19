"use client";

import { FiscalConsumptionLinechart } from "@/components/analytics/specific/fiscal-consumption-linechart";
import { FiscalConsumptionMeasureLinechart } from "@/components/analytics/specific/fiscalconsumption-measure-linechart";
import { LastShoppingLinechart } from "@/components/analytics/specific/last-shopping-linechart";
import { RadioDates } from "@/components/radio-dates";
import { buttonVariants } from "@/components/ui/button";
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
import Link from "next/link";
import { useState } from "react";

const dates_radio = [
  {
    id: crypto.randomUUID(),
    value: "1",
    label: "1M",
  },
  {
    id: crypto.randomUUID(),
    value: "6",
    label: "6M",
  },
  {
    id: crypto.randomUUID(),
    value: "12",
    label: "1A",
  },
];

export default function Page() {
  const { labels } = useLabels();
  const { filterMonth, setFilterMonth, labelId, setLabelId } =
    useAnalyticsSpecific();
  const [labelSelected] = labels.filter(
    (selected) => selected.id.toString() === labelId
  );

  console.log(labelSelected);
  return (
    <section>
      <header className="flex justify-between mb-4">
        <div className="flex justify-center items-center gap-2">
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
          date={"25 de Enero,2024 - 25 de Julio,2024"}
        />
        <FiscalConsumptionMeasureLinechart
          label={labelSelected?.title}
          date={"25 de Enero,2024 - 25 de Julio,2024"}
        />
        <LastShoppingLinechart
          label={labelSelected?.title}
          date={"25 de Enero,2024 - 25 de Julio,2024"}
        />
      </main>
    </section>
  );
}
