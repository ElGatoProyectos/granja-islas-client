"use server";

import { backend_url } from "@/constants/config";
import { CreateSupplierSchema } from "../validations/supplier";

export async function createSupplier({
  tokenBack,
  values,
  ruc,
}: {
  tokenBack: string;
  values: CreateSupplierSchema;
  ruc?: string;
}) {
  if (!ruc) return;

  try {
    const res = await fetch(`${backend_url}/api/suppliers`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${tokenBack}`,
        ruc,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });

    const data = await res.json();

    if (data.error) {
      throw {
        message: "Failed backend to post supplier",
        details: data.message,
        code: 500,
      };
    }
  } catch (e: any) {
    throw new Error(e.details);
  }
}
