"use client";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { months } from "@/constants/dates";
import { useQueryParams } from "@/hooks/useQueryParams";
import { FormatedTotalAmountReceipts } from "@/types/dashboard";
import { homeViewTable, transformData } from "@/utils/change-name";
import { exportToExcel } from "@/utils/export-excel";
import { getYearsArray } from "@/utils/getYearArray";
import { Download } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Button } from "../ui/button";

export function PeriodsDashboard({
  yearStarted,
  monthStarted,
  formatedReceipts,
}: {
  yearStarted: number;
  monthStarted: number;
  formatedReceipts: FormatedTotalAmountReceipts[];
}) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const { createQueryString } = useQueryParams();
  const yearsCompany = getYearsArray({ startYear: yearStarted });
  const [loading, setLoading] = useState(false);

  const year = searchParams.get("year") ?? "";
  const month = searchParams.get("month") ?? "";

  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;

  const initialYear = year || currentYear.toString();
  const initialMonth = month || currentMonth.toString();

  const filteredMonths = months.filter(({ value }) => {
    if (!initialYear) return true; // Si no se ha seleccionado un año, muestra todos los meses

    const selectedYear = parseInt(initialYear);

    // Si es el año de inicio, mostramos solo los meses a partir del mes de inicio
    if (selectedYear === yearStarted) {
      return parseInt(value) >= monthStarted;
    }

    // Si es el año actual, mostramos solo los meses hasta el mes actual
    if (selectedYear === currentYear) {
      return parseInt(value) <= currentMonth;
    }

    // Para años entre el año de inicio y el año actual, mostramos todos los meses
    return true;
  });

  const handleYearChange = (value: string) => {
    replace(pathname + "?" + createQueryString({ year: value }));
  };

  const handleMonthChange = (value: string) => {
    replace(pathname + "?" + createQueryString({ month: value }));
  };

  return (
    <div className="flex justify-between items-center mb-2">
      <div className="flex items-center gap-2">
        <p className="text-sm">Periodo</p>
        <Select value={initialYear} onValueChange={handleYearChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Año" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {yearsCompany.map((year) => (
                <SelectItem
                  key={year}
                  value={year.toString()}
                  onClick={(e) => e.stopPropagation()}
                >
                  {year}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <Select value={initialMonth} onValueChange={handleMonthChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Mes" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {filteredMonths.map(({ label, value }) => (
                <SelectItem
                  key={value}
                  value={value}
                  onClick={(e) => e.stopPropagation()}
                >
                  {label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <Button
        variant="outline"
        type="button"
        disabled={loading}
        onClick={() => {
          exportToExcel({
            data: transformData(formatedReceipts, homeViewTable),
            filename: "Registro de compras",
          });
        }}
      >
        <Download className="h-4 w-4 mr-2" />
        Excel
      </Button>
    </div>
  );
}
