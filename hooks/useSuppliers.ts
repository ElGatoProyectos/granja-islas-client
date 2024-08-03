import { SupplierTypeIn } from "@/components/suppliers/data-table/supplier-schema-table";
import { backend_url } from "@/constants/config";
import { useCompanySession } from "@/context/company-context";
import { useUserInfo } from "@/context/user-context";
import { useCallback, useEffect, useMemo, useState } from "react";

export function useSuppliers() {
  const [suppliers, setSuppliers] = useState<SupplierTypeIn[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const { tokenBack } = useUserInfo();
  const { company } = useCompanySession();
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);

  const getSuppliers = useCallback(async () => {
    if (!company) return;
    if (!tokenBack) return;
    setLoading(true);

    try {
      const queryParams = new URLSearchParams();
      if (page) queryParams.append("page", page.toString());
      if (perPage) queryParams.append("limit", perPage.toString());

      const url = `${backend_url}/api/suppliers?${queryParams.toString()}`;

      const res = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${tokenBack}`,
          ruc: company.ruc,
        },
      });

      if (!res.ok) {
        throw new Error("Failed to fetch suppliers");
      }

      const data = await res.json();

      setTotalPages(data.payload.pageCount);
      setTotalElements(data.payload.total);
      setPage(data.payload.page);
      setPerPage(data.payload.limit);
      setSuppliers(data.payload.data);
    } catch (error) {
      console.error("Error to fetch data suppliers", error);
    } finally {
      setLoading(false);
    }
  }, [company, page, perPage, tokenBack]);

  useEffect(() => {
    getSuppliers();
  }, [getSuppliers]);

  const value = useMemo(
    () => ({
      suppliers,
      loadingSuppliers: loading,
      getSuppliers,
      perPage,
      page,
      setPerPage,
      setPage,
      totalPages,
      totalElements,
    }),
    [getSuppliers, loading, page, perPage, suppliers, totalElements, totalPages]
  );

  return value;
}
