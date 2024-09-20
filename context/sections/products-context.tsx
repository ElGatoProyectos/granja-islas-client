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
import { formatDate } from "@/utils/format-date";
import { formatWithCommas } from "@/utils/format-number-comas";
import { getSuppliers } from "@/service/suppliers";
import { getLabels } from "@/service/labels";

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
  exportExcel: () => any;
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

  const getFilters = useCallback(async () => {
    if (!company) return;
    if (!tokenBack) return;
    /* suppliers filter */
    const suppliers = await getSuppliers({ ruc: company.ruc, tokenBack });
    const formatFilterSupplier = supplierArraySchemaFilter.parse(
      suppliers.payload
    );
    setsupplierFilter(formatFilterSupplier);

    /* labels filter */
    const labels = await getLabels({ ruc: company.ruc, tokenBack });
    const parseLabel = labelArraySchemaFilter.parse(labels.payload);
    setLabelFilter(parseLabel);
  }, [company, tokenBack]);

  useEffect(() => {
    getFilters();
  }, [getFilters]);

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

      const resJSON = await res.json();
      const { error, payload } = responseSchema.parse(resJSON);
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

      const resJSON = await res.json();
      const { error, payload } = responseSchema.parse(resJSON);
      if (error) {
        throw new Error("Failed to fetch companies");
      }
      const { data } = paginationSchema.parse(payload);
      const parseproductTable = productTableArrayReportIN.parse(data);
      const formatProduct = formatProductTable(parseproductTable);
      const formatNumbersAndDates = formatProduct.map((data) => ({
        ...data,
        issue_date: formatDate(data.issue_date),
        ruc: data.Supplier.ruc,
        business_name: data.Supplier.business_name,
        amount: formatWithCommas(data.amount),
        price: formatWithCommas(data.price),
        igv: formatWithCommas(data.igv ?? ""),
        total: formatWithCommas(data.total ?? ""),
      }));
      return formatNumbersAndDates;
    } catch (error) {
      throw new Error("Failed to fetch companies");
    } finally {
      setLoading(false);
    }
  }, [company, tokenBack, input, month, year, idSupplier, idLabel]);

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
      exportExcel,
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
      exportExcel,
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
