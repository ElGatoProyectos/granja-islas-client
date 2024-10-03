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
import { formatTextDate } from "@/utils/format-text-date";
import Link from "next/link";

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
