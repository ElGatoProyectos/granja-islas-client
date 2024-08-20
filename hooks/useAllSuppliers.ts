import { backend_url } from "@/constants/config";
import { useCompanySession } from "@/context/company-context";
import { useUserInfo } from "@/context/user-context";
import {
  supplierArraySchemaFilter,
  SupplierSchemaFilter,
} from "@/lib/validations/supplier";
import { useCallback, useEffect, useState } from "react";

export function useAllSuppliers() {
  const { tokenBack } = useUserInfo();
  const { company } = useCompanySession();
  const [totalSuppliers, setTotalSuppliers] = useState<SupplierSchemaFilter[]>(
    []
  );

  const getAllSuppliers = useCallback(async () => {
    if (!company) return;
    if (!tokenBack) return;
    const urlSuppliers = `${backend_url}/api/suppliers/no-pagination`;
    const resSuppliers = await fetch(urlSuppliers, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${tokenBack}`,
        ruc: company.ruc,
      },
    });

    const dataSupp = await resSuppliers.json();
    const formatFilterSupplier = supplierArraySchemaFilter.parse(
      dataSupp.payload
    );
    setTotalSuppliers(formatFilterSupplier);
  }, [company, tokenBack]);

  useEffect(() => {
    getAllSuppliers();
  }, [getAllSuppliers]);

  return { totalSuppliers };
}
