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
import { useDebounce } from "@/hooks/use-debounce";
import { responseSchema } from "@/lib/validations/response";
import { listsArraySchemaIN, ListsSchemaIN } from "@/lib/validations/list";
import { paginationSchema } from "@/lib/validations/pagination";
import { formatWithCommas } from "@/utils/format-number-comas";
import { formatDate } from "@/utils/format-date";

interface ListContextType {
  lists: ListsSchemaIN[];
  getLists: () => Promise<void>;
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
  supplierFilter: SupplierSchemaFilter[];
  exportExcel: () => any;
}

export const ListContext = createContext<ListContextType | null>(null);

export const ListProvider = ({ children }: { children: React.ReactNode }) => {
  const { tokenBack } = useUserInfo();
  const { company } = useCompanySession();
  const [lists, setLists] = useState<ListsSchemaIN[]>([]);
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

  const getLists = useCallback(async () => {
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

      const url = `${BACKEND_URL}/api/labels/report?${queryParams
        .toString()
        .replace(/%2C/g, ",")}`;

      const res = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${tokenBack}`,
          ruc: company.ruc,
        },
      });

      /* filter suppliers */
      const urlSuppliers = `${BACKEND_URL}/api/suppliers/no-pagination`;
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

      const resJSON = await res.json();
      const { error, message, payload, statusCode } =
        responseSchema.parse(resJSON);
      if (error) {
        throw new Error("error to fetch lists");
      }
      const {
        data,
        limit: MaxLimit,
        page,
        pageCount,
        total,
      } = paginationSchema.parse(payload);
      const parseLists = listsArraySchemaIN.parse(data);
      setLists(parseLists);
      setTotalPages(pageCount);
      setTotalElements(total);
      setCurrentPage(page);
      setLimit(MaxLimit);
    } catch (error) {
      console.error("Error to fetch data receipts", error);
    } finally {
      setLoading(false);
    }
  }, [company, tokenBack, currentPage, limit, input, month, year, idSupplier]);

  useEffect(() => {
    getLists();
  }, [getLists]);

  const exportExcel = useCallback(async () => {
    if (!company) return;
    if (!tokenBack) return;
    setLoading(true);

    try {
      const queryParams = new URLSearchParams();
      queryParams.append("page", "1");
      queryParams.append("limit", "10000");
      if (input) queryParams.append("filter", input);
      if (month) queryParams.append("month", month);
      if (year) queryParams.append("year", year);
      if (idSupplier) queryParams.append("supplier_group_id", idSupplier);

      const url = `${BACKEND_URL}/api/labels/report?${queryParams
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
        throw new Error("error to fetch lists");
      }
      const { data } = paginationSchema.parse(payload);
      const parseLists = listsArraySchemaIN.parse(data);
      const formatNumbersAndDates = parseLists.map((data) => ({
        ...data,
        lastPurchaseDate: formatDate(data.lastPurchaseDate),
        lastPrice: formatWithCommas(data.lastPrice),
        averagePrice: formatWithCommas(data.averagePrice),
        lowestPrice: formatWithCommas(data.lowestPrice),
        higher_price: formatWithCommas(data.higher_price),
        business_name: data.supplier.business_name,
        business_status: data.supplier.business_status,
      }));
      return formatNumbersAndDates;
    } catch (error) {
      console.error("Error to fetch data receipts", error);
    } finally {
      setLoading(false);
    }
  }, [company, tokenBack, input, month, year, idSupplier]);

  const value = useMemo(
    () => ({
      lists,
      loading,
      getLists,
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
    }),
    [
      lists,
      loading,
      getLists,
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
    ]
  );
  return <ListContext.Provider value={value}>{children}</ListContext.Provider>;
};

export function useList() {
  const context = useContext(ListContext);
  if (!context) {
    throw new Error("useList should be used inside of provider");
  }
  return context;
}
