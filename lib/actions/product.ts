"use server";

import { authOptions } from "@/app/api/auth-options";
import { BACKEND_URL } from "@/constants/config";
import { TypePaginationNode, TypeResponseApi } from "@/types/api-response";
import { TypeProductTable, TypeProductTableFormat } from "@/types/product";
import axios, { AxiosResponse } from "axios";
import { getServerSession } from "next-auth";
import { unstable_noStore as noStore, revalidatePath } from "next/cache";
import { GetProductsSchema } from "../validations/search-params";
import { formatWithCommas } from "@/utils/format-number-comas";
import { formatDate } from "@/utils/format-date";

export async function getProducts(
  input: GetProductsSchema
): Promise<TypePaginationNode<TypeProductTableFormat[]>> {
  noStore();
  const {
    ruc,
    startYear,
    startMonth,
    endYear,
    endMonth,
    page,
    limit,
    supplier_name,
    title,
    labels,
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
      TypeResponseApi<TypePaginationNode<TypeProductTable[]>>
    > = await axios.get(`${BACKEND_URL}/api/products/report`, {
      headers: {
        Authorization: `Bearer ${session.user.tokenBack}`,
        ruc,
      },
      params: {
        start,
        end,
        supplier_group_id: supplier_name,
        filter: title,
        label_group_id: labels,
        page,
        limit,
      },
    });
    console.log(response);

    const { payload, error } = response.data;
    if (error) {
      console.log(error);
      throw new Error("No data found");
    }

    const newFormat = payload.data.map(({ Supplier, ...rest }) => ({
      ...rest,
      supplier_name: Supplier.business_name,
    }));
    const newPayload: TypePaginationNode<TypeProductTableFormat[]> = {
      ...payload,
      data: newFormat,
    };
    return newPayload;
  } catch (e) {
    console.error(e);
    throw new Error("Failed to get products table");
  }
}

export async function getProductsForExcel(input: GetProductsSchema) {
  noStore();
  const {
    ruc,
    startYear,
    startMonth,
    endYear,
    endMonth,
    supplier_name,
    title,
    labels,
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
  console.log(title);
  try {
    const response: AxiosResponse<
      TypeResponseApi<TypePaginationNode<TypeProductTable[]>>
    > = await axios.get(`${BACKEND_URL}/api/products/report`, {
      headers: {
        Authorization: `Bearer ${session.user.tokenBack}`,
        ruc,
      },
      params: {
        start,
        end,
        supplier_group_id: supplier_name,
        filter: title,
        label_group_id: labels,
        page: 1,
        limit: 10000,
      },
    });

    const { payload, error } = response.data;
    if (error) {
      throw new Error("No data found");
    }
    const newFormat = payload.data.map(({ Supplier, ...rest }) => ({
      ...rest,
      supplier_name: Supplier.business_name,
    }));
    const newPayload: TypePaginationNode<TypeProductTableFormat[]> = {
      ...payload,
      data: newFormat,
    };

    const formatNumbersAndDates = newPayload.data.map((data) => ({
      ...data,
      issue_date: formatDate(data.issue_date),
      supplier_name: data.supplier_name,
      amount: formatWithCommas(data.amount),
      price: formatWithCommas(data.price),
      igv: formatWithCommas(data.igv ?? ""),
      total: formatWithCommas(data.total ?? ""),
    }));
    return formatNumbersAndDates;
  } catch (e) {
    console.error(e);
    throw new Error("Failed to get products table");
  }
}

export async function assignLabelToProduct({
  ruc,
  id_product,
  label_id,
}: {
  ruc: string;
  id_product: number;
  label_id: number[];
}) {
  if (!ruc) {
    throw new Error("RUC is required.");
  }
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.tokenBack) {
    throw new Error("User session is not available.");
  }
  try {
    const { data } = await axios.post(
      `${BACKEND_URL}/api/products/${id_product}/labels`,
      {
        label_id,
      },
      {
        headers: {
          Authorization: `Bearer ${session.user.tokenBack}`,
          ruc,
        },
      }
    );
    console.log(data);
    revalidatePath("/dashboard/products");

    return data;
  } catch (e) {
    console.error(e);
    throw new Error("Error to assign label to product");
  }
}
