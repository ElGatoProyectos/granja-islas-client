import { BACKEND_URL } from "@/constants/config";

export async function getSuppliers({
  tokenBack,
  ruc,
}: {
  ruc: string;
  tokenBack: string;
}) {
  const urlSuppliers = `${BACKEND_URL}/api/suppliers/no-pagination`;
  const resSuppliers = await fetch(urlSuppliers, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${tokenBack}`,
      ruc,
    },
  });

  return await resSuppliers.json();
}
