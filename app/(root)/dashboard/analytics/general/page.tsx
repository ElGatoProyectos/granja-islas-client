import { ExpenseCompositionPiechart } from "@/components/analytics/general/expense-composition-piechart";
import { PurchasesPerMoth } from "@/components/analytics/general/puchases-per-month";
import { SuppliersBarchart } from "@/components/analytics/general/suppliers-barchart";
import { SuppliersTable } from "@/components/analytics/general/suppliers-table";
import { ComandLabel } from "@/components/analytics/specific/comand-label";
import { PeriodsRange } from "@/components/periods-range";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getCompanyForRuc } from "@/lib/actions/company.actions";
import {
  getAnalyticsByLabel,
  getExpenditureComposition,
  getTopSuppliers,
} from "@/lib/actions/general-analytics";
import { getLabels } from "@/lib/actions/label.actions";
import { TypeParams } from "@/types/params";
import { getYearAndMonth } from "@/utils/getYearAndMonth";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export default async function Page({ searchParams }: TypeParams) {
  const company_ruc =
    typeof searchParams.ruc === "string" ? searchParams.ruc : "";

  const labelId =
    typeof searchParams.labelId === "string" ? searchParams.labelId : "";
  const startYear =
    typeof searchParams.startYear === "string" ? searchParams.startYear : "";
  const startMonth =
    typeof searchParams.startMonth === "string" ? searchParams.startMonth : "";
  const endYear =
    typeof searchParams.endYear === "string" ? searchParams.endYear : "";
  const endMonth =
    typeof searchParams.endMonth === "string" ? searchParams.endMonth : "";

  const labels = await getLabels({ company_ruc });
  const company = await getCompanyForRuc({ ruc: company_ruc });
  const { yearStarted, monthStarted } = getYearAndMonth({
    dateString: company.emisor_electronico_desde,
  });

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
        <PeriodsRange yearStarted={yearStarted} monthStarted={monthStarted} />
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
