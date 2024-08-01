"use server";

import { backend_url } from "@/constants/config";
import { SupplierType } from "../validations/supplier";

export async function createSupplier({
  tokenBack,
  values,
  ruc,
}: {
  tokenBack: string;
  values: SupplierType;
  ruc?: string;
}) {
  if (!ruc) return;
  const formatSupplier = {
    ruc: values.ruc,
    business_name: values.corporate_name,
    business_type: values.type,
    business_status: values.status,
    business_direction: values.fiscal_address,
    phone: values.phone,
    country_code: values.country_code,
  };

  try {
    const res = await fetch(`${backend_url}/api/suppliers`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${tokenBack}`,
        ruc,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formatSupplier),
    });

    if (!res.ok) {
      throw new Error("Failed to post supplier");
    }

    const data = await res.json();

    if (data.error) {
      throw new Error("Failed backend to post supplier");
    }
  } catch (e) {
    console.error("Error to create data supplier", e);
  }
}
