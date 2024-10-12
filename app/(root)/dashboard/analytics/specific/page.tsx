import { ComandLabel } from "@/components/analytics/specific/comand-label";
import { FiscalConsumptionLinechart } from "@/components/analytics/specific/fiscal-consumption-linechart";
import { FiscalConsumptionMeasureLinechart } from "@/components/analytics/specific/fiscalconsumption-measure-linechart";
import { PeriodsRange } from "@/components/periods-range";
import { START_MONTH_SYNC, START_YEAR_SYNC } from "@/constants/start-sync";
import { getLabels } from "@/lib/actions/label.actions";
import {
  getMeasuresSpecific,
  getSpecificCharts,
} from "@/lib/actions/specific-analytic";
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
      : (currentYear - 1).toString();
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

  const labelTitle =
    labels.payload.find((label) => label.id.toString() === labelId)?.title ??
    "";

  const startDate = new Date(Date.UTC(Number(startYear), Number(startMonth)));
  const formatStart = format(startDate, "MMMM yyyy", { locale: es });
  const endDate = new Date(Date.UTC(Number(endYear), Number(endMonth)));
  const formatEnd = format(endDate, "MMMM yyyy", { locale: es });
  const descriptionRange = `${formatStart} - ${formatEnd}`;

  const charts = await getSpecificCharts({
    idLabel: labelId,
    startMonth,
    startYear,
    endMonth,
    endYear,
    ruc: company_ruc,
  });

  const measures = await getMeasuresSpecific({ ruc: company_ruc });

  return (
    <section>
      <header className="flex justify-between mb-4">
        <ComandLabel labels={labels.payload} />
        <PeriodsRange
          yearStarted={START_YEAR_SYNC}
          monthStarted={START_MONTH_SYNC}
          currentDate
          yearDiference
        />
      </header>
      <main className="grid grid-cols-1 gap-4">
        <FiscalConsumptionLinechart
          label={labelTitle}
          specificChart={charts.chart1}
          descriptionRange={
            startYear && startMonth && endYear && endMonth
              ? descriptionRange
              : "Seleccione un rango de periodos"
          }
        />
        <FiscalConsumptionMeasureLinechart
          label={labelTitle}
          specificChart={charts.chart2}
          measures={measures}
          descriptionRange={
            startYear && startMonth && endYear && endMonth
              ? descriptionRange
              : "Seleccione un rango de periodos"
          }
        />
      </main>
    </section>
  );
}
