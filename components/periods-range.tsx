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
import { useQueryParams } from "@/hooks/useQueryParams";
import { getYearsArray } from "@/utils/getYearArray";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export function PeriodsRange({
  yearStarted,
  monthStarted,
  currentDate = false,
}: {
  yearStarted: number;
  monthStarted: number;
  currentDate?: boolean;
}) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const { createQueryString } = useQueryParams();

  const yearsCompany = getYearsArray({ startYear: yearStarted });
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;
  const startCurrentYear = currentDate ? currentYear.toString() : "";
  const startCurrentMonth = currentDate ? currentMonth.toString() : "";

  const startYear = searchParams.get("startYear") ?? startCurrentYear;
  const startMonth = searchParams.get("startMonth") ?? startCurrentMonth;
  const endYear = searchParams.get("endYear") ?? startCurrentYear;
  const endMonth = searchParams.get("endMonth") ?? startCurrentMonth;

  const filteredStartMonths = months.filter(({ value }) => {
    if (!startYear) return true;
    const selectedYear = parseInt(startYear);

    if (selectedYear === yearStarted) {
      return parseInt(value) >= monthStarted;
    }
    if (selectedYear === currentYear) {
      return parseInt(value) <= currentMonth;
    }
    return true;
  });

  const filteredEndMonths = months.filter(({ value }) => {
    if (!endYear) return true;
    const selectedYear = parseInt(endYear);

    if (selectedYear === yearStarted) {
      return parseInt(value) >= monthStarted;
    }
    if (selectedYear === currentYear) {
      return parseInt(value) <= currentMonth;
    }
    return true;
  });

  return (
    <div className="flex gap-4 items-center">
      <div className="flex justify-center items-center gap-2">
        <p className="text-sm">Inicio</p>
        <Select
          value={startYear}
          onValueChange={(value: string) => {
            replace(pathname + "?" + createQueryString({ startYear: value }));
          }}
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
            replace(pathname + "?" + createQueryString({ startMonth: value }));
          }}
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
            replace(pathname + "?" + createQueryString({ endYear: value }));
          }}
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
            replace(pathname + "?" + createQueryString({ endMonth: value }));
          }}
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
