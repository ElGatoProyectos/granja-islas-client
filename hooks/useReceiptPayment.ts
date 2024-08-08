import { backend_url } from "@/constants/config";
import { useCompanySession } from "@/context/company-context";
import { useUserInfo } from "@/context/user-context";
import {
  paymentReceiptArraySchemaIN,
  PaymentReceiptSchemaIN,
  paymentReceiptSchemaIN,
} from "@/lib/validations/payment";
import { responseSchema } from "@/lib/validations/response";
import { useCallback, useEffect, useState } from "react";

export function useReceiptPayment({
  document_code,
  document_id,
}: {
  document_code: string;
  document_id: string;
}) {
  const { tokenBack } = useUserInfo();
  const { company } = useCompanySession();
  const [receipt, setReceipt] = useState<PaymentReceiptSchemaIN[]>([]);

  const getReceiptPayments = useCallback(async () => {
    if (!company) return;
    if (!tokenBack) return;

    const queryParams = new URLSearchParams();
    queryParams.append("document_code", document_code);
    queryParams.append("document_id", document_id);
    const url = `${backend_url}/api/vouchers?${queryParams}`;

    try {
      const res = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${tokenBack}`,
          "Content-Type": "application/json",
          ruc: company?.ruc,
        },
      });

      const resJSON = await res.json();
      const { error, message, statusCode, payload } =
        responseSchema.parse(resJSON);

      if (error) {
        throw new Error("Failed to fetch receipt payment detail");
      }

      const parsePaymentReceipt = paymentReceiptArraySchemaIN.parse(payload);
      console.log("parsePaymentReceipt", parsePaymentReceipt);
      setReceipt(parsePaymentReceipt);
    } catch (error) {
      throw new Error("Failed to fetch receipt payment detail");
    }
  }, [company, tokenBack, document_code, document_id]);

  useEffect(() => {
    getReceiptPayments();
  }, [getReceiptPayments]);

  return { receipt };
}
