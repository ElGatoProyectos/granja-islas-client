export function defaultDate() {
  // Obtener fecha actual
  const currentDate = new Date();
  // Obtener el año actual
  const currentYear = currentDate.getFullYear();
  // Obtener el mes anterior (JavaScript cuenta los meses de 0 a 11)
  const previousMonth = currentDate.getMonth() - 1;
  // Ajustar el año si el mes es diciembre
  const adjustedYear = previousMonth === 12 ? currentYear - 1 : currentYear;

  return {
    previousMonth: previousMonth.toString(),
    adjustedYear: adjustedYear.toString(),
  };
}
