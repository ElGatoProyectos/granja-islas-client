import { CardsInfo } from "@/components/home/cards-info";
import { PeriodsDashboard } from "@/components/home/periods";
import { ShoppingRecordTable } from "@/components/home/shopping-record-table";
import { DataTableSkeletonTest } from "@/components/home/table-skeleton";
import { LayerPage } from "@/components/layer-page";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { getCompanyForRuc } from "@/lib/actions/company.actions";
import { getDataDashboard } from "@/lib/actions/dashboard";
import { TypeParams } from "@/types/params";
import { calculateTotalCards, calculateTotals } from "@/utils/calculateTotals";
import { getYearAndMonth } from "@/utils/getYearAndMonth";
import { redirect } from "next/navigation";
import { Suspense } from "react";

interface TypeCardsInfo {
  value: number;
  title: "Numero de documentos" | "Base imponible" | "IGV" | "Compras totales";
  date: "1M";
}

export default async function Home({ searchParams }: TypeParams) {
  const company_ruc =
    typeof searchParams.ruc === "string" ? searchParams.ruc : "";
  if (!company_ruc) {
    redirect("/onboarding");
  }
  const year =
    typeof searchParams.year === "string"
      ? searchParams.year
      : new Date().getFullYear().toString();
  const month =
    typeof searchParams.month === "string"
      ? searchParams.month
      : (new Date().getMonth() + 1).toString();
  const company = await getCompanyForRuc({ ruc: company_ruc });
  const { yearStarted, monthStarted } = getYearAndMonth({
    dateString: company.emisor_electronico_desde,
  });

  const data = await getDataDashboard({ year, month, ruc: company_ruc });

  const formatedBills = calculateTotals({
    receipts: data?.bills,
    document_type: "01 - Factura",
  });
  const formatedCreditNotes = calculateTotals({
    receipts: data?.creditNotes,
    document_type: "07 - Nota de crédito",
  });
  const formatedDebitNotes = calculateTotals({
    receipts: data?.debitNotes,
    document_type: "08 - Nota de débito",
  });
  const formatedTickets = calculateTotals({
    receipts: data?.tickets,
    document_type: "03 - Boleta de venta",
  });

  const formatedReceipts = [
    formatedBills,
    formatedCreditNotes,
    formatedDebitNotes,
    formatedTickets,
  ];
  const cardData = calculateTotalCards({ formatedReceipts });
  const cardsInfo: TypeCardsInfo[] = [
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
  ];

  return (
    <LayerPage title="Registro de compras" className="pl-8">
      <ScrollArea className="w-[calc(100vw-3.75rem)] lg:w-full whitespace-nowrap rounded-md">
        <Suspense
          fallback={
            <div className="flex w-max pb-6 lg:grid lg:grid-cols-2 xl:grid-cols-4 lg:w-full gap-4 justify-center items-center">
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-32 w-full" />
            </div>
          }
        >
          <CardsInfo cardsInfo={cardsInfo} />
        </Suspense>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
      <Suspense fallback={"cargando datos?"}>
        <PeriodsDashboard
          yearStarted={yearStarted}
          monthStarted={monthStarted}
          formatedReceipts={formatedReceipts}
        />
      </Suspense>
      <Suspense
        fallback={
          <DataTableSkeletonTest
            columnCount={7}
            rowCount={5}
            withPagination={false}
            shrinkZero
            showViewOptions={false}
          />
        }
      >
        <ShoppingRecordTable
          ruc={company_ruc}
          receipts={formatedReceipts}
          totalAmountofAll={cardsInfo.length ? cardsInfo[3].value : 0}
        />
      </Suspense>
    </LayerPage>
  );
}
