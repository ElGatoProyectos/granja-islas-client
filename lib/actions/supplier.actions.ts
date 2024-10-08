"use server";

import { BACKEND_URL } from "@/constants/config";
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
    const res = await fetch(`${BACKEND_URL}/api/suppliers`, {
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

export async function updateSupplier({
  tokenBack,
  values,
  ruc,
  supplierID,
}: {
  tokenBack: string;
  values: CreateSupplierSchema;
  ruc?: string;
  supplierID?: number;
}) {
  if (!ruc) throw new Error("Need ruc for update");
  if (!supplierID) throw new Error("Need id for update");
  try {
    const res = await fetch(`${BACKEND_URL}/api/suppliers/${supplierID}`, {
      method: "PATCH",
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
