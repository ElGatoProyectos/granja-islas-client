"use client";

import { CompanySchemaIN } from "@/lib/validations/auth/company";
import { useSearchParams, useRouter } from "next/navigation";
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

interface CompanyContextType {
  company: CompanySchemaIN | null;
  setCompany: Dispatch<SetStateAction<CompanySchemaIN | null>>;
}

export const CompanyContext = createContext<CompanyContextType | null>(null);

export const CompanyProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [company, setCompany] = useState<CompanySchemaIN | null>(null);
  const router = useRouter();
  // const searchParams = useSearchParams();
  // const createQueryString = useCallback(
  //   (params: Record<string, string | number | null>) => {
  //     const newSearchParams = new URLSearchParams(searchParams?.toString());

  //     for (const [key, value] of Object.entries(params)) {
  //       if (
  //         value === null ||
  //         (typeof value === "string" && value.trim() === "")
  //       ) {
  //         newSearchParams.delete(key);
  //       } else {
  //         newSearchParams.set(key, String(value));
  //       }
  //     }

  //     return newSearchParams.toString();
  //   },
  //   [searchParams]
  // );

  useEffect(() => {
    const storedCompany = localStorage.getItem("selectedCompany");
    if (storedCompany) {
      setCompany(JSON.parse(storedCompany));
    }
  }, []);

  useEffect(() => {
    if (company) {
      localStorage.setItem("selectedCompany", JSON.stringify(company));

      // // Aquí agregamos el ruc a la URL como query param
      // const queryString = createQueryString({ ruc: company.ruc });
      // router.replace(`?${queryString}`); // Modifica la URL sin recargar la página
    } else {
      localStorage.removeItem("selectedCompany");
    }
  }, [company, router]);

  const value = useMemo(() => ({ company, setCompany }), [company]);
  return (
    <CompanyContext.Provider value={value}>{children}</CompanyContext.Provider>
  );
};

export function useCompanySession() {
  const context = useContext(CompanyContext);
  if (!context) {
    throw new Error("useCompanySession should be used inside of provider");
  }
  return context;
}
