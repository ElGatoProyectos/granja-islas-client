"use client";

import { BACKEND_URL } from "@/constants/config";
import { typesSpanishFormat } from "@/constants/type-document";
import { useDebounce } from "@/hooks/use-debounce";
import { getCompanyForRuc } from "@/lib/actions/company.actions";
import { paginationSchema } from "@/lib/validations/pagination";
import {
  receiptArraySchemaIN,
  ReceiptSchemaIN,
} from "@/lib/validations/receipt";
import { responseSchema } from "@/lib/validations/response";
import {
  supplierArraySchemaFilter,
  SupplierSchemaFilter,
} from "@/lib/validations/supplier";
import { getSuppliers } from "@/service/suppliers";
import { formatDate } from "@/utils/format-date";
import { getYearAndMonth } from "@/utils/getYearAndMonth";
import { useSearchParams } from "next/navigation";
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

  idSupplier: string;
  setIdSupplier: Dispatch<SetStateAction<string>>;
  idsTypeDocument: string;
  setIdsTypeDocument: Dispatch<SetStateAction<string>>;
  supplierFilter: SupplierSchemaFilter[];
  exportExcel: () => any;
  typesPayment: string;
  setTypesPayment: Dispatch<SetStateAction<string>>;
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
  const [idSupplier, setIdSupplier] = useState("");
  const [supplierFilter, setsupplierFilter] = useState<SupplierSchemaFilter[]>(
    []
  );
  const [idsTypeDocument, setIdsTypeDocument] = useState("");
  const [typesPayment, setTypesPayment] = useState("");

  const searchParams = useSearchParams();
  const [yearStarted, setYearStarted] = useState(
    Number(searchParams.get("year")) ?? new Date().getFullYear()
  );
  const [monthStarted, setMonthStarted] = useState(
    Number(searchParams.get("month")) ?? new Date().getMonth() + 1
  );
  const company_ruc = searchParams.get("ruc") ?? "";
  // useEffect(() => {
  //   if (company_ruc) {
  //     const getData = async () => {
  //       const company = await getCompanyForRuc({ ruc: company_ruc });
  //       const { yearStarted, monthStarted } = getYearAndMonth({
  //         dateString: company.emisor_electronico_desde,
  //       });
  //       setYearStarted(yearStarted);
  //       setMonthStarted(monthStarted);
  //     };
  //     getData();
  //   }
  // }, [company_ruc]);

  useEffect(() => {
    const year = searchParams.get("year");
    const month = searchParams.get("month");

    if (year) {
      setYearStarted(Number(year));
    }

    if (month) {
      setMonthStarted(Number(month));
    }
  }, [searchParams]);

  const getFilters = useCallback(async () => {
    if (!company) return;
    if (!tokenBack) return;
    const suppliers = await getSuppliers({ ruc: company.ruc, tokenBack });
    const formatFilterSupplier = supplierArraySchemaFilter.parse(
      suppliers.payload
    );
    setsupplierFilter(formatFilterSupplier);
  }, [company, tokenBack]);

  useEffect(() => {
    getFilters();
  }, [getFilters]);

  const getReceipts = useCallback(async () => {
    if (!company) return;
    if (!tokenBack) return;
    setLoading(true);

    try {
      const queryParams = new URLSearchParams();
      if (currentPage) queryParams.append("page", currentPage.toString());
      if (limit) queryParams.append("limit", limit.toString());
      if (input) queryParams.append("filter", input);
      if (monthStarted) queryParams.append("month", monthStarted.toString());
      if (yearStarted) queryParams.append("year", yearStarted.toString());
      if (idSupplier) queryParams.append("supplier_group_id", idSupplier);
      if (idsTypeDocument) queryParams.append("document_type", idsTypeDocument);
      if (typesPayment) queryParams.append("type_payment", typesPayment);

      const url = `${BACKEND_URL}/api/documents?${queryParams
        .toString()
        .replace(/%2C/g, ",")}`;

      const res = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${tokenBack}`,
          ruc: company.ruc,
        },
      });

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
        document.base_igv = document.base_igv * 100;
        return document;
      });

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
    monthStarted,
    yearStarted,
    idSupplier,
    idsTypeDocument,
    typesPayment,
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
      queryParams.append("page", "1");
      queryParams.append("limit", "10000");
      if (input) queryParams.append("filter", input);
      if (monthStarted) queryParams.append("month", monthStarted.toString());
      if (yearStarted) queryParams.append("year", yearStarted.toString());
      if (idSupplier) queryParams.append("supplier_group_id", idSupplier);

      const url = `${BACKEND_URL}/api/documents?${queryParams
        .toString()
        .replace(/%2C/g, ",")}`;

      const res = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${tokenBack}`,
          ruc: company.ruc,
        },
      });

      const resJSOn = await res.json();
      const { error, payload } = responseSchema.parse(resJSOn);
      if (error) {
        throw new Error("Failed to fetch receipts");
      }

      const { data } = paginationSchema.parse(payload);
      const formatdata = receiptArraySchemaIN.parse(data);
      const formatNumbersAndDates = formatdata.map((data) => ({
        ...data,
        base_igv: `${data.base_igv * 100}%`,
        issue_date: formatDate(data.issue_date),
        ruc: data.Supplier.ruc,
        business_name: data.Supplier.business_name,
        igv: data.igv,
        total: data.total,
        amount_base: data.amount_base,
        amount_paid: data.amount_paid,
        amount_pending: data.amount_pending,
      }));

      return formatNumbersAndDates;
    } catch (error) {
      throw new Error("Failed to fetch receipts");
    } finally {
      setLoading(false);
    }
  }, [company, tokenBack, input, monthStarted, yearStarted, idSupplier]);

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

      setIdSupplier,
      idSupplier,
      supplierFilter,
      exportExcel,
      idsTypeDocument,
      setIdsTypeDocument,
      typesPayment,
      setTypesPayment,
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
      idSupplier,
      supplierFilter,
      exportExcel,
      idsTypeDocument,
      typesPayment,
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
