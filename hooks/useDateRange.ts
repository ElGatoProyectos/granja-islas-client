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

export function useDateRange2(initialYearStart: string) {
  const [selectedYearStart, setSelectedYearStart] = useState<string>("");
  const [selectedMonthStart, setSelectedMonthStart] = useState<string>("");
  const [selectedYearEnd, setSelectedYearEnd] = useState<string>("");
  const [selectedMonthEnd, setSelectedMonthEnd] = useState<string>("");

  const currentYear = new Date().getFullYear();
  const currentMonth = (new Date().getMonth() + 1).toString(); // Mes actual (de 1 a 12)

  // Lista de años disponibles desde initialYearStart hasta el año actual
  const availableYears = useMemo(() => {
    const startYear = parseInt(initialYearStart, 10) || currentYear;
    return Array.from({ length: currentYear - startYear + 1 }, (_, i) =>
      (startYear + i).toString()
    );
  }, [initialYearStart, currentYear]);

  // Función para obtener los meses disponibles basados en el año seleccionado
  const getAvailableMonths = (year: string, isStart: boolean) => {
    const selectedYear = parseInt(year, 10);

    // Para el año de inicio, limitar los meses si el año de inicio es el actual
    if (isStart && selectedYear === currentYear) {
      // Filtrar los meses hasta el mes actual
      return months.filter(
        (month) => parseInt(month.value, 10) <= parseInt(currentMonth, 10)
      );
    }

    // Para el año de fin, limitar los meses según la selección de año y mes de inicio
    if (!isStart && selectedYear === parseInt(selectedYearStart, 10)) {
      const selectedMonthValue = parseInt(selectedMonthStart, 10);
      // Mostrar solo los meses desde el mes seleccionado en el inicio
      return months.filter(
        (month) => parseInt(month.value, 10) >= selectedMonthValue
      );
    }

    // Si no hay restricciones, devolver todos los meses
    return months;
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

export function useDatePeriod({
  initialYear,
  initialMonth,
}: {
  initialYear: number;
  initialMonth: number;
}) {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;
  const [selectedYear, setSelectedYear] = useState(initialYear);
  const [selectedMonth, setSelectedMonth] = useState(initialMonth);

  const availableYears = useMemo(() => {
    const startYear = initialYear || currentYear;
    return Array.from({ length: currentYear - startYear + 1 }, (_, i) =>
      (startYear + i).toString()
    );
  }, [initialYear, currentYear]);

  const getAvailableMonths = (year: number) => {
    if (year === initialYear) {
      return months.filter((month) => {
        const monthValue = parseInt(month.value, 10);
        return monthValue >= initialMonth;
      });
    }
    if (year === currentYear) {
      return months.filter((month) => {
        const monthValue = parseInt(month.value, 10);
        return monthValue <= currentMonth;
      });
    }
    return months;
  };

  return {
    availableYears,
    getAvailableMonths,
    selectedYear,
    setSelectedYear,
    selectedMonth,
    setSelectedMonth,
  };
}
