"use client";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { months } from "@/constants/dates";
import { START_MONTH_SYNC, START_YEAR_SYNC } from "@/constants/start-sync";
import { useQueryParams } from "@/hooks/useQueryParams";
import { filterMonthsByYear } from "@/utils/filter-months-by-year";
import { getYearsArray } from "@/utils/getYearArray";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";

export function PeriodsRange({
  yearStarted,
  monthStarted,
  currentDate = false,
  yearDiference = false,
}: {
  yearStarted: number;
  monthStarted: number;
  currentDate?: boolean;
  yearDiference?: boolean;
}) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const { createQueryString } = useQueryParams();
  const [isPending, startTransition] = useTransition();

  const yearsCompany = getYearsArray({ startYear: START_YEAR_SYNC });
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;
  const startCurrentYear = currentDate ? currentYear.toString() : "";
  const startCurrentMonth = currentDate ? currentMonth.toString() : "";
  const yearDif = yearDiference ? currentYear - 1 : currentYear;

  const startYear =
    searchParams.get("startYear") ??
    (yearDiference ? yearDif.toString() : startCurrentYear);
  const startMonth = searchParams.get("startMonth") ?? startCurrentMonth;
  const endYear = searchParams.get("endYear") ?? startCurrentYear;
  const endMonth = searchParams.get("endMonth") ?? startCurrentMonth;

  const filteredStartMonths = filterMonthsByYear({
    selectedYear: startYear,
    yearStarted: START_YEAR_SYNC,
    monthStarted: START_MONTH_SYNC,
  });

  const filteredEndMonths = filterMonthsByYear({
    selectedYear: endYear,
    yearStarted: START_YEAR_SYNC,
    monthStarted: START_MONTH_SYNC,
  });

  return (
    <div className="flex gap-4 items-center">
      <div className="flex justify-center items-center gap-2">
        <p className="text-sm">Inicio</p>
        <Select
          value={startYear}
          onValueChange={(value: string) => {
            startTransition(() => {
              replace(pathname + "?" + createQueryString({ startYear: value }));
            });
          }}
          disabled={isPending}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Año" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {yearsCompany.map((year) => (
                <SelectItem
                  key={year}
                  value={year}
                  onClick={(e) => e.stopPropagation()}
                >
                  {year}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <Select
          value={startMonth}
          onValueChange={(value: string) => {
            startTransition(() => {
              replace(
                pathname + "?" + createQueryString({ startMonth: value })
              );
            });
          }}
          disabled={isPending}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Mes" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {filteredStartMonths.map(({ label, value }) => (
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
      <Separator orientation="vertical" className="h-8" />
      <div className="flex justify-center items-center gap-2">
        <p className="text-sm">Fin</p>
        <Select
          value={endYear}
          onValueChange={(value: string) => {
            startTransition(() => {
              replace(pathname + "?" + createQueryString({ endYear: value }));
            });
          }}
          disabled={isPending}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Año" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {yearsCompany.map((year) => (
                <SelectItem
                  key={year}
                  value={year}
                  onClick={(e) => e.stopPropagation()}
                >
                  {year}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <Select
          value={endMonth}
          onValueChange={(value: string) => {
            startTransition(() => {
              replace(pathname + "?" + createQueryString({ endMonth: value }));
            });
          }}
          disabled={isPending}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Mes" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {filteredEndMonths.map(({ label, value }) => (
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
    </div>
  );
}
