import { backend_url } from "@/constants/config";
import { useCompanySession } from "@/context/company-context";
import { useUserInfo } from "@/context/user-context";
import { ReceiptSchemaIN } from "@/lib/validations/receipt";
import { calculateTotalCards, calculateTotals } from "@/utils/calculateTotals";
import { defaultDate } from "@/utils/default-date";
import { useCallback, useEffect, useState } from "react";

interface Props {
  error: boolean;
  message: string;
  payload: {
    bills: ReceiptSchemaIN[];
    creditNotes: ReceiptSchemaIN[];
    debitNotes: ReceiptSchemaIN[];
    tickets: ReceiptSchemaIN[];
  };
  statusCode: number;
}

export interface FormatedTotalAmountReceipts {
  document_type:
    | "01 - Factura"
    | "03 - Boleta de venta"
    | "07 - Nota de crédito"
    | "08 - Nota de débito";
  total_documents: number;
  total_amount_documents: number;
  total_amount_igv: number;
  total_amount_base: number;
  total_amount_dgng_igv: number;
  total_amount_dgng_base: number;
}

export interface CardsInfoType {
  value: number;
  title: "Numero de documentos" | "Base imponible" | "IGV" | "Compras totales";
  date: "1M";
}

export function useDashboard() {
  const { tokenBack } = useUserInfo();
  const { company } = useCompanySession();
  const [receipts, setReceipts] = useState<FormatedTotalAmountReceipts[]>([]);
  const { adjustedYear, previousMonth } = defaultDate();
  const [loading, setLoading] = useState(false);
  const [month, setMonth] = useState(previousMonth);
  const [year, setYear] = useState(adjustedYear);
  const [cardsInfo, setCardsInfo] = useState<CardsInfoType[]>([]);

  const getData = useCallback(async () => {
    if (!company) return;
    if (!tokenBack) return;
    setLoading(true);

    const queryParams = new URLSearchParams();
    if (year) queryParams.append("year", year.toString());
    if (month) queryParams.append("month", month.toString());
    const url = `${backend_url}/api/documents/report-1?${queryParams}`;

    try {
      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${tokenBack}`,
          ruc: company?.ruc,
        },
      });

      if (!res.ok) {
        console.error("Fetch error:", res.statusText);
        return;
      }

      const data: Props = await res.json();
      console.log(data);

      const formatedBills = calculateTotals({
        receipts: data.payload.bills,
        document_type: "01 - Factura",
      });
      const formatedCreditNotes = calculateTotals({
        receipts: data.payload.creditNotes,
        document_type: "07 - Nota de crédito",
      });
      const formatedDebitNotes = calculateTotals({
        receipts: data.payload.debitNotes,
        document_type: "08 - Nota de débito",
      });
      const formatedTickets = calculateTotals({
        receipts: data.payload.tickets,
        document_type: "03 - Boleta de venta",
      });

      const formatedReceipts = [
        formatedBills,
        formatedCreditNotes,
        formatedDebitNotes,
        formatedTickets,
      ];
      const cardData = calculateTotalCards({ formatedReceipts });

      setCardsInfo([
        {
          value: cardData.totalOfAll,
          title: "Numero de documentos",
          date: "1M",
        },
        {
          value: cardData.totalAmountBase,
          title: "Base imponible",
          date: "1M",
        },
        {
          value: cardData.totalAmountIgv,
          title: "IGV",
          date: "1M",
        },
        {
          value: cardData.totalAmountDocumentsOfAll,
          title: "Compras totales",
          date: "1M",
        },
      ]);
      setReceipts(formatedReceipts);
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  }, [company, month, tokenBack, year]);

  useEffect(() => {
    getData();
  }, [getData]);

  return { receipts, setMonth, setYear, loading, cardsInfo };
}
