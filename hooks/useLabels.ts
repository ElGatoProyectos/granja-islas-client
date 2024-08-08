import { backend_url } from "@/constants/config";
import { useCompanySession } from "@/context/company-context";
import { useUserInfo } from "@/context/user-context";
import { useCallback, useEffect, useState } from "react";

export function useLabels() {
  const [labels, setLabels] = useState([]);
  const [loading, setLoading] = useState(false);
  const { tokenBack } = useUserInfo();
  const { company } = useCompanySession();

  const getLabels = useCallback(async () => {
    if (!company) return;
    if (!tokenBack) return;
    setLoading(true);
    try {
      const res = await fetch(`${backend_url}/api/labels`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${tokenBack}`,
          ruc: company?.ruc,
        },
      });

      if (!res.ok) {
        throw new Error("Failed to fetch labels");
      }

      const data = await res.json();
      setLabels(data.payload.reverse());
    } catch (error) {
      console.error("Error to fetch data labels", error);
    } finally {
      setLoading(false);
    }
  }, [company, tokenBack]);

  useEffect(() => {
    getLabels();
  }, [getLabels]);

  return { labels, loadingLabel: loading, getLabels };
}
