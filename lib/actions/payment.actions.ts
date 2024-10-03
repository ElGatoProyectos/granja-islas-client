"use server";

import { BACKEND_URL } from "@/constants/config";

export async function createPayment({
  ruc,
  tokenBack,
  formData,
}: {
  ruc?: string;
  tokenBack: string;
  formData: FormData;
}) {
  if (!ruc) throw new Error("Failed needs ruc");

  try {
    const res = await fetch(`${BACKEND_URL}/api/vouchers`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${tokenBack}`,
        ruc,
      },
      body: formData,
    });

    const data = await res.json();
    if (data.error) {
      throw new Error("Failed backend to create payment");
    }
  } catch (error) {
    throw new Error("Failed to create payment");
  }
}
