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
import { responseSchema } from "@/lib/validations/response";
import { paginationSchema } from "@/lib/validations/pagination";
import { typesSpanishFormat } from "@/constants/type-document";

interface ReceiptContextType {
  receipts: ReceiptSchemaIN[];
  getReceipts: () => Promise<void>;
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
  idSupplier: string;
  setIdSupplier: Dispatch<SetStateAction<string>>;
  idsTypeDocument: string;
  setIdsTypeDocument: Dispatch<SetStateAction<string>>;
  supplierFilter: SupplierSchemaFilter[];
  exportExcel: () => any;
}

export const receiptContext = createContext<ReceiptContextType | null>(null);

export const ReceiptProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [receipts, setReceipts] = useState<ReceiptSchemaIN[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const { tokenBack } = useUserInfo();
  const { company } = useCompanySession();
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [search, setSearch] = useState("");
  const input = useDebounce(search);
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [idSupplier, setIdSupplier] = useState("");
  const [supplierFilter, setsupplierFilter] = useState<SupplierSchemaFilter[]>(
    []
  );
  const [idsTypeDocument, setIdsTypeDocument] = useState("");

  const getReceipts = useCallback(async () => {
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
      if (idsTypeDocument) queryParams.append("document_type", idsTypeDocument);

      const url = `${backend_url}/api/documents?${queryParams
        .toString()
        .replace(/%2C/g, ",")}`;

      const res = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${tokenBack}`,
          ruc: company.ruc,
        },
      });
      /* filters suppliers */
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
      /* filters suppliers */

      const resJSON = await res.json();
      const { error, payload } = responseSchema.parse(resJSON);
      if (error) {
        throw new Error("Error to fetch data receipts");
      }
      const {
        data,
        limit: MaxLimit,
        page,
        pageCount,
        total,
      } = paginationSchema.parse(payload);
      const formatdata = receiptArraySchemaIN.parse(data);
      const updatedDocuments = formatdata.map((document) => {
        const foundType = typesSpanishFormat.find(
          (type) => type.value === document.document_description
        );
        if (foundType) {
          document.document_description = foundType.label;
        }
        return document;
      });
      console.log(formatdata);

      setReceipts(updatedDocuments);
      setTotalPages(pageCount);
      setTotalElements(total);
      setCurrentPage(page);
      setLimit(MaxLimit);
    } catch (error) {
      throw new Error("Error to fetch data receipts");
    } finally {
      setLoading(false);
    }
  }, [
    company,
    tokenBack,
    currentPage,
    limit,
    input,
    month,
    year,
    idSupplier,
    idsTypeDocument,
  ]);

  useEffect(() => {
    getReceipts();
  }, [getReceipts]);

  const exportExcel = useCallback(async () => {
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

      const url = `${backend_url}/api/documents?${queryParams
        .toString()
        .replace(/%2C/g, ",")}`;

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
      const formatdata = receiptArraySchemaIN.parse(data.payload.data);

      setReceipts(formatdata);
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

  const value = useMemo(
    () => ({
      receipts,
      loading,
      getReceipts,
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
      exportExcel,
      idsTypeDocument,
      setIdsTypeDocument,
    }),
    [
      receipts,
      loading,
      getReceipts,
      limit,
      currentPage,
      totalPages,
      totalElements,
      search,
      month,
      year,
      idSupplier,
      supplierFilter,
      exportExcel,
      idsTypeDocument,
    ]
  );
  return (
    <receiptContext.Provider value={value}>{children}</receiptContext.Provider>
  );
};

export function useReceipt() {
  const context = useContext(receiptContext);
  if (!context) {
    throw new Error("useReceipt should be used inside of provider");
  }
  return context;
}
