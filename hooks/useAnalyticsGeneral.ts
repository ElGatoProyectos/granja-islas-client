import { backend_url } from "@/constants/config";
import { useCompanySession } from "@/context/company-context";
import { useUserInfo } from "@/context/user-context";
import { useCallback, useEffect, useState } from "react";
import { useLabels } from "./useLabels";
import {
  responseArraySchema,
  responseSchema,
} from "@/lib/validations/response";
import {
  AnalyticsSchemaIN,
  analyticsSchemaIN,
  expCompositonArraySchemaIN,
  ExpCompositonSchemaIN,
  topSuppliersArraySchemaIN,
  TopSuppliersSchemaIN,
} from "@/lib/validations/analytics";

export function useAnalyticsGeneral() {
  const [generalAnalytics, setGeneralAnalytics] = useState<AnalyticsSchemaIN>();
  const [loading, setLoading] = useState(false);
  const { tokenBack } = useUserInfo();
  const { company } = useCompanySession();
  const [labelId, setLabelId] = useState("");
  /* suppliers */
  const [radio, setRadio] = useState("12");
  const [topSuppliers, setTopSuppliers] = useState<TopSuppliersSchemaIN[]>([]);
  /* exp */
  const [monthRadio, setMonthRadio] = useState("12");
  const [expComposition, setExpComposition] = useState<ExpCompositonSchemaIN[]>(
    []
  );

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

      if (error) {
        throw new Error("Failed to fetch general basic");
      }

      const parseAnalitycs = analyticsSchemaIN.parse(payload);
      setGeneralAnalytics(parseAnalitycs);
    } catch (error) {
      throw new Error("Failed to fetch general basic");
    } finally {
      setLoading(false);
    }
  }, [company, labelId, tokenBack]);

  useEffect(() => {
    getGeneralAnalitycs();
  }, [getGeneralAnalitycs]);

  const getTopSuppliers = useCallback(async () => {
    if (!company) return;
    if (!tokenBack) return;
    const url = `${backend_url}/api/reports/general-analysis-detail-supplier?filter_month=${radio}`;
    const res = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${tokenBack}`,
        ruc: company?.ruc,
      },
    });
    const resJSON = await res.json();
    const { payload, error } = responseArraySchema.parse(resJSON);
    if (error) {
      throw new Error("Failed to get to top suppliers");
    }
    const parseTopSuppliers = topSuppliersArraySchemaIN.parse(payload);

    setTopSuppliers(parseTopSuppliers);
  }, [company, radio, tokenBack]);

  useEffect(() => {
    getTopSuppliers();
  }, [getTopSuppliers]);

  const getExpenditureComposition = useCallback(async () => {
    if (!company) return;
    if (!tokenBack) return;
    const url = `${backend_url}/api/reports/general-analysis-detail-expenditure-composition?filter_month=${monthRadio}`;
    const res = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${tokenBack}`,
        ruc: company?.ruc,
      },
    });
    const resJSON = await res.json();
    const { payload, error } = responseArraySchema.parse(resJSON);
    if (error) {
      throw new Error("Failed to get expenditure composition");
    }
    const parseTopSuppliers = expCompositonArraySchemaIN.parse(payload);
    setExpComposition(parseTopSuppliers);
  }, [company, monthRadio, tokenBack]);

  useEffect(() => {
    getExpenditureComposition();
  }, [getExpenditureComposition, monthRadio]);

  return {
    generalAnalytics,
    loadingAnalitycs: loading,
    getGeneralAnalitycs,
    setLabelId,
    labelId,
    setRadio,
    radio,
    topSuppliers,
    monthRadio,
    setMonthRadio,
    expComposition,
  };
}
