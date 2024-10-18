"use server";

import { authOptions } from "@/app/api/auth-options";
import { BACKEND_URL } from "@/constants/config";
import { TypePaginationNode, TypeResponseApi } from "@/types/api-response";
import { TypeProductsOfSupplierTable, TypeSupplier } from "@/types/supplier";
import axios, { AxiosResponse } from "axios";
import { getServerSession } from "next-auth";
import { unstable_noStore as noStore } from "next/cache";
import { GetProductsOfSuppliersSchema } from "../validations/search-params";
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

export async function getSuppliers({ ruc }: { ruc: string }) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.tokenBack) {
    throw new Error("User session is not available.");
  }
  const response: AxiosResponse<TypeResponseApi<TypeSupplier[]>> =
    await axios.get(`${BACKEND_URL}/api/suppliers/no-pagination`, {
      headers: {
        Authorization: `Bearer ${session.user.tokenBack}`,
        ruc,
      },
    });
  const { payload, error } = response.data;
  if (error) {
    throw new Error("No data found");
  }
  return payload;
}

export async function getSupplier({ id, ruc }: { id: string; ruc: string }) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.tokenBack) {
    throw new Error("User session is not available.");
  }

  const response: AxiosResponse<TypeResponseApi<TypeSupplier>> =
    await axios.get(`${BACKEND_URL}/api/suppliers/${id}`, {
      headers: {
        Authorization: `Bearer ${session.user.tokenBack}`,
        ruc,
      },
    });
  const { payload, error } = response.data;
  if (error) {
    throw new Error("No data found");
  }
  return payload;
}

export async function getProductsOfSupplier(
  input: GetProductsOfSuppliersSchema
) {
  noStore();
  const {
    ruc,
    startYear,
    startMonth,
    endYear,
    endMonth,
    page,
    limit,
    title,
    product_labels,
    id_supplier,
  } = input;

  if (!ruc) {
    throw new Error("RUC is required.");
  }
  if (!startYear || !startMonth || !endYear || !endMonth) {
    throw new Error("Invalid date range.");
  }
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.tokenBack) {
    throw new Error("User session is not available.");
  }
  const start = `${startYear}-${startMonth}`;
  const end = `${endYear}-${endMonth}`;

  try {
    const response: AxiosResponse<
      TypeResponseApi<TypePaginationNode<TypeProductsOfSupplierTable[]>>
    > = await axios.get(
      `${BACKEND_URL}/api/suppliers/${id_supplier}/products`,
      {
        headers: {
          Authorization: `Bearer ${session.user.tokenBack}`,
          ruc,
        },
        params: {
          start,
          end,
          filter: title,
          label_group_id: product_labels,
          page,
          limit,
        },
      }
    );

    const { payload, error } = response.data;
    if (error) {
      throw new Error("No data found");
    }

    return payload;
  } catch (e) {
    console.error(e);
    throw new Error("Failed to get products of supplier");
  }
}

export async function getProductsOfSupplierForExcel(
  input: GetProductsOfSuppliersSchema
) {
  noStore();
  const {
    ruc,
    startYear,
    startMonth,
    endYear,
    endMonth,
    title,
    product_labels,
    id_supplier,
  } = input;

  if (!ruc) {
    throw new Error("RUC is required.");
  }
  if (!startYear || !startMonth || !endYear || !endMonth) {
    throw new Error("Invalid date range.");
  }
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.tokenBack) {
    throw new Error("User session is not available.");
  }
  const start = `${startYear}-${startMonth}`;
  const end = `${endYear}-${endMonth}`;

  try {
    const response: AxiosResponse<
      TypeResponseApi<TypePaginationNode<TypeProductsOfSupplierTable[]>>
    > = await axios.get(
      `${BACKEND_URL}/api/suppliers/${id_supplier}/products`,
      {
        headers: {
          Authorization: `Bearer ${session.user.tokenBack}`,
          ruc,
        },
        params: {
          start,
          end,
          filter: title,
          label_group_id: product_labels,
          page: 1,
          limit: 10000,
        },
      }
    );

    const { payload, error } = response.data;
    if (error) {
      throw new Error("No data found");
    }

    return payload.data;
  } catch (e) {
    console.error(e);
    throw new Error("Failed to get products of supplier");
  }
}
