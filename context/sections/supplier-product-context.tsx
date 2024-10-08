"use client";

import { BACKEND_URL } from "@/constants/config";
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
  responseArraySchema,
  responseSchema,
} from "@/lib/validations/response";
import { paginationSchema } from "@/lib/validations/pagination";
import { useParams } from "next/navigation";
import {
  formatSupplierProducts,
  supplierProductsArrayFormatSchema,
  supplierProductsArraySchema,
  SupplierProductsFormatSchema,
} from "@/lib/validations/supplier";
import { labelArraySchemaIN, LabelSchemaIN } from "@/lib/validations/label";
import { formatDate } from "@/utils/format-date";
import { formatWithCommas } from "@/utils/format-number-comas";

interface PaymentContextType {
  productsOfSupplier: SupplierProductsFormatSchema[];
  getProductsOfSupplier: () => Promise<void>;

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
  labelsFilters: LabelSchemaIN[];
  setLabelId: Dispatch<SetStateAction<string>>;
  exportExcel: () => any;
}

export const SupplierProductsContext = createContext<PaymentContextType | null>(
  null
);

export const SupplierProductsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { tokenBack } = useUserInfo();
  const { company } = useCompanySession();
  const [productsOfSupplier, setProductsOfSupplier] = useState<
    SupplierProductsFormatSchema[]
  >([]);
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
  const [labelsFilters, setLabelsFilters] = useState<LabelSchemaIN[]>([]);
  const [labelId, setLabelId] = useState("");
  const { id } = useParams();

  const getProductsOfSupplier = useCallback(async () => {
    if (!company) return;
    if (!tokenBack) return;
    if (!id) return;
    setLoading(true);

    try {
      const queryParams = new URLSearchParams();
      if (currentPage) queryParams.append("page", currentPage.toString());
      if (limit) queryParams.append("limit", limit.toString());
      if (input) queryParams.append("filter", input);
      if (month) queryParams.append("month", month);
      if (year) queryParams.append("year", year);
      if (labelId) queryParams.append("label_group_id", labelId);

      const url = `${BACKEND_URL}/api/suppliers/${id}/products?${queryParams
        .toString()
        .replace(/%2C/g, ",")}`;

      const res = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${tokenBack}`,
          ruc: company.ruc,
        },
      });

      /* filterUsers */
      const resUsers = await fetch(`${BACKEND_URL}/api/labels`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${tokenBack}`,
          ruc: company?.ruc,
        },
      });
      const resUsersJSON = await resUsers.json();
      const { payload: dataLabels, error: ErrorUsers } =
        responseArraySchema.parse(resUsersJSON);
      if (ErrorUsers) {
        throw new Error("error to fetch users");
      }

      const parseLabels = labelArraySchemaIN.parse(dataLabels);
      setLabelsFilters(parseLabels);
      /* filterUsers */
      const resJSON = await res.json();

      const { error, payload } = responseSchema.parse(resJSON);
      if (error) {
        throw new Error("error to fetch products of supplier");
      }

      const {
        data,
        limit: maxLimit,
        page,
        pageCount,
        total,
      } = paginationSchema.parse(payload);

      const parseData = supplierProductsArraySchema.parse(data);

      const formatProductsOfSupplier = formatSupplierProducts(parseData);
      const formData = supplierProductsArrayFormatSchema.parse(
        formatProductsOfSupplier
      );

      setProductsOfSupplier(formData);
      setTotalPages(pageCount);
      setTotalElements(total);
      setCurrentPage(page);
      setLimit(maxLimit);
    } catch (error) {
      throw new Error("error to fetch products of supplier");
    } finally {
      setLoading(false);
    }
  }, [company, tokenBack, id, currentPage, limit, input, month, year, labelId]);

  useEffect(() => {
    getProductsOfSupplier();
  }, [getProductsOfSupplier]);

  const exportExcel = useCallback(async () => {
    if (!company) return;
    if (!tokenBack) return;
    if (!id) return;
    setLoading(true);

    try {
      const queryParams = new URLSearchParams();
      queryParams.append("page", "1");
      queryParams.append("limit", "10000");
      if (input) queryParams.append("filter", input);
      if (month) queryParams.append("month", month);
      if (year) queryParams.append("year", year);
      if (labelId) queryParams.append("label_group_id", labelId);

      const url = `${BACKEND_URL}/api/suppliers/${id}/products?${queryParams
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
        throw new Error("error to fetch products of supplier");
      }
      const { data } = paginationSchema.parse(payload);
      const parseData = supplierProductsArraySchema.parse(data);
      const formatProductsOfSupplier = formatSupplierProducts(parseData);
      const formData = supplierProductsArrayFormatSchema.parse(
        formatProductsOfSupplier
      );
      const formatNumbersAndDates = formData.map((data) => ({
        ...data,
        labels: data.DetailProductLabel.map(({ label }) => label).join(", "),
        issue_date: formatDate(data.issue_date),
        amount: formatWithCommas(data.amount),
        price: formatWithCommas(data.price),
        igv: formatWithCommas(data.igv ?? ""),
        total: formatWithCommas(data.total ?? ""),
      }));
      return formatNumbersAndDates;
    } catch (error) {
      throw new Error("error to fetch products of supplier");
    } finally {
      setLoading(false);
    }
  }, [company, tokenBack, id, input, month, year, labelId]);

  const value = useMemo(
    () => ({
      productsOfSupplier,
      loading,
      getProductsOfSupplier,
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
      labelsFilters,
      setLabelId,
      exportExcel,
    }),
    [
      productsOfSupplier,
      loading,
      getProductsOfSupplier,
      limit,
      currentPage,
      totalPages,
      totalElements,
      search,
      month,
      year,
      labelsFilters,
      setLabelId,
      exportExcel,
    ]
  );
  return (
    <SupplierProductsContext.Provider value={value}>
      {children}
    </SupplierProductsContext.Provider>
  );
};

export function useSupplierProducts() {
  const context = useContext(SupplierProductsContext);
  if (!context) {
    throw new Error("useSupplierProducts should be used inside of provider");
  }
  return context;
}
