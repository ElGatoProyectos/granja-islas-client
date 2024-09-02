"use client";

import { CompanySchemaIN } from "@/lib/validations/auth/company";
import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

interface CompanyContextType {
  company: CompanySchemaIN | null;
  setCompany: Dispatch<SetStateAction<CompanySchemaIN | null>>;
  companyURL: string;
  setCompanyURL: Dispatch<SetStateAction<string>>;
}

export const CompanyContext = createContext<CompanyContextType | null>(null);

export const CompanyProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [company, setCompany] = useState<CompanySchemaIN | null>(null);
  const [companyURL, setCompanyURL] = useState("");

  // const getCompanies = useCallback(async () => {
  //   try {
  //     const res = await fetch(`${backend_url}/api/companies`, {
  //       method: "GET",
  //       headers: {
  //         Authorization: `Bearer ${tokenBack}`,
  //       },
  //     });

  //     if (!res.ok) {
  //       throw new Error("Failed to fetch companies");
  //     }

  //     const data = await res.json();
  //     const parseData = responseArraySchema.parse(data);
  //     const parseCompany = companyArraySchemaIN.parse(parseData.payload);
  //   } catch (error) {
  //     console.error("Error to fetch data", error);
  //   }
  // }, [tokenBack]);
  // useEffect(() => {
  //   getCompanies();
  // }, [getCompanies]);

  useEffect(() => {
    const storedCompany = localStorage.getItem("selectedCompany");
    if (storedCompany) {
      setCompany(JSON.parse(storedCompany));
    }
  }, []);

  useEffect(() => {
    if (company) {
      localStorage.setItem("selectedCompany", JSON.stringify(company));
    } else {
      localStorage.removeItem("selectedCompany");
    }
  }, [company]);

  const value = useMemo(
    () => ({ company, setCompany, companyURL, setCompanyURL }),
    [company, companyURL]
  );
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
