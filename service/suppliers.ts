import { backend_url } from "@/constants/config";

export async function getSuppliers({
  tokenBack,
  ruc,
}: {
  ruc: string;
  tokenBack: string;
}) {
  const urlSuppliers = `${backend_url}/api/suppliers/no-pagination`;
  const resSuppliers = await fetch(urlSuppliers, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${tokenBack}`,
      ruc,
    },
  });

  return await resSuppliers.json();
}
