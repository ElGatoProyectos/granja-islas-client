const monthMap = [
  "Ene",
  "Feb",
  "Mar",
  "Abr",
  "May",
  "Jun",
  "Jul",
  "Ago",
  "Sep",
  "Oct",
  "Nov",
  "Dic",
];
export const getFilteredExpenses = ({
  filterMonth,
  purchases,
}: {
  filterMonth: string;
  purchases: any[];
}) => {
  const today = new Date();
  const filteredExpenses = [];

  // Iterar hacia atrás desde el mes actual según el filtro
  for (let i = 0; i < parseInt(filterMonth); i++) {
    const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
    const month = monthMap[date.getMonth()];

    // Filtrar compras por el mes y año actuales
    const purchasesInMonth = purchases.filter((purchase) => {
      const purchaseDate = new Date(purchase.issue_date);
      return (
        purchaseDate.getMonth() === date.getMonth() &&
        purchaseDate.getFullYear() === date.getFullYear()
      );
    });

    // Sumar las compras en el mes o poner 0 si no hay compras
    const totalPurchases = purchasesInMonth.length;

    filteredExpenses.push({
      month: `${month}`,
      shopping: totalPurchases,
    });
  }

  // Invertir el array para mostrar desde el mes más antiguo al más reciente
  return filteredExpenses.reverse();
};
