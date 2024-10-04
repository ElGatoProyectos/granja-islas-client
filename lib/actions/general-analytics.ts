import { authOptions } from "@/app/api/auth-options";
import { getServerSession } from "next-auth";
import axios, { AxiosResponse } from "axios";
import { TypeResponseApi } from "@/types/api-response";
import {
  GeneralAnalyticsByLabel,
  GeneralExpenditureComposition,
  GeneralTopSupplier,
} from "@/types/analytic";
import { BACKEND_URL } from "@/constants/config";

export async function getTopSuppliers({
  startYear,
  startMonth,
  endYear,
  endMonth,
  ruc,
}: {
  startYear: string;
  startMonth: string;
  endYear: string;
  endMonth: string;
  ruc: string;
}) {
  if (!startYear || !startMonth || !endYear || !endMonth || !ruc) return [];
  const session = await getServerSession(authOptions);
  const startDate = `${startYear}-${startMonth}`;
  const endDate = `${endYear}-${endMonth}`;

  try {
    const {
      data: { payload },
    }: AxiosResponse<TypeResponseApi<GeneralTopSupplier[]>> = await axios.get(
      `${BACKEND_URL}/api/reports/general-analysis-detail-supplier`,
      {
        headers: {
          Authorization: `Bearer ${session.user.tokenBack}`,
          ruc,
        },
        params: {
          start: startDate,
          end: endDate,
        },
      }
    );

    return payload;
  } catch (e) {
    console.error(e);
    throw new Error("Failed to get top suppliers");
  }
}

export async function getExpenditureComposition({
  startYear,
  startMonth,
  endYear,
  endMonth,
  ruc,
}: {
  startYear: string;
  startMonth: string;
  endYear: string;
  endMonth: string;
  ruc: string;
}) {
  if (!startYear || !startMonth || !endYear || !endMonth || !ruc) return [];
  const session = await getServerSession(authOptions);
  const startDate = `${startYear}-${startMonth}`;
  const endDate = `${endYear}-${endMonth}`;

  try {
    const {
      data: { payload },
    }: AxiosResponse<TypeResponseApi<GeneralExpenditureComposition[]>> =
      await axios.get(
        `${BACKEND_URL}/api/reports/general-analysis-detail-expenditure-composition`,
        {
          headers: {
            Authorization: `Bearer ${session.user.tokenBack}`,
            ruc,
          },
          params: {
            start: startDate,
            end: endDate,
          },
        }
      );

    return payload;
  } catch (e) {
    console.error(e);
    throw new Error("Failed to get expenditure composition");
  }
}

export async function getAnalyticsByLabel({
  labelId,
  ruc,
}: {
  labelId: string;
  ruc: string;
}): Promise<GeneralAnalyticsByLabel | undefined> {
  if (!ruc || !labelId) return;
  const session = await getServerSession(authOptions);

  try {
    const {
      data: { payload },
    }: AxiosResponse<TypeResponseApi<GeneralAnalyticsByLabel>> =
      await axios.get(
        `${BACKEND_URL}/api/reports/general-analysis-basic/${labelId}`,
        {
          headers: {
            Authorization: `Bearer ${session.user.tokenBack}`,
            ruc,
          },
        }
      );

    return payload;
  } catch (e) {
    console.error(e);
    throw new Error("Failed to get expenditure composition");
  }
}
