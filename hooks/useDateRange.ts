import { useState, useMemo } from "react";
import { months } from "@/constants/dates";

export function useDateRange(initialYearStart: string) {
  const [selectedYearStart, setSelectedYearStart] = useState<string>("");
  const [selectedMonthStart, setSelectedMonthStart] = useState<string>("");
  const [selectedYearEnd, setSelectedYearEnd] = useState<string>("");
  const [selectedMonthEnd, setSelectedMonthEnd] = useState<string>("");

  const currentYear = new Date().getFullYear();

  const availableYears = useMemo(() => {
    const startYear = parseInt(initialYearStart, 10) || currentYear;
    return Array.from({ length: currentYear - startYear + 1 }, (_, i) =>
      (startYear + i).toString()
    );
  }, [initialYearStart, currentYear]);

  const getAvailableMonths = (year: string) => {
    const selectedYear = parseInt(year, 10);
    return selectedYear === currentYear
      ? months.slice(0, new Date().getMonth() + 1)
      : months;
  };

  return {
    selectedYearStart,
    selectedMonthStart,
    selectedYearEnd,
    selectedMonthEnd,
    availableYears,
    getAvailableMonths,
    setSelectedYearStart,
    setSelectedMonthStart,
    setSelectedYearEnd,
    setSelectedMonthEnd,
  };
}
