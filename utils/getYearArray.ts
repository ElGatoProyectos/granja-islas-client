export function getYearsArray({ startYear }: { startYear: number }): string[] {
  const currentYear = new Date().getFullYear();
  const years = [];

  for (let year = startYear; year <= currentYear; year++) {
    years.push(year.toString());
  }

  return years;
}
