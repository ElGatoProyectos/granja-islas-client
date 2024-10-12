"use server";

import { authOptions } from "@/app/api/auth-options";
import { BACKEND_URL } from "@/constants/config";
import { TypePaginationNode, TypeResponseApi } from "@/types/api-response";
import { TypeReceipt } from "@/types/receipt";
import axios, { AxiosResponse } from "axios";
import { getServerSession } from "next-auth";
import { GetReceiptsSchema } from "../validations/search-params";
import { unstable_noStore as noStore } from "next/cache";
import { formatDate } from "@/utils/format-date";

export async function getReceipts(input: GetReceiptsSchema) {
  noStore();
  const {
    ruc,
    startYear,
    startMonth,
    endYear,
    endMonth,
    page,
    limit,
    num_serie,
    supplier_name,
    document_description,
    bill_status_payment,
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
      TypeResponseApi<TypePaginationNode<TypeReceipt[]>>
    > = await axios.get(`${BACKEND_URL}/api/documents`, {
      headers: {
        Authorization: `Bearer ${session.user.tokenBack}`,
        ruc,
      },
      params: {
        start,
        end,
        filter: num_serie,
        supplier_group_id: supplier_name,
        document_type: document_description,
        type_payment: bill_status_payment,
        page,
        limit,
      },
    });

    const { payload, error } = response.data;
    if (error) {
      throw new Error("No data found");
    }
    return payload;
  } catch (e) {
    console.error(e);
    throw new Error("Failed to get receipts");
  }
}

export async function getReceiptsForExcel(input: GetReceiptsSchema) {
  noStore();
  const {
    ruc,
    startYear,
    startMonth,
    endYear,
    endMonth,
    num_serie,
    supplier_name,
    document_description,
    bill_status_payment,
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
      TypeResponseApi<TypePaginationNode<TypeReceipt[]>>
    > = await axios.get(`${BACKEND_URL}/api/documents`, {
      headers: {
        Authorization: `Bearer ${session.user.tokenBack}`,
        ruc,
      },
      params: {
        start,
        end,
        filter: num_serie,
        supplier_group_id: supplier_name,
        document_type: document_description,
        type_payment: bill_status_payment,
        page: 1,
        limit: 10000,
      },
    });

    const {
      payload: { data },
      error,
    } = response.data;
    if (error) {
      throw new Error("No data found");
    }

    const formatNumbersAndDates = data.map((data) => ({
      ...data,
      base_igv: `${data.base_igv * 100}%`,
      issue_date: formatDate(data.issue_date),
      supplier_ruc: data.supplier_ruc,
      supplier_name: data.supplier_name,
      igv: data.igv,
      total: data.total,
      amount_base: data.amount_base,
      amount_paid: data.amount_paid,
      amount_pending: data.amount_pending,
    }));
    return formatNumbersAndDates;
  } catch (e) {
    console.error(e);
    throw new Error("Failed to get receipts");
  }
}
