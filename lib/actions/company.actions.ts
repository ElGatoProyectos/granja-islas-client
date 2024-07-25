"use server";

import { authOptions } from "@/app/api/auth-options";
import { backend_url } from "@/constants/config";
import { FormattedCompany } from "@/types";
import { formatCompany } from "@/utils/format-company";
import { getServerSession } from "next-auth";

export const getCompanies = async (): Promise<
  FormattedCompany[] | undefined
> => {
  const session = await getServerSession(authOptions);

  try {
    const res = await fetch(`${backend_url}/api/companies`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${session.user.tokenBack}`,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      throw new Error("Failed to fetch companies");
    }

    const data = await res.json();

    const formatCompaines = formatCompany(data);

    return formatCompaines;
  } catch (error) {
    console.error("Error to fetch data", error);
  }
};
