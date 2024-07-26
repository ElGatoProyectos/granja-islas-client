"use client";

import { FormattedCompany } from "@/types";
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
  company: FormattedCompany | null;
  setCompany: Dispatch<SetStateAction<FormattedCompany | null>>;
}

export const CompanyContext = createContext<CompanyContextType | null>(null);

export const CompanyProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [company, setCompany] = useState<FormattedCompany | null>(null);

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

  const value = useMemo(() => ({ company, setCompany }), [company]);
  return (
    <CompanyContext.Provider value={value}>{children}</CompanyContext.Provider>
  );
};

export function useCompanySession() {
  const context = useContext(CompanyContext);
  if (!context) {
    throw new Error("useCompany should be used inside of provider");
  }
  return context;
}
