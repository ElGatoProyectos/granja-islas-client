"use client";

import { backend_url } from "@/constants/config";
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
import { userArraySchemaIN, UserSchemaIN } from "@/lib/validations/user";
import { useParams } from "next/navigation";
import {
  formatSupplierProducts,
  supplierProductsArrayFormatSchema,
  supplierProductsArraySchema,
  SupplierProductsFormatSchema,
} from "@/lib/validations/supplier";
import { labelArraySchemaIN, LabelSchemaIN } from "@/lib/validations/label";

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

      const url = `${backend_url}/api/suppliers/${id}/products?${queryParams
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
      const resUsers = await fetch(`${backend_url}/api/labels`, {
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

      const { error, message, statusCode, payload } =
        responseSchema.parse(resJSON);
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
