"use client";

import { backend_url } from "@/constants/config";
import {
  supplierArraySchemaFilter,
  SupplierSchemaFilter,
} from "@/lib/validations/supplier";
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
import {
  receiptArraySchemaIN,
  ReceiptSchemaIN,
} from "@/lib/validations/receipt";

interface PaymentContextType {
  payments: ReceiptSchemaIN[];
  getPayments: () => Promise<void>;
  loading: boolean;
  totalPages: number;
  totalElements: number;
  limit: number;
  setLimit: Dispatch<SetStateAction<number>>;
  currentPage: number;
  setCurrentPage: Dispatch<SetStateAction<number>>;
  search: string;
  setSearch: Dispatch<SetStateAction<string>>;
  month: string;
  setMonth: Dispatch<SetStateAction<string>>;
  year: string;
  setYear: Dispatch<SetStateAction<string>>;
}

export const PaymentContext = createContext<PaymentContextType | null>(null);

export const PaymentProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { tokenBack } = useUserInfo();
  const { company } = useCompanySession();
  const [payments, setPayments] = useState<ReceiptSchemaIN[]>([]);
  const [loading, setLoading] = useState(false);
  /* pagination */
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  /* filters */
  const [search, setSearch] = useState("");
  const input = useDebounce(search);
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [idSupplier, setIdSupplier] = useState("");
  const [supplierFilter, setsupplierFilter] = useState<SupplierSchemaFilter[]>(
    []
  );

  const getPayments = useCallback(async () => {
    if (!company) return;
    if (!tokenBack) return;
    setLoading(true);

    try {
      const queryParams = new URLSearchParams();
      if (currentPage) queryParams.append("page", currentPage.toString());
      if (limit) queryParams.append("limit", limit.toString());
      if (input) queryParams.append("filter", input);
      if (month) queryParams.append("month", month);
      if (year) queryParams.append("year", year);
      if (idSupplier) queryParams.append("supplier_group_id", idSupplier);

      const url = `${backend_url}/api/labels/report?${queryParams
        .toString()
        .replace(/%2C/g, ",")}`;

      console.log("url", url);

      const res = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${tokenBack}`,
          ruc: company.ruc,
        },
      });

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
      setsupplierFilter(formatFilterSupplier);

      const data = await res.json();
      console.log(data);
      const formatdata = receiptArraySchemaIN.parse(data.payload.data);

      setPayments(formatdata);
      setTotalPages(data.payload.pageCount);
      setTotalElements(data.payload.total);
      setCurrentPage(data.payload.page);
      setLimit(data.payload.limit);
    } catch (error) {
      console.error("Error to fetch data receipts", error);
    } finally {
      setLoading(false);
    }
  }, [company, tokenBack, currentPage, limit, input, month, year, idSupplier]);

  useEffect(() => {
    getPayments();
  }, [getPayments]);

  const value = useMemo(
    () => ({
      payments,
      loading,
      getPayments,
      limit,
      setLimit,
      currentPage,
      setCurrentPage,
      totalPages,
      totalElements,
      setSearch,
      search,
      setMonth,
      month,
      setYear,
      year,
      setIdSupplier,
      idSupplier,
      supplierFilter,
    }),
    [
      payments,
      loading,
      getPayments,
      limit,
      currentPage,
      totalPages,
      totalElements,
      search,
      month,
      year,
      idSupplier,
      supplierFilter,
    ]
  );
  return (
    <PaymentContext.Provider value={value}>{children}</PaymentContext.Provider>
  );
};

export function usePayment() {
  const context = useContext(PaymentContext);
  if (!context) {
    throw new Error("useList should be used inside of provider");
  }
  return context;
}
