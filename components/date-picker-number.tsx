"use client";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar, X } from "lucide-react";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Separator } from "./ui/separator";
import { Badge } from "./ui/badge";
import { months } from "@/constants/dates";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useQueryParams } from "@/hooks/useQueryParams";
import { getYearsArray } from "@/utils/getYearArray";
import axios from "axios";
import { getCompanyForRuc } from "@/lib/actions/company.actions";
import { TypeCompany } from "@/types/company";
import { getYearAndMonth } from "@/utils/getYearAndMonth";

interface Props {
  yearStarted: number;
  monthStarted: number;
}

export function DatePickerNumber() {
  const [open, setOpen] = useState(false);
  const searchParams = useSearchParams();
  const company_ruc = searchParams.get("ruc") ?? "";
  const year = searchParams.get("year") ?? "";
  const month = searchParams.get("month") ?? "";
  const [yearStarted, setYearStarted] = useState(year);
  const [monthStarted, setMonthStarted] = useState(month);
  useEffect(() => {
    if (company_ruc) {
      const getData = async () => {
        const company = await getCompanyForRuc({ ruc: company_ruc });
        const { yearStarted, monthStarted } = getYearAndMonth({
          dateString: company.emisor_electronico_desde,
        });
        setYearStarted(yearStarted.toString());
        setMonthStarted(monthStarted.toString());
      };
      getData();
    }
  }, [company_ruc]);

  const pathname = usePathname();
  const { replace } = useRouter();
  const { createQueryString } = useQueryParams();
  const yearsCompany = getYearsArray({ startYear: Number(yearStarted) });

  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;

  const initialYear = year || currentYear.toString();
  const initialMonth = month || currentMonth.toString();

  const monthView = months.find(
    (month) => parseInt(month.value, 10) === Number(initialMonth)
  );

  const filteredMonths = months.filter(({ value }) => {
    if (!initialYear) return true;
    const selectedYear = parseInt(initialYear);
    if (selectedYear === Number(yearStarted)) {
      return parseInt(value) >= Number(monthStarted);
    }
    if (selectedYear === currentYear) {
      return parseInt(value) <= currentMonth;
    }
    return true;
  });

  const handleYearChange = (value: string) => {
    replace(pathname + "?" + createQueryString({ year: value }));
  };

  const handleMonthChange = (value: string) => {
    replace(pathname + "?" + createQueryString({ month: value }));
  };

  return (
    <Popover open={open} onOpenChange={setOpen} modal={true}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="border-dashed">
          <Calendar className="mr-2 h-4 w-4" />
          Fecha
          {month ? (
            <>
              <Separator orientation="vertical" className="mx-2 h-4" />
              <Badge
                variant="secondary"
                className="rounded-sm px-1 font-normal"
              >
                {monthView?.label}
              </Badge>
            </>
          ) : null}
          {year && (
            <Badge
              variant="secondary"
              className="rounded-sm px-1 font-normal ml-2"
            >
              {year}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64">
        <div className="grid gap-2">
          <div className="flex justify-between items-center">
            <span>Periodo</span>
            <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
              <X className="h-5 w-5" />
              <span className="sr-only">Cerrar modal</span>
            </Button>
          </div>
          <Select value={year} onValueChange={handleYearChange}>
            <SelectTrigger className="w-full">
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
          <Select value={month} onValueChange={handleMonthChange}>
            <SelectTrigger className="w-full">
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
          <Button
            variant="secondary"
            onClick={() => {
              //resetear valores
            }}
          >
            Ver Todo
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
