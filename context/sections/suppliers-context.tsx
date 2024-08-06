"use client";

import { backend_url } from "@/constants/config";
import { useSuppliers } from "@/hooks/useSuppliers";
import { SupplierSchemaIN } from "@/lib/validations/supplier";
import { UserSchemaIN } from "@/lib/validations/user";
import { useSession } from "next-auth/react";
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
import { useUserInfo } from "../user-context";
import { useCompanySession } from "../company-context";
import { useDebounce } from "@/hooks/use-debounce";

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
  const [perPage, setPerPage] = useState(10);
  const { tokenBack } = useUserInfo();
  const { company } = useCompanySession();
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [search, setSearch] = useState("");
  const input = useDebounce(search);

  const getSuppliers = useCallback(async () => {
    if (!company) return;
    if (!tokenBack) return;
    setLoading(true);

    try {
      const queryParams = new URLSearchParams();
      if (page) queryParams.append("page", page.toString());
      if (perPage) queryParams.append("limit", perPage.toString());
      if (input) queryParams.append("name", input);

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
  }, [company, input, page, perPage, tokenBack]);

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
      setSearch,
      search,
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
