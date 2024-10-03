"use client";

import { BACKEND_URL } from "@/constants/config";
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
import { responseSchema } from "@/lib/validations/response";
import { paginationSchema } from "@/lib/validations/pagination";
import {
  documentsArrayOfLabel,
  formatDocumentsOfLabel,
  FormatDocumentsOfLabelType,
} from "@/lib/validations/label";
import { useParams } from "next/navigation";

interface DocumentLabelType {
  documents: FormatDocumentsOfLabelType[];
  getDocumentsOfLabel: () => Promise<void>;
  totalPages: number;
  totalElements: number;
  limit: number;
  setLimit: Dispatch<SetStateAction<number>>;
  currentPage: number;
  setCurrentPage: Dispatch<SetStateAction<number>>;
  month: string;
  setMonth: Dispatch<SetStateAction<string>>;
  year: string;
  setYear: Dispatch<SetStateAction<string>>;
  idSupplier: string;
  setIdSupplier: Dispatch<SetStateAction<string>>;
  supplierFilter: SupplierSchemaFilter[];
  loading: boolean;
  exportExcel: () => any;
}

export const DocumentLabelContext = createContext<DocumentLabelType | null>(
  null
);

export const DocumentLabelProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [documents, setDocuments] = useState<FormatDocumentsOfLabelType[]>([]);
  const { tokenBack } = useUserInfo();
  const { company } = useCompanySession();
  /* pagination */
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  /* filters */
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [idSupplier, setIdSupplier] = useState("");
  const [supplierFilter, setsupplierFilter] = useState<SupplierSchemaFilter[]>(
    []
  );
  const [loading, setloading] = useState(false);
  const { id } = useParams();

  const getDocumentsOfLabel = useCallback(async () => {
    if (!company) return;
    if (!tokenBack) return;
    setloading(true);

    const queryParams = new URLSearchParams();
    if (currentPage) queryParams.append("page", currentPage.toString());
    if (limit) queryParams.append("limit", limit.toString());
    if (month) queryParams.append("month", month);
    if (year) queryParams.append("year", year);
    if (idSupplier) queryParams.append("supplier_group_id", idSupplier);
    try {
      /* suppliers filter */
      const resSuppliers = await fetch(
        `${BACKEND_URL}/api/suppliers/no-pagination`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${tokenBack}`,
            ruc: company.ruc,
          },
        }
      );

      const dataSupp = await resSuppliers.json();
      const formatFilterSupplier = supplierArraySchemaFilter.parse(
        dataSupp.payload
      );
      setsupplierFilter(formatFilterSupplier);
      /* suppliers filter */

      const res = await fetch(
        `${BACKEND_URL}/api/labels/${id as string}/documents?${queryParams
          .toString()
          .replace(/%2C/g, ",")}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${tokenBack}`,
            ruc: company?.ruc,
          },
        }
      );

      const resJSON = await res.json();
      const { error, payload } = responseSchema.parse(resJSON);
      if (error) {
        throw new Error("Failed to fetch documents of label");
      }

      const {
        data,
        limit: MaxLimit,
        page,
        pageCount,
        total,
      } = paginationSchema.parse(payload);

      const parseDocumentsOfLabel = documentsArrayOfLabel.parse(data);
      const formatedData = formatDocumentsOfLabel(parseDocumentsOfLabel);
      setDocuments(formatedData);
      setTotalPages(pageCount);
      setTotalElements(total);
      setCurrentPage(page);
      setLimit(MaxLimit);
    } catch (error) {
      throw new Error("Failed to fetch documents of label");
    } finally {
      setloading(false);
    }
  }, [company, currentPage, id, idSupplier, limit, month, tokenBack, year]);

  useEffect(() => {
    getDocumentsOfLabel();
  }, [getDocumentsOfLabel]);

  const exportExcel = useCallback(async () => {
    if (!company) return;
    if (!tokenBack) return;
    setloading(true);
    const queryParams = new URLSearchParams();
    queryParams.append("page", "1");
    queryParams.append("limit", "10000");
    if (month) queryParams.append("month", month);
    if (year) queryParams.append("year", year);
    if (idSupplier) queryParams.append("supplier_group_id", idSupplier);
    try {
      const res = await fetch(
        `${BACKEND_URL}/api/labels/${id as string}/documents?${queryParams
          .toString()
          .replace(/%2C/g, ",")}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${tokenBack}`,
            ruc: company?.ruc,
          },
        }
      );

      const resJSON = await res.json();
      const { error, payload } = responseSchema.parse(resJSON);
      if (error) {
        throw new Error("Failed to fetch documents of label");
      }

      const { data } = paginationSchema.parse(payload);

      const parseDocumentsOfLabel = documentsArrayOfLabel.parse(data);
      const formatedData = formatDocumentsOfLabel(parseDocumentsOfLabel);
      return formatedData;
    } catch (error) {
      throw new Error("Failed to fetch documents of label");
    } finally {
      setloading(false);
    }
  }, [company, id, idSupplier, month, tokenBack, year]);

  const value = useMemo(
    () => ({
      documents,
      getDocumentsOfLabel,
      limit,
      setLimit,
      currentPage,
      setCurrentPage,
      totalPages,
      totalElements,
      setMonth,
      month,
      setYear,
      year,
      setIdSupplier,
      idSupplier,
      supplierFilter,
      loading,
      exportExcel,
    }),
    [
      documents,
      getDocumentsOfLabel,
      limit,
      currentPage,
      totalPages,
      totalElements,
      month,
      year,
      idSupplier,
      supplierFilter,
      loading,
      exportExcel,
    ]
  );
  return (
    <DocumentLabelContext.Provider value={value}>
      {children}
    </DocumentLabelContext.Provider>
  );
};

export function useLabelDocuments() {
  const context = useContext(DocumentLabelContext);
  if (!context) {
    throw new Error("useLabelDocuments should be used inside of provider");
  }
  return context;
}
