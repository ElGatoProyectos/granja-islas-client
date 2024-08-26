import { backend_url } from "@/constants/config";
import { typesSpanishFormat } from "@/constants/type-document";
import { useCompanySession } from "@/context/company-context";
import { useUserInfo } from "@/context/user-context";
import { paginationSchema } from "@/lib/validations/pagination";
import {
  receiptArraySchemaIN,
  ReceiptSchemaIN,
} from "@/lib/validations/receipt";
import { responseSchema } from "@/lib/validations/response";
import { useCallback, useEffect, useState } from "react";

export function useDocumentsOfSupplier() {
  const [loading, setLoading] = useState(false);
  const { tokenBack } = useUserInfo();
  const { company } = useCompanySession();
  const [receipts, setReceipts] = useState<ReceiptSchemaIN[]>([]);
  const [idSupplier, setIdSupplier] = useState("");

  const getDocuments = useCallback(async () => {
    if (!company) return;
    if (!tokenBack) return;
    setLoading(true);

    try {
      const queryParams = new URLSearchParams();
      queryParams.append("limit", "10000");

      if (idSupplier) queryParams.append("supplier_group_id", idSupplier);
      queryParams.append("document_type", "BILL");

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

      const resJSON = await res.json();
      const { error, payload } = responseSchema.parse(resJSON);
      if (error) {
        throw new Error("Error to fetch data receipts");
      }
      const { data } = paginationSchema.parse(payload);
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

      setReceipts(updatedDocuments);
    } catch (error) {
      throw new Error("Error to fetch data receipts");
    } finally {
      setLoading(false);
    }
  }, [company, idSupplier, tokenBack]);

  useEffect(() => {
    getDocuments();
  }, [getDocuments]);

  return { receipts, loading, setIdSupplier };
}
