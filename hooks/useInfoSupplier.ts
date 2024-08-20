import { backend_url } from "@/constants/config";
import { useCompanySession } from "@/context/company-context";
import { useUserInfo } from "@/context/user-context";
import { responseSchema } from "@/lib/validations/response";
import { SupplierSchemaIN, supplierSchemaIN } from "@/lib/validations/supplier";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export function useInfoSupplier() {
  const { tokenBack } = useUserInfo();
  const { company } = useCompanySession();
  const { id } = useParams();

  const [supplier, setSupplier] = useState<SupplierSchemaIN>();

  const getInfoSupplier = useCallback(async () => {
    if (!company) return;
    if (!tokenBack) return;
    if (!id) return;
    const url = `${backend_url}/api/suppliers/${id}`;

    const res = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${tokenBack}`,
        ruc: company.ruc,
      },
    });
    const resJSON = await res.json();

    const { error, payload } = responseSchema.parse(resJSON);
    if (error) {
      throw new Error("error to fetch supplier details");
    }

    const parseData = supplierSchemaIN.parse(payload);
    setSupplier(parseData);
  }, [company, id, tokenBack]);

  useEffect(() => {
    getInfoSupplier();
  }, [getInfoSupplier]);

  return { supplier };
}
