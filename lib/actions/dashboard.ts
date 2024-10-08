import { authOptions } from "@/app/api/auth-options";
import { BACKEND_URL } from "@/constants/config";
import { TypeResponseApi } from "@/types/api-response";
import { TypeDashboard } from "@/types/dashboard";
import axios, { AxiosResponse } from "axios";
import { getServerSession } from "next-auth";

export async function getDataDashboard({
  year,
  month,
  ruc,
}: {
  year: string;
  month: string;
  ruc: string;
}) {
  if (!year || !month || !ruc) return;
  const session = await getServerSession(authOptions);
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
          year,
          month,
        },
      }
    );

    return payload;
  } catch (e) {
    console.error(e);
    throw new Error("Failed to get data of dashboard");
  }
}
