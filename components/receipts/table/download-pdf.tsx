"use client";

import { Button } from "@/components/ui/button";
import { BACKEND_URL } from "@/constants/config";
import { typesSpanishFormat } from "@/constants/type-document";
import { useCompanySession } from "@/context/company-context";
import { useUserInfo } from "@/context/user-context";
import { TypeReceipt } from "@/types/receipt";
import { formatDate } from "@/utils/format-date";
import { Row } from "@tanstack/react-table";
import { Download, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

export function ReceiptDownloadPdf<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const receipt = row.original as TypeReceipt;
  const { company } = useCompanySession();
  const { tokenBack } = useUserInfo();
  const [loading, setLoading] = useState(false);

  function getValueFromLabel(label: string) {
    const found = typesSpanishFormat.find((item) => item.label === label);
    return found ? found.value : "";
  }

  const getPdf = async () => {
    if (!company) return;
    setLoading(true);
    const queryParams = new URLSearchParams();
    queryParams.append("document_id", receipt.id.toString());
    queryParams.append(
      "type_document",
      getValueFromLabel(receipt.document_description)
    );
    const url = `${BACKEND_URL}/api/documents/pdf?${queryParams}`;
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: { Authorization: `Bearer ${tokenBack}`, ruc: company?.ruc },
      });
      if (response.ok) {
        // Obtener el contenido como un Blob
        const blob = await response.blob();
        // Crear una URL para el Blob
        const blobUrl = URL.createObjectURL(blob);
        // Crear un enlace temporal para descargar el archivo
        const link = document.createElement("a");
        link.href = blobUrl;
        link.download = `documento-${receipt.code}-fecha-${formatDate(
          receipt.issue_date
        )}.pdf`;
        document.body.appendChild(link);
        link.click();
        // Eliminar el enlace temporal después de la descarga
        document.body.removeChild(link);
        // Revocar la URL del Blob para liberar memoria
        URL.revokeObjectURL(blobUrl);
      } else {
        console.error("Error al obtener el PDF:", response.statusText);
      }
    } catch (e) {
      toast.error(`Ocurrio un error al crear el pdf del documento`);
    } finally {
      setLoading(false);
    }
  };
  return (
    <Button onClick={getPdf} variant="secondary" size="sm" disabled={loading}>
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <>
          <Download className="h-4 w-4" />
          <span className="sr-only">Descargar documento</span>
        </>
      )}
    </Button>
  );
}
