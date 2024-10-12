import { ExpenseCompositionPiechart } from "@/components/analytics/general/expense-composition-piechart";
import { PurchasesPerMoth } from "@/components/analytics/general/puchases-per-month";
import { SuppliersBarchart } from "@/components/analytics/general/suppliers-barchart";
import { SuppliersTable } from "@/components/analytics/general/suppliers-table";
import { ComandLabel } from "@/components/analytics/specific/comand-label";
import { PeriodsRange } from "@/components/periods-range";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { START_MONTH_SYNC, START_YEAR_SYNC } from "@/constants/start-sync";
import { getCompanyForRuc } from "@/lib/actions/company.actions";
import {
  getAnalyticsByLabel,
  getExpenditureComposition,
  getTopSuppliers,
} from "@/lib/actions/general-analytics";
import { getLabels } from "@/lib/actions/label.actions";
import { TypeParams } from "@/types/params";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { redirect } from "next/navigation";

export default async function Page({ searchParams }: TypeParams) {
  const company_ruc =
    typeof searchParams.ruc === "string" ? searchParams.ruc : "";
  if (!company_ruc) {
    redirect("/onboarding");
  }
  const labelId =
    typeof searchParams.labelId === "string" ? searchParams.labelId : "";
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;
  const startYear =
    typeof searchParams.startYear === "string"
      ? searchParams.startYear
      : currentYear.toString();
  const startMonth =
    typeof searchParams.startMonth === "string"
      ? searchParams.startMonth
      : currentMonth.toString();
  const endYear =
    typeof searchParams.endYear === "string"
      ? searchParams.endYear
      : currentYear.toString();
  const endMonth =
    typeof searchParams.endMonth === "string"
      ? searchParams.endMonth
      : currentMonth.toString();

  const labels = await getLabels({ company_ruc });

  const topSuppliers = await getTopSuppliers({
    endMonth,
    endYear,
    ruc: company_ruc,
    startMonth,
    startYear,
  });

  const expComposition = await getExpenditureComposition({
    endMonth,
    endYear,
    ruc: company_ruc,
    startMonth,
    startYear,
  });

  const startDate = new Date(Date.UTC(Number(startYear), Number(startMonth)));
  const formatStart = format(startDate, "MMMM yyyy", { locale: es });
  const endDate = new Date(Date.UTC(Number(endYear), Number(endMonth)));
  const formatEnd = format(endDate, "MMMM yyyy", { locale: es });
  const descriptionRange = `${formatStart} - ${formatEnd}`;

  const analyticsByLabel = await getAnalyticsByLabel({
    labelId,
    ruc: company_ruc,
  });

  return (
    <section>
      <header className="flex justify-between">
        <h1 className={"text-2xl md:text-3xl font-bold"}>Detalles generales</h1>
        <PeriodsRange
          yearStarted={START_YEAR_SYNC}
          monthStarted={START_MONTH_SYNC}
          currentDate
        />
      </header>
      <div className="mt-6 w-full flex flex-col">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
          <SuppliersBarchart
            topSuppliers={topSuppliers}
            descriptionRange={
              startYear && startMonth && endYear && endMonth
                ? descriptionRange
                : "Seleccione un rango de periodos"
            }
          />
          <ExpenseCompositionPiechart
            expComposition={expComposition}
            descriptionRange={
              startYear && startMonth && endYear && endMonth
                ? descriptionRange
                : "Seleccione un rango de periodos"
            }
          />
        </div>
      </div>

      <div className="mt-8 w-full flex flex-col">
        <h2 className="text-2xl md:text-3xl font-bold mb-6">
          Análisis por etiqueta
        </h2>
        <div className="space-y-4 ">
          <ComandLabel labels={labels.payload} />
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="font-bold">
                  Principales proveedores
                </CardTitle>
              </CardHeader>
              <CardContent>
                <SuppliersTable
                  suppliers={analyticsByLabel?.principalSuppliers}
                />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="font-bold">Compras por mes</CardTitle>
              </CardHeader>
              <CardContent className="flex justify-center">
                <PurchasesPerMoth buyforMonth={analyticsByLabel?.buyForMonth} />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
