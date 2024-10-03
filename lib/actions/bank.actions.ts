"use server";

import { BACKEND_URL } from "@/constants/config";

export async function createBank({
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
    const res = await fetch(`${BACKEND_URL}/api/banks`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${tokenBack}`,
        "Content-Type": "application/json",
        ruc,
      },
      body: JSON.stringify({ title }),
    });

    if (!res.ok) {
      throw new Error("Failed to fetch banks");
    }

    const data = await res.json();
    if (data.error) {
      throw new Error("Failed backend to fetch banks");
    }
  } catch (error) {
    console.error("Error to fetch data banks", error);
  }
}

export async function deleteBank({
  ruc,
  tokenBack,
  idBank,
}: {
  ruc?: string;
  tokenBack: string;
  idBank: string;
}) {
  if (!ruc) return;
  try {
    const res = await fetch(`${BACKEND_URL}/api/banks/${idBank}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${tokenBack}`,
        ruc,
      },
    });

    const data = await res.json();
    if (data.error) {
      throw new Error("Failed backend to delete bank");
    }
  } catch (error) {
    throw new Error("Failed to delete bank");
  }
}

export async function updateBank({
  ruc,
  tokenBack,
  idBank,
  title,
}: {
  ruc?: string;
  tokenBack: string;
  idBank: string;
  title: string;
}) {
  if (!ruc) return;
  try {
    const res = await fetch(`${BACKEND_URL}/api/banks/${idBank}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${tokenBack}`,
        ruc,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title }),
    });

    if (!res.ok) {
      throw new Error("Failed to update bank");
    }

    const data = await res.json();
    if (data.error) {
      throw new Error("Failed backend to update bank");
    }
  } catch (error) {
    console.error("Error to update data bank", error);
  }
}
