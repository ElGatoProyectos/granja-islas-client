"use client";

import { Row } from "@tanstack/react-table";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Download, Ellipsis, Loader2 } from "lucide-react";
import { usePathname } from "next/navigation";
import { receiptSchemaIN } from "@/lib/validations/receipt";
import Link from "next/link";
import { backend_url } from "@/constants/config";
import { useCompanySession } from "@/context/company-context";
import { useUserInfo } from "@/context/user-context";
import { typesSpanishFormat } from "@/constants/type-document";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const receipt = receiptSchemaIN.parse(row.original);
  const { company } = useCompanySession();
  const { tokenBack } = useUserInfo();
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

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

    const url = `${backend_url}/api/documents/pdf?${queryParams}`;
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

        // Abrir el PDF en una nueva pestaña
        window.open(blobUrl, "_blank");
      } else {
        console.error("Error al obtener el PDF:", response.statusText);
      }
    } catch (e) {
      toast({
        variant: "destructive",
        title: `Ocurrio un error al crear el pdf del documento`,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    // <DropdownMenu>
    //   <DropdownMenuTrigger asChild>
    //     <Button
    //       variant="ghost"
    //       className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
    //     >
    //       <Ellipsis className="h-4 w-4" />
    //       <span className="sr-only">Abrir menu</span>
    //     </Button>
    //   </DropdownMenuTrigger>
    //   <DropdownMenuContent align="end" className="w-[160px]">
    //     <DropdownMenuItem
    //       onClick={() => navigator.clipboard.writeText(receipt.Supplier.ruc)}
    //     >
    //       Copiar RUC
    //     </DropdownMenuItem>
    //     <DropdownMenuSeparator />

    //     <DropdownMenuItem onClick={getPdf}>Descargar pdf</DropdownMenuItem>

    //     <Link href={`${pathname}/${receipt.id}-${receipt.document_code}`}>
    //       <DropdownMenuItem>Ver detalles</DropdownMenuItem>
    //     </Link>
    //   </DropdownMenuContent>
    // </DropdownMenu>

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
