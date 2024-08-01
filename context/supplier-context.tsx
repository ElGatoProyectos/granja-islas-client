"use client";

import { backend_url } from "@/constants/config";
import { UserTypeIn } from "@/types";

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
import { useCompanySession } from "./company-context";
import { SupplierTypeIn } from "@/components/suppliers/data-table/supplier-schema-table";
import { useUserInfo } from "./user-context";

interface SupplierContextType {
  suppliers: SupplierTypeIn[];
  loadingSuppliers: boolean;
  getSuppliers: any;
}

export const supplierContext = createContext<SupplierContextType | null>(null);

export const SupplierProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [suppliers, setSuppliers] = useState<SupplierTypeIn[]>([]);
  const [loading, setLoading] = useState(false);
  const { tokenBack } = useUserInfo();
  const { company } = useCompanySession();

  const getSuppliers = useCallback(async () => {
    if (!company) return;
    if (!tokenBack) return;
    setLoading(true);

    try {
      const res = await fetch(`${backend_url}/api/suppliers`, {
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

      setSuppliers(data.payload.data.reverse());
    } catch (error) {
      console.error("Error to fetch data suppliers", error);
    } finally {
      setLoading(false);
    }
  }, [company, tokenBack]);

  useEffect(() => {
    getSuppliers();
  }, [getSuppliers]);

  const value = useMemo(
    () => ({
      suppliers,
      loadingSuppliers: loading,
      getSuppliers,
    }),
    [getSuppliers, loading, suppliers]
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
