import { months } from "@/constants/dates";

export function filterMonthsByYear({
  monthStarted,
  selectedYear,
  yearStarted,
}: {
  selectedYear: string | null;
  yearStarted: number;
  monthStarted: number;
}) {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;
  return months.filter(({ value }) => {
    if (!selectedYear) return true;
    const year = parseInt(selectedYear);

    if (year === yearStarted) {
      return parseInt(value) >= monthStarted;
    }
    if (year === currentYear) {
      return parseInt(value) <= currentMonth;
    }
    return true;
  });
}
