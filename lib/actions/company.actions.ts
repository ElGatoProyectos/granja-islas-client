"use server";

import { authOptions } from "@/app/api/auth-options";
import { BACKEND_URL } from "@/constants/config";
import { getServerSession } from "next-auth";
import { CompanySchemaIN } from "../validations/auth/company";
import { revalidatePath } from "next/cache";
import axios, { AxiosResponse } from "axios";
import { TypeCompany } from "@/types/company";
import { TypeResponseApi } from "@/types/api-response";

export async function getCompany({
  idCompany,
}: {
  idCompany: string | number;
}) {
  const session = await getServerSession(authOptions);

  try {
    const { data }: AxiosResponse<TypeResponseApi<TypeCompany>> =
      await axios.get(`${BACKEND_URL}/api/companies/${idCompany}`, {
        headers: {
          Authorization: `Bearer ${session.user.tokenBack}`,
          "Content-Type": "application/json",
        },
      });

    return data.payload;
  } catch (error) {
    throw new Error("Failed to fetch company");
  }
}

export const getCompanies = async (): Promise<
  CompanySchemaIN[] | undefined
> => {
  const session = await getServerSession(authOptions);

  try {
    const res = await fetch(`${BACKEND_URL}/api/companies`, {
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

    return data.payload;
  } catch (error) {
    console.error("Error to fetch data", error);
  }
};

export async function deleteCompany({
  companyId,
  tokenBack,
  password,
}: {
  companyId: number;
  tokenBack: string;
  password: string;
}) {
  const res = await fetch(`${BACKEND_URL}/api/companies/delete/${companyId}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${tokenBack}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      password,
    }),
  });

  if (!res.ok) {
    throw new Error("Failed to delete company");
  }

  const data = await res.json();
  if (data.error) {
    throw new Error("Failed to delete company");
  }

  revalidatePath("/onboarding");

  return true;
}

export async function createCompany({
  tokenBack,
  formData,
}: {
  tokenBack: string;
  formData: FormData;
}) {
  const res = await fetch(`${BACKEND_URL}/api/companies`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${tokenBack}`,
    },
    body: formData,
  });

  revalidatePath("/onboarding");

  if (!res.ok) {
    throw new Error("Failed to post companies");
  }
  const data = await res.json();
  if (data.error) {
    throw new Error("Failed to post companies");
  }
}

export async function updateCompany({
  tokenBack,
  companyId,
  formData,
}: {
  tokenBack: string;
  companyId?: number;
  formData: FormData;
}) {
  if (!companyId) return;
  const res = await fetch(`${BACKEND_URL}/api/companies/${companyId}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${tokenBack}`,
    },
    body: formData,
  });

  revalidatePath("/onboarding");

  if (!res.ok) {
    throw new Error("Failed to update company");
  }
}
