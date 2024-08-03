import { unstable_noStore as noStore } from "next/cache";
import { GetSupplierSchema } from "../validations/supplier";

export async function getSuppliers(input: GetSupplierSchema) {
  noStore();
  const { page, per_page, sort, title, status, priority, from, to } = input;

  try {
    return { data: [], pageCount: 0 };
  } catch (err) {
    return { data: [], pageCount: 0 };
  }
}
