import { backend_url } from "@/constants/config";
import { useCompanySession } from "@/context/company-context";
import { useUserInfo } from "@/context/user-context";
import {
  documentsArrayOfLabel,
  formatDocumentsOfLabel,
  FormatDocumentsOfLabelType,
} from "@/lib/validations/label";
import { paginationSchema } from "@/lib/validations/pagination";
import { responseSchema } from "@/lib/validations/response";
import { SupplierSchemaFilter } from "@/lib/validations/supplier";
import { useCallback, useEffect, useState } from "react";

export function useLabelDocuments({ labelId }: { labelId: string }) {
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

  const getDocumentsOfLabel = useCallback(async () => {
    if (!company) return;
    if (!tokenBack) return;
    const queryParams = new URLSearchParams();
    if (currentPage) queryParams.append("page", currentPage.toString());
    if (limit) queryParams.append("limit", limit.toString());
    if (month) queryParams.append("month", month);
    if (year) queryParams.append("year", year);
    try {
      const res = await fetch(
        `${backend_url}/api/labels/${labelId}/documents`,
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
    }
  }, [company, currentPage, labelId, limit, month, tokenBack, year]);

  useEffect(() => {
    getDocumentsOfLabel();
  }, [getDocumentsOfLabel]);

  return {
    documents,
    getDocumentsOfLabel,
    /* pagination */
    limit,
    setLimit,
    currentPage,
    setCurrentPage,
    totalPages,
    totalElements,
    /* filters */
    setMonth,
    month,
    setYear,
    year,
    setIdSupplier,
    idSupplier,
    supplierFilter,
  };
}
