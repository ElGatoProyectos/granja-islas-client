export function formatTextDate({ filterMonth }: { filterMonth: string }) {
  // Obtener la fecha actual
  const currentDate = new Date();
  let currentYear = currentDate.getFullYear();
  let currentMonth = currentDate.getMonth(); // 0: Enero, 11: Diciembre

  // Mapeamos los meses a su índice correspondiente para determinar el año
  const monthIndex: { [key: number]: string } = {
    0: "Enero",
    1: "Febrero",
    2: "Marzo",
    3: "Abril",
    4: "Mayo",
    5: "Junio",
    6: "Julio",
    7: "Agosto",
    8: "Septiembre",
    9: "Octubre",
    10: "Noviembre",
    11: "Diciembre",
  };

  // Convertir el filtro de meses a número
  const filterMonthsCount = parseInt(filterMonth, 10);

  if (filterMonthsCount === 6) {
    // Calcular el mes inicial restando 5 meses al mes actual
    let startMonth = currentMonth - 5;
    let startYear = currentYear;

    // Si el mes inicial es menor que 0, ajusta el año y el mes
    if (startMonth < 0) {
      startMonth += 12; // Ajustar el mes para que sea positivo
      startYear -= 1; // Retroceder un año
    }

    return `${monthIndex[startMonth]} de ${startYear} - ${monthIndex[currentMonth]} de ${currentYear}`;
  } else if (filterMonthsCount === 12) {
    // Calcular el mes inicial restando 11 meses al mes actual
    let startMonth = currentMonth - 11;
    let startYear = currentYear;

    // Si el mes inicial es menor que 0, ajusta el año y el mes
    if (startMonth < 0) {
      startMonth += 12; // Ajustar el mes para que sea positivo
      startYear -= 1; // Retroceder un año
    }

    return `${monthIndex[startMonth]} de ${startYear} - ${monthIndex[currentMonth]} de ${currentYear}`;
  }

  // Si no se filtran 6 o 12 meses, simplemente retorna el mes actual
  return `${monthIndex[currentMonth]} de ${currentYear} - ${monthIndex[currentMonth]} de ${currentYear}`;
}
