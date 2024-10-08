import { BACKEND_URL } from "@/constants/config";
import { useCompanySession } from "@/context/company-context";
import { useUserInfo } from "@/context/user-context";
import {
  receiptSchemaUniqueIN,
  ReceiptSchemaUniqueIN,
} from "@/lib/validations/receipt";
import { responseSchema } from "@/lib/validations/response";
import { useCallback, useEffect, useState } from "react";
export function useReceiptDetail({
  document_code,
  document_id,
}: {
  document_code: string;
  document_id: string;
}) {
  const { tokenBack } = useUserInfo();
  const { company } = useCompanySession();
  const [receipt, setReceipt] = useState<ReceiptSchemaUniqueIN>();
  const [loading, setloading] = useState(false);

  const getReceiptDetail = useCallback(async () => {
    if (!company) return;
    if (!tokenBack) return;
    setloading(true);
    const url = `${BACKEND_URL}/api/documents/detail/?document_code=${document_code}&document_id=${document_id}`;

    try {
      const res = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${tokenBack}`,
          "Content-Type": "application/json",
          ruc: company?.ruc,
        },
      });

      const data = await res.json();
      const { error, payload } = responseSchema.parse(data);
      if (error) {
        throw new Error("Failed to fetch receipt detail");
      }

      const parsedReceipt = receiptSchemaUniqueIN.parse(payload);
      setReceipt(parsedReceipt);
    } catch (error) {
      throw new Error("Failed to fetch receipt detail");
    } finally {
      setloading(false);
    }
  }, [company, tokenBack, document_code, document_id]);

  useEffect(() => {
    getReceiptDetail();
  }, [getReceiptDetail]);

  return { receipt, loading };
}
