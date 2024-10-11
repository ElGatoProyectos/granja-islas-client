"use server";
import { authOptions } from "@/app/api/auth-options";
import { BACKEND_URL } from "@/constants/config";
import { TypeResponseApi } from "@/types/api-response";
import { TypeDashboard } from "@/types/dashboard";
import axios, { AxiosResponse } from "axios";
import { getServerSession } from "next-auth";

export async function syncWithSunat({
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
    const { data } = await axios.post(
      `${BACKEND_URL}/api/sunat/synchronize`,
      {
        start,
        end,
      },
      {
        headers: {
          Authorization: `Bearer ${session.user.tokenBack}`,
          ruc,
        },
      }
    );

    return data;
  } catch (e: any) {
    if (e.response && e.response.data) {
      const { message } = e.response.data;
      throw new Error(message || "Error al sincronizar con SUNAT.");
    } else {
      throw new Error("Error desconocido al sincronizar con SUNAT.");
    }
  }
}
