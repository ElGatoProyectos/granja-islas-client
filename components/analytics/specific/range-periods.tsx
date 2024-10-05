"use client";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { months } from "@/constants/dates";
import { getYearsArray } from "@/utils/getYearArray";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

export function RangePeriods({
  yearStarted,
  monthStarted,
}: {
  yearStarted: number;
  monthStarted?: number;
}) {
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

  const startYear = searchParams.get("startYear") ?? "";
  const startMonth = searchParams.get("startMonth") ?? "";
  const endYear = searchParams.get("endYear") ?? "";
  const endMonth = searchParams.get("endMonth") ?? "";

  const yearsCompany = getYearsArray({ startYear: yearStarted });

  return (
    <div className="flex gap-4">
      <div className="flex justify-center items-center gap-2">
        <p className="text-sm">Inicio</p>
        <Select
          value={startYear}
          onValueChange={(value: string) => {
            push(pathname + "?" + createQueryString({ startYear: value }));
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
            push(pathname + "?" + createQueryString({ startMonth: value }));
          }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Mes" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {months.map(({ label, value }) => (
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
      <Separator orientation="vertical" />
      <div className="flex justify-center items-center gap-2">
        <p className="text-sm">Fin</p>
        <Select
          value={endYear}
          onValueChange={(value: string) => {
            push(pathname + "?" + createQueryString({ endYear: value }));
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
            push(pathname + "?" + createQueryString({ endMonth: value }));
          }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Mes" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {months.map(({ label, value }) => (
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
