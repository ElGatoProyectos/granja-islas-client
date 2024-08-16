"use client";

import { FiscalConsumptionLinechart } from "@/components/analytics/specific/fiscal-consumption-linechart";
import { FiscalConsumptionMeasureLinechart } from "@/components/analytics/specific/fiscalconsumption-measure-linechart";
import { LastShoppingLinechart } from "@/components/analytics/specific/last-shopping-linechart";
import { RadioDates } from "@/components/radio-dates";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { dates_radio } from "@/constants/dates";
import { useState } from "react";

const labels = [
  {
    label: "Maiz",
    value: "corn",
  },
  {
    label: "Soya",
    value: "soya",
  },
  {
    label: "Gallinas",
    value: "chickens",
  },
  {
    label: "Diesel",
    value: "diesel",
  },
];

export default function Page() {
  const [value, setValue] = useState("");
  return (
    <section>
      <header className="flex justify-between mb-4">
        <div className="flex justify-center items-center gap-2 ml-8">
          <h2 className="text-sm">Principales Etiquetas</h2>
          <Select>
            <SelectTrigger className="w-[230px]">
              <SelectValue placeholder="Selecciona una etiqueta" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Etiquetas</SelectLabel>
                {labels.map(({ label, value }) => (
                  <SelectItem key={label} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <RadioDates setRadio={setValue} radio={value} dates={dates_radio} />
      </header>
      <main className="grid grid-cols-1 gap-4">
        <FiscalConsumptionLinechart
          label={"Maiz"}
          date={"25 de Enero,2024 - 25 de Julio,2024"}
        />
        <FiscalConsumptionMeasureLinechart
          label={"Maiz (medida)"}
          date={"25 de Enero,2024 - 25 de Julio,2024"}
        />
        <LastShoppingLinechart
          label={"Maiz"}
          date={"25 de Enero,2024 - 25 de Julio,2024"}
        />
      </main>
    </section>
  );
}
