import { backend_url } from "@/constants/config";
import { useCompanySession } from "@/context/company-context";
import { useUserInfo } from "@/context/user-context";
import { useCallback, useEffect, useState } from "react";
import { useLabels } from "./useLabels";
import { responseSchema } from "@/lib/validations/response";
import {
  AnalyticsSchemaIN,
  analyticsSchemaIN,
} from "@/lib/validations/analytics";

export function useAnalyticsGeneral() {
  const [generalAnalytics, setGeneralAnalytics] = useState<AnalyticsSchemaIN>();
  const [loading, setLoading] = useState(false);
  const { tokenBack } = useUserInfo();
  const { company } = useCompanySession();
  const [labelId, setLabelId] = useState("");

  const getGeneralAnalitycs = useCallback(async () => {
    if (!company) return;
    if (!tokenBack) return;
    if (!labelId) return;
    setLoading(true);

    try {
      const url = `${backend_url}/api/reports/general-analysis-basic/${labelId}`;
      const res = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${tokenBack}`,
          ruc: company?.ruc,
        },
      });
      const resJSON = await res.json();
      const { error, message, statusCode, payload } =
        responseSchema.parse(resJSON);
      const parseAnalitycs = analyticsSchemaIN.parse(payload);
      setGeneralAnalytics(payload);
    } catch (error) {
      throw new Error("Failed to fetch banks");
    } finally {
      setLoading(false);
    }
  }, [company, labelId, tokenBack]);

  useEffect(() => {
    getGeneralAnalitycs();
  }, [getGeneralAnalitycs]);

  return {
    generalAnalytics,
    loadingAnalitycs: loading,
    getGeneralAnalitycs,
    setLabelId,
    labelId,
  };
}
