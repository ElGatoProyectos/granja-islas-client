import * as XLSX from "xlsx";

export function exportToExcel({
  data,
  filename = "data",
}: {
  data: any[];
  filename?: string;
}) {
  // Crear una nueva hoja de trabajo a partir del array de datos
  const worksheet = XLSX.utils.json_to_sheet(data);

  // Crear un nuevo libro de trabajo
  const workbook = XLSX.utils.book_new();

  // Añadir la hoja de trabajo al libro de trabajo
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

  // Generar un archivo Excel binario
  const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });

  // Crear un Blob a partir del buffer del archivo Excel
  const blob = new Blob([excelBuffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  // Crear un enlace de descarga y activarlo
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `${filename}.xlsx`;
  link.click();

  // Liberar el objeto URL para optimizar memoria
  URL.revokeObjectURL(link.href);
}
