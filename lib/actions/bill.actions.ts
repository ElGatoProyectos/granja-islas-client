"use server";
import { backend_url } from "@/constants/config";
import { BillSchemaCreate } from "../validations/receipt-forms/bill";

export async function createBill({
  ruc,
  tokenBack,
  jsonData,
}: {
  ruc?: string;
  tokenBack: string;
  jsonData: BillSchemaCreate;
}) {
  if (!ruc) return;

  const formatExchange_rate = Number(jsonData.exchange_rate ?? 1);
  const formatsupplier_id = Number(jsonData.supplier_id);
  const formatIGV = parseInt(jsonData.igv, 10) / 100;

  console.log("->", formatExchange_rate);
  const formatData = {
    ...jsonData,
    igv: formatIGV,
    issue_date: new Date(jsonData.issue_date),
    exchange_rate: formatExchange_rate,
    period: "2024-07",
    supplier_id: formatsupplier_id,
    amount_paid: 0,
    products: jsonData.products.map((data) => ({
      ...data,
      amount: Number(data.amount),
      price: Number(data.price),
    })),
  };

  try {
    const res = await fetch(`${backend_url}/api/bills/create`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${tokenBack}`,
        "Content-Type": "application/json",
        ruc,
      },
      body: JSON.stringify(formatData),
    });

    const data = await res.json();

    if (data.error) {
      throw new Error("Failed backend to create bill");
    }
  } catch (error) {
    throw new Error("Failed to create bill");
  }
}

export async function createCreditNote({
  ruc,
  tokenBack,
  jsonData,
}: {
  ruc?: string;
  tokenBack: string;
  jsonData: BillSchemaCreate;
}) {
  if (!ruc) return;

  const formatExchange_rate = Number(jsonData.exchange_rate ?? 1);
  const formatsupplier_id = Number(jsonData.supplier_id);
  console.log("->", formatExchange_rate);
  const formatData = {
    ...jsonData,
    issue_date: new Date(jsonData.issue_date),
    exchange_rate: formatExchange_rate,
    period: "2024-07",
    supplier_id: formatsupplier_id,
    amount_paid: 0,
    products: jsonData.products.map((data) => ({
      ...data,
      amount: Number(data.amount),
      price: Number(data.price),
    })),
  };

  console.log(formatData);

  try {
    const res = await fetch(`${backend_url}/api/bills/create`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${tokenBack}`,
        "Content-Type": "application/json",
        ruc,
      },
      body: JSON.stringify(formatData),
    });

    const data = await res.json();
    console.log(data);
    if (data.error) {
      throw new Error("Failed backend to create bill");
    }
  } catch (error) {
    throw new Error("Failed to create bill");
  }
}
