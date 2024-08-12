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
import { responseSchema } from "@/lib/validations/response";
import {
  formatProductTable,
  ProductSchemaINFormated,
  productTableArrayReportIN,
} from "@/lib/validations/product";
import { paginationSchema } from "@/lib/validations/pagination";
import {
  labelArraySchemaFilter,
  LabelSchemaFilter,
} from "@/lib/validations/label";

interface ReceiptContextType {
  products: ProductSchemaINFormated[];
  getProducts: () => Promise<void>;
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
  idLabel: string;
  setIdLabel: Dispatch<SetStateAction<string>>;
  labelFilter: any[];
}

export const productContext = createContext<ReceiptContextType | null>(null);

export const ProductProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { tokenBack } = useUserInfo();
  const { company } = useCompanySession();
  const [products, setProducts] = useState<ProductSchemaINFormated[]>([]);
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
  const [idLabel, setIdLabel] = useState("");
  const [labelFilter, setLabelFilter] = useState<LabelSchemaFilter[]>([]);

  const getProducts = useCallback(async () => {
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
      if (idLabel) queryParams.append("label_group_id", idLabel);

      const url = `${backend_url}/api/products/report?${queryParams
        .toString()
        .replace(/%2C/g, ",")}`;

      const res = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${tokenBack}`,
          ruc: company.ruc,
        },
      });
      /* suppliers filter */
      const resSuppliers = await fetch(
        `${backend_url}/api/suppliers/no-pagination`,
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

      /* labels filter */
      const resLabel = await fetch(`${backend_url}/api/labels`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${tokenBack}`,
          ruc: company?.ruc,
        },
      });

      const resLabelJSON = await resLabel.json();
      const parseLabel = labelArraySchemaFilter.parse(resLabelJSON.payload);
      setLabelFilter(parseLabel);

      /* res table */

      const resJSON = await res.json();
      const { error, message, statusCode, payload } =
        responseSchema.parse(resJSON);
      if (error) {
        throw new Error("Failed to fetch companies");
      }
      const {
        data,
        limit: MaxLimit,
        page,
        pageCount,
        total,
      } = paginationSchema.parse(payload);
      const parseproductTable = productTableArrayReportIN.parse(data);
      const formatProduct = formatProductTable(parseproductTable);

      setProducts(formatProduct);
      setTotalPages(pageCount);
      setTotalElements(total);
      setCurrentPage(page);
      setLimit(MaxLimit);
    } catch (error) {
      throw new Error("Failed to fetch companies");
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
    idLabel,
  ]);

  useEffect(() => {
    getProducts();
  }, [getProducts]);

  const value = useMemo(
    () => ({
      products,
      loading,
      getProducts,
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
      idLabel,
      setIdLabel,
      labelFilter,
    }),
    [
      products,
      loading,
      getProducts,
      limit,
      currentPage,
      totalPages,
      totalElements,
      search,
      month,
      year,
      idSupplier,
      supplierFilter,
      idLabel,
      labelFilter,
    ]
  );
  return (
    <productContext.Provider value={value}>{children}</productContext.Provider>
  );
};

export function useProduct() {
  const context = useContext(productContext);
  if (!context) {
    throw new Error("useProduct should be used inside of provider");
  }
  return context;
}
