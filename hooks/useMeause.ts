import { backend_url } from "@/constants/config";
import { useCompanySession } from "@/context/company-context";
import { useUserInfo } from "@/context/user-context";
import { responseSchema } from "@/lib/validations/response";
import { useCallback, useEffect, useState } from "react";

export function useMeasure() {
  const [loading, setLoading] = useState(false);
  const { tokenBack } = useUserInfo();
  const { company } = useCompanySession();
  const [measure, setMeasure] = useState<string[]>([]);
  const [measureSelect, setMeasureSelect] = useState("");

  const getMeasure = useCallback(async () => {
    if (!company) return;
    if (!tokenBack) return;
    setLoading(true);
    try {
      const res = await fetch(`${backend_url}/api/products/units`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${tokenBack}`,
          ruc: company?.ruc,
        },
      });

      const data = await res.json();
      const { error, payload } = responseSchema.parse(data);
      if (error) {
        throw new Error("Failed to fetch measure");
      }
      setMeasure(payload);
      setMeasureSelect(payload[0]);
    } catch (e) {
      throw new Error("Failed to fetch measure");
    } finally {
      setLoading(false);
    }
  }, [company, tokenBack]);

  useEffect(() => {
    getMeasure();
  }, [getMeasure]);

  return { measure };
}
