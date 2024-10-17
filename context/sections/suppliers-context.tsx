"use client";

import { BACKEND_URL } from "@/constants/config";
import { useDebounce } from "@/hooks/use-debounce";
import { SupplierSchemaIN } from "@/lib/validations/supplier";
import {
  createContext,
  Dispatch,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useCompanySession } from "../company-context";
import { useUserInfo } from "../user-context";
import { toast } from "sonner";

interface UserContextType {
  suppliers: SupplierSchemaIN[];
  loadingSuppliers: boolean;
  getSuppliers: () => Promise<void>;
  perPage: number;
  page: number;
  setPerPage: Dispatch<SetStateAction<number>>;
  setPage: Dispatch<SetStateAction<number>>;
  totalPages: number;
  totalElements: number;
  setSearch: Dispatch<SetStateAction<string>>;
  search: string;
  setStatusSupp: Dispatch<SetStateAction<string>>;
  exportExcel: () => any;
  syncSuppliersData: () => void;
}

export const supplierContext = createContext<UserContextType | null>(null);
export const SupplierProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [suppliers, setSuppliers] = useState<SupplierSchemaIN[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(9);
  const { tokenBack } = useUserInfo();
  const { company } = useCompanySession();
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [search, setSearch] = useState("");
  const input = useDebounce(search);
  const [statusSupp, setStatusSupp] = useState("");

  const getSuppliers = useCallback(async () => {
    if (!company) return;
    if (!tokenBack) return;
    setLoading(true);

    try {
      const queryParams = new URLSearchParams();
      if (page) queryParams.append("page", page.toString());
      if (perPage) queryParams.append("limit", perPage.toString());
      if (input) queryParams.append("name", input);
      if (statusSupp) queryParams.append("status_group", statusSupp);

      const url = `${BACKEND_URL}/api/suppliers?${queryParams.toString()}`;

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
      throw new Error("Failed to fetch suppliers");
    } finally {
      setLoading(false);
    }
  }, [company, input, page, perPage, statusSupp, tokenBack]);

  useEffect(() => {
    getSuppliers();
  }, [getSuppliers]);

  const exportExcel = useCallback(async () => {
    if (!company) return;
    if (!tokenBack) return;
    setLoading(true);

    try {
      const queryParams = new URLSearchParams();
      queryParams.append("page", "1");
      queryParams.append("limit", "10000");
      if (input) queryParams.append("name", input);
      if (statusSupp) queryParams.append("status_group", statusSupp);

      const url = `${BACKEND_URL}/api/suppliers?${queryParams.toString()}`;

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

      return data.payload.data;
    } catch (error) {
      throw new Error("Failed to fetch suppliers");
    } finally {
      setLoading(false);
    }
  }, [company, input, statusSupp, tokenBack]);

  const syncSuppliersData = useCallback(async () => {
    if (!company) return;
    if (!tokenBack) return;
    setLoading(true);

    try {
      const url = `${BACKEND_URL}/api/sunat/synchronize-suppliers`;

      const res = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${tokenBack}`,
          ruc: company.ruc,
        },
      });

      if (!res.ok) {
        throw new Error("Failed to sync suppliers");
      }

      const data = await res.json();

      if (data.error) {
        throw new Error("Failed to sync suppliers");
      }
      toast.success(`Se actualizaron los datos con exito`);
      getSuppliers();
    } catch (error) {
      toast.error(`Ocurrio un error actualizar los datos`);
      throw new Error("Failed to sync suppliers");
    } finally {
      setLoading(false);
    }
  }, [company, getSuppliers, tokenBack]);

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
      setSearch,
      search,
      setStatusSupp,
      exportExcel,
      syncSuppliersData,
    }),
    [
      getSuppliers,
      loading,
      page,
      perPage,
      search,
      suppliers,
      totalElements,
      totalPages,
      setStatusSupp,
      exportExcel,
      syncSuppliersData,
    ]
  );
  return (
    <supplierContext.Provider value={value}>
      {children}
    </supplierContext.Provider>
  );
};

export function useSupplier() {
  const context = useContext(supplierContext);
  if (!context) {
    throw new Error("useSupplier should be used inside of provider");
  }
  return context;
}
