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
import { Calendar, RotateCcw, X } from "lucide-react";
import { Dispatch, SetStateAction, useState } from "react";
import { Separator } from "./ui/separator";
import { Badge } from "./ui/badge";
import { months } from "@/constants/dates";

interface Props {
  availableYears: string[];
  getAvailableMonths: (year: number) => { value: string; label: string }[];
  selectedMonth: number;
  selectedYear: number;
  setSelectedMonth: Dispatch<SetStateAction<number>>;
  setSelectedYear: Dispatch<SetStateAction<number>>;
  getData: () => void;
  title: string;
}

export function DatePickerNumber({
  availableYears,
  getAvailableMonths,
  selectedMonth,
  selectedYear,
  setSelectedMonth,
  setSelectedYear,
  getData,
  title,
}: Props) {
  const resetValues = () => {
    setSelectedMonth(0);
    setSelectedYear(0);
    getData();
  };

  const [open, setOpen] = useState(false);
  const [monthView] = months.filter(
    (month) => parseInt(month.value, 10) === selectedMonth
  );

  return (
    <Popover open={open} onOpenChange={setOpen} modal={true}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="border-dashed">
          <Calendar className="mr-2 h-4 w-4" />
          {title}
          <span className="sr-only">Escojer periodo</span>
          {selectedMonth !== 0 ? (
            <>
              <Separator orientation="vertical" className="mx-2 h-4" />
              <Badge
                variant="secondary"
                className="rounded-sm px-1 font-normal"
              >
                {monthView.label}
              </Badge>
            </>
          ) : null}
          {selectedYear !== 0 && (
            <Badge
              variant="secondary"
              className="rounded-sm px-1 font-normal ml-2"
            >
              {selectedYear}
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
          <Select
            name="year"
            value={
              selectedYear.toString() === "0" ? "" : selectedYear.toString()
            }
            onValueChange={(value: string) =>
              setSelectedYear(parseInt(value, 10))
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecciona el año" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {availableYears.map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <Select
            name="month"
            value={
              selectedMonth.toString() === "0" ? "" : selectedMonth.toString()
            }
            onValueChange={(value: string) =>
              setSelectedMonth(parseInt(value, 10))
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecciona el mes" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {getAvailableMonths(selectedYear).map(({ label, value }) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <Button variant="secondary" onClick={resetValues}>
            Ver Todo
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
