"use server";

import { authOptions } from "@/app/api/auth-options";
import { BACKEND_URL } from "@/constants/config";
import { TypeResponseApi } from "@/types/api-response";
import { TypeLabel } from "@/types/label";
import axios, { AxiosResponse } from "axios";
import { getServerSession } from "next-auth";

export async function createLabel({
  ruc,
  tokenBack,
  title,
}: {
  ruc?: string;
  tokenBack: string;
  title: string;
}) {
  if (!ruc) return;
  try {
    const res = await fetch(`${BACKEND_URL}/api/labels`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${tokenBack}`,
        "Content-Type": "application/json",
        ruc,
      },
      body: JSON.stringify({ title }),
    });

    if (!res.ok) {
      throw new Error("Failed to create labels");
    }

    const data = await res.json();
    if (data.error) {
      throw new Error("Failed backend to create labels");
    }
  } catch (error) {
    throw new Error("Failed to create label");
  }
}

export async function deleteLabel({
  ruc,
  tokenBack,
  idLabel,
}: {
  ruc?: string;
  tokenBack: string;
  idLabel: string;
}) {
  if (!ruc) return;
  try {
    const res = await fetch(`${BACKEND_URL}/api/labels/${idLabel}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${tokenBack}`,
        ruc,
      },
    });

    const data = await res.json();
    if (data.error) {
      throw {
        message: "Failed backend to delete label",
        details: data.message,
        code: 500,
      };
    }
  } catch (e: any) {
    throw new Error(e.details);
  }
}

export async function updateLabel({
  ruc,
  tokenBack,
  idLabel,
  title,
}: {
  ruc?: string;
  tokenBack: string;
  idLabel: string;
  title: string;
}) {
  if (!ruc) return;
  try {
    const res = await fetch(`${BACKEND_URL}/api/labels/${idLabel}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${tokenBack}`,
        ruc,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title }),
    });

    const data = await res.json();
    if (data.error) {
      throw new Error("Failed backend to update label");
    }
  } catch (error) {
    throw new Error("Failed to update label");
  }
}

export async function getLabels({ company_ruc }: { company_ruc: string }) {
  const session = await getServerSession(authOptions);

  try {
    const { data }: AxiosResponse<TypeResponseApi<TypeLabel[]>> =
      await axios.get(`${BACKEND_URL}/api/labels`, {
        headers: {
          Authorization: `Bearer ${session.user.tokenBack}`,
          ruc: company_ruc,
        },
      });
    return data;
  } catch (e) {
    console.error(e);
    throw new Error("Failed to get labels");
  }
}
