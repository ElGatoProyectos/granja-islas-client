import { backend_url } from "@/constants/config";
import { useCompanySession } from "@/context/company-context";
import { useUserInfo } from "@/context/user-context";
import {
  paymentArraySchemaIN,
  PaymentSchemaIN,
} from "@/lib/validations/payment";
import { responseArraySchema } from "@/lib/validations/response";
import { useCallback, useEffect, useState } from "react";

export function usePayments() {
  const { tokenBack } = useUserInfo();
  const { company } = useCompanySession();
  const [payment, setPayment] = useState<PaymentSchemaIN[]>();

  const getPayments = useCallback(async () => {
    if (!company) return;
    if (!tokenBack) return;
    const res = await fetch(`${backend_url}/api/bills/4/vouchers`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${tokenBack}`,
        ruc: company?.ruc,
      },
    });
    const data = await res.json();
    const { error, payload } = responseArraySchema.parse(data);
    if (error) {
      throw new Error("Failed to fetch payments");
    }
    console.log("payload", payload);
    // const parsePayment = paymentArraySchemaIN.parse(payload);
    // setPayment(parsePayment);
  }, [company, tokenBack]);

  useEffect(() => {
    getPayments();
  }, [getPayments]);

  return { payment, getPayments };
}
