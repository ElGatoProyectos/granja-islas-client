import { authOptions } from "@/app/api/auth-options";
import { getServerSession } from "next-auth";
import axios, { AxiosResponse } from "axios";
import { TypeResponseApi } from "@/types/api-response";
import { SpecificAnalyticChart } from "@/types/analytic";
import { BACKEND_URL } from "@/constants/config";

export async function getSpecificChart1({
  idLabel,
  filter_month,
  start,
  end,
}: {
  idLabel: number;
  filter_month: string;
  start: `${string}-${string} `;
  end: `${string}-${string} `;
}) {
  const session = await getServerSession(authOptions);
  try {
    const {
      data: chart1,
    }: AxiosResponse<TypeResponseApi<SpecificAnalyticChart[]>> =
      await axios.get(`${BACKEND_URL}/api/reports/specific-analysis-1`, {
        headers: { Authorization: `Bearer ${session.tokenBack}` },
        params: { filter_month, label_id: idLabel },
      });

    const {
      data: chart2,
    }: AxiosResponse<TypeResponseApi<SpecificAnalyticChart[]>> =
      await axios.get(`${BACKEND_URL}/api/reports/specific-analysis-2`, {
        headers: { Authorization: `Bearer ${session.tokenBack}` },
        params: { filter_month, label_id: idLabel },
      });

    return { chart1, chart2 };
  } catch (e) {
    console.error(e);
    throw new Error("Failed to get specific analytics");
  }
}
