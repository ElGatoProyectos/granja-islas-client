"use client";

import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useMemo,
} from "react";
import { useCompanySession } from "./company-context";
import { useDatePeriod } from "@/hooks/useDateRange";

interface DatesFilterContextType {
  availableYears: string[];
  getAvailableMonths: (year: number) => { value: string; label: string }[];
  selectedMonth: number;
  selectedYear: number;
  setSelectedMonth: Dispatch<SetStateAction<number>>;
  setSelectedYear: Dispatch<SetStateAction<number>>;
}

export const datesFilterContext = createContext<DatesFilterContextType | null>(
  null
);

export const DatesFilterProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { company } = useCompanySession();
  const initialYear = company?.emisor_electronico_desde
    ? new Date(company.emisor_electronico_desde).getFullYear()
    : new Date().getFullYear();

  const initialMonth = company?.emisor_electronico_desde
    ? new Date(company.emisor_electronico_desde).getMonth() + 1
    : new Date().getMonth() + 1;

  const {
    availableYears,
    getAvailableMonths,
    selectedMonth,
    selectedYear,
    setSelectedMonth,
    setSelectedYear,
  } = useDatePeriod({ initialMonth, initialYear });

  const value = useMemo(
    () => ({
      availableYears,
      getAvailableMonths,
      selectedMonth,
      selectedYear,
      setSelectedMonth,
      setSelectedYear,
    }),
    [
      availableYears,
      getAvailableMonths,
      selectedMonth,
      selectedYear,
      setSelectedMonth,
      setSelectedYear,
    ]
  );

  return (
    <datesFilterContext.Provider value={value}>
      {children}
    </datesFilterContext.Provider>
  );
};

export function useDatesFilter() {
  const context = useContext(datesFilterContext);
  if (!context) {
    throw new Error("useDatesFilter should be used inside of provider");
  }
  return context;
}
