import { authOptions } from "@/app/api/auth-options";
import { BACKEND_URL } from "@/constants/config";
import { TypeResponseApi } from "@/types/api-response";
import { TypeDashboard } from "@/types/dashboard";
import axios, { AxiosResponse } from "axios";
import { getServerSession } from "next-auth";

export async function getDataDashboard({
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
  if (!startYear || !startMonth || !endYear || !endMonth || !ruc) return;
  const session = await getServerSession(authOptions);
  const start = `${startYear}-${startMonth}`;
  const end = `${endYear}-${endMonth}`;

  try {
    const {
      data: { payload },
    }: AxiosResponse<TypeResponseApi<TypeDashboard>> = await axios.get(
      `${BACKEND_URL}/api/documents/report-1`,
      {
        headers: {
          Authorization: `Bearer ${session.user.tokenBack}`,
          ruc,
        },
        params: {
          start,
          end,
        },
      }
    );

    return payload;
  } catch (e) {
    console.error(e);
    throw new Error("Failed to get data of dashboard");
  }
}
