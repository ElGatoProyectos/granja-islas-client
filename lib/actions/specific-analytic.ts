import { authOptions } from "@/app/api/auth-options";
import { getServerSession } from "next-auth";
import axios, { AxiosResponse } from "axios";
import { TypeResponseApi } from "@/types/api-response";
import { SpecificAnalyticChart } from "@/types/analytic";
import { BACKEND_URL } from "@/constants/config";

export async function getSpecificCharts({
  idLabel,
  startYear,
  startMonth,
  endYear,
  endMonth,
  ruc,
}: {
  idLabel: string;
  startYear: string;
  startMonth: string;
  endYear: string;
  endMonth: string;
  ruc: string;
}) {
  if (!startYear || !startMonth || !endYear || !endMonth || !ruc || !idLabel)
    return { chart1: [], chart2: [] };
  const session = await getServerSession(authOptions);
  const startDate = `${startYear}-${startMonth}`;
  const endDate = `${endYear}-${endMonth}`;

  try {
    const {
      data: { payload: chart1 },
    }: AxiosResponse<TypeResponseApi<SpecificAnalyticChart[]>> =
      await axios.get(`${BACKEND_URL}/api/reports/specific-analysis-1`, {
        headers: {
          Authorization: `Bearer ${session.user.tokenBack}`,
          ruc,
        },
        params: {
          label_id: idLabel,
          start: startDate,
          end: endDate,
        },
      });

    const {
      data: { payload: chart2 },
    }: AxiosResponse<TypeResponseApi<SpecificAnalyticChart[]>> =
      await axios.get(`${BACKEND_URL}/api/reports/specific-analysis-2`, {
        headers: { Authorization: `Bearer ${session.user.tokenBack}`, ruc },
        params: {
          label_id: idLabel,
          start: startDate,
          end: endDate,
        },
      });

    return { chart1, chart2 };
  } catch (e) {
    console.error(e);
    throw new Error("Failed to get specific analytics");
  }
}

export async function getMeasuresSpecific({ ruc }: { ruc: string }) {
  const session = await getServerSession(authOptions);
  try {
    const {
      data: { payload },
    }: AxiosResponse<TypeResponseApi<string[]>> = await axios.get(
      `${BACKEND_URL}/api/products/units`,
      {
        headers: { Authorization: `Bearer ${session.user.tokenBack}`, ruc },
      }
    );

    const filteredUnits: string[] = payload.filter(
      (measure: string) => measure !== ""
    );

    return filteredUnits;
  } catch (e) {
    console.error(e);
    throw new Error("Failed to get measure");
  }
}
