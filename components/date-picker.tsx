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
import { months } from "@/constants/dates";
import { cn } from "@/lib/utils";
import { Calendar, RotateCcw, X } from "lucide-react";
import { Dispatch, SetStateAction, useState } from "react";

interface Props {
  setMonth: Dispatch<SetStateAction<string>>;
  setYear: Dispatch<SetStateAction<string>>;
  year: string;
  month: string;
  getData: () => void;
  title?: string;
}

export function DatePicker({
  setMonth,
  setYear,
  month,
  year,
  getData,
  title,
}: Props) {
  const currentYear = new Date().getFullYear();
  const years = [currentYear - 1, currentYear];

  const resetValues = () => {
    setMonth("");
    setYear("");
    getData();
  };
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen} modal={true}>
      <PopoverTrigger asChild>
        <Button variant="outline" size={title ? "default" : "icon"}>
          <Calendar className={cn("h-5 w-5", title ? "mr-2" : "")} />
          {title && <span>{title}</span>}
          <span className="sr-only">Escojer periodo</span>
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
          <Select value={year} onValueChange={setYear}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecciona el año" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {years.map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <Select value={month} onValueChange={setMonth}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecciona el mes" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {months.map(({ value, label }) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <Button variant="secondary" onClick={resetValues}>
            <RotateCcw className="h-5 w-5 mr-2" />
            Restablecer
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
