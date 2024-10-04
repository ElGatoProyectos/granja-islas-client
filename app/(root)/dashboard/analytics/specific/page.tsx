import { ComandLabel } from "@/components/analytics/specific/comand-label";
import { FiscalConsumptionLinechart } from "@/components/analytics/specific/fiscal-consumption-linechart";
import { FiscalConsumptionMeasureLinechart } from "@/components/analytics/specific/fiscalconsumption-measure-linechart";
import { RangePeriods } from "@/components/analytics/specific/range-periods";
import { getCompany } from "@/lib/actions/company.actions";
import { getLabels } from "@/lib/actions/label.actions";
import {
  getMeasuresSpecific,
  getSpecificCharts,
} from "@/lib/actions/specific-analytic";
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
  const company = await getCompany({ idCompany: "3" });
  const { yearStarted, monthStarted } = getYearAndMonth({
    dateString: company.emisor_electronico_desde,
  });

  const labelTitle =
    labels.payload.find((label) => label.id.toString() === labelId)?.title ??
    "";

  const startDate =
    startYear && startMonth ? `${startYear}-${startMonth}` : new Date();
  const endDate = endYear && endMonth ? `${endYear}-${endMonth}` : new Date();

  const formattedStart = format(startDate, "MMMM yyyy", { locale: es });
  const formattedEnd = format(endDate, "MMMM yyyy", { locale: es });
  const descriptionRange = `${formattedStart} - ${formattedEnd}`;

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
        <RangePeriods yearStarted={yearStarted} monthStarted={monthStarted} />
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
        {/* <LastShoppingLinechart
          specificChart3={specificChart3}
          label={labelSelected?.title}
          date={formatTextDate({
            filterMonth,
          })}
        /> */}
      </main>
    </section>
  );
}
