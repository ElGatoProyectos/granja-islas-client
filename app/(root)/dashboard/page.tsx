import { CardsInfo } from "@/components/home/cards-info";
import { ShoppingRecordTable } from "@/components/home/shopping-record-table";
import { DataTableSkeletonHome } from "@/components/home/table-skeleton";
import { PeriodsRange } from "@/components/periods-range";
import { Skeleton } from "@/components/ui/skeleton";
import { START_MONTH_SYNC, START_YEAR_SYNC } from "@/constants/start-sync";
import { getCompanyForRuc } from "@/lib/actions/company.actions";
import { getDataDashboard } from "@/lib/actions/dashboard";
import { TypeParams } from "@/types/params";
import { calculateTotalCards, calculateTotals } from "@/utils/calculateTotals";
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

  const startYear =
    typeof searchParams.startYear === "string"
      ? searchParams.startYear
      : new Date().getFullYear().toString();
  const startMonth =
    typeof searchParams.startMonth === "string"
      ? searchParams.startMonth
      : (new Date().getMonth() + 1).toString();
  const endYear =
    typeof searchParams.endYear === "string"
      ? searchParams.endYear
      : new Date().getFullYear().toString();
  const endMonth =
    typeof searchParams.endMonth === "string"
      ? searchParams.endMonth
      : (new Date().getMonth() + 1).toString();

  const company = await getCompanyForRuc({ ruc: company_ruc });

  const data = await getDataDashboard({
    ruc: company_ruc,
    endMonth,
    endYear,
    startMonth,
    startYear,
  });

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
    <section className="space-y-4">
      <h1 className={"text-2xl md:text-3xl font-bold mb-6"}>
        Registro de compras
      </h1>
      <PeriodsRange
        yearStarted={START_YEAR_SYNC}
        monthStarted={START_MONTH_SYNC}
        currentDate
      />
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
      <Suspense
        fallback={
          <DataTableSkeletonHome
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
    </section>
  );
}
