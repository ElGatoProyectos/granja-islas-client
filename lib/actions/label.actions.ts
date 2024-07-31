"use server";

import { backend_url } from "@/constants/config";

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
    const res = await fetch(`${backend_url}/api/labels`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${tokenBack}`,
        "Content-Type": "application/json",
        ruc,
      },
      body: JSON.stringify({ title }),
    });

    if (!res.ok) {
      throw new Error("Failed to fetch labels");
    }

    const data = await res.json();
    if (data.error) {
      throw new Error("Failed backend to fetch labels");
    }
  } catch (error) {
    console.error("Error to fetch data labels", error);
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
    const res = await fetch(`${backend_url}/api/labels/${idLabel}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${tokenBack}`,
        ruc,
      },
    });

    if (!res.ok) {
      throw new Error("Failed to delete label");
    }

    const data = await res.json();
    if (data.error) {
      throw new Error("Failed backend to delete label");
    }
  } catch (error) {
    console.error("Error to delete data label", error);
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
    const res = await fetch(`${backend_url}/api/labels/${idLabel}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${tokenBack}`,
        ruc,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title }),
    });

    if (!res.ok) {
      throw new Error("Failed to update label");
    }

    const data = await res.json();
    if (data.error) {
      throw new Error("Failed backend to update label");
    }
  } catch (error) {
    console.error("Error to update data label", error);
  }
}
