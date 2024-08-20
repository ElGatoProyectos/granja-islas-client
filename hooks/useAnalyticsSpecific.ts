import { backend_url } from "@/constants/config";
import { useCompanySession } from "@/context/company-context";
import { useUserInfo } from "@/context/user-context";
import {
  specific3ArraySchemaIN,
  Specific3SchemaIN,
  specificArraySchemaIN,
  SpecificSchemaIN,
} from "@/lib/validations/analytics";
import {
  responseArraySchema,
  responseSchema,
} from "@/lib/validations/response";
import { getFilteredExpenses } from "@/utils/filtered-expenses";
import { useCallback, useEffect, useState } from "react";

export type Specific3Formated = {
  month: string;
  shopping: number;
};

export function useAnalyticsSpecific() {
  const [loading, setLoading] = useState(false);
  const { tokenBack } = useUserInfo();
  const { company } = useCompanySession();
  const [labelId, setLabelId] = useState("");
  const [filterMonth, setFilterMonth] = useState("1");
  const [specificChart, setSpecificChart] = useState<SpecificSchemaIN[]>([]);
  const [specificChart2, setSpecificChart2] = useState<SpecificSchemaIN[]>([]);
  const [specificChart3, setspecificChart3] = useState<Specific3Formated[]>([]);
  const [measure, setMeasure] = useState<string[]>([]);
  const [measureSelect, setMeasureSelect] = useState("");

  const getMeasureSpecific2 = useCallback(async () => {
    if (!company) return;
    if (!tokenBack) return;
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
  }, [company, tokenBack]);
  useEffect(() => {
    getMeasureSpecific2();
  }, [getMeasureSpecific2]);

  const getSpecificAnalitycs = useCallback(async () => {
    if (!company) return;
    if (!tokenBack) return;
    if (!labelId) return;
    setLoading(true);
    const queryParams = new URLSearchParams();
    if (filterMonth) queryParams.append("filter_month", filterMonth);
    if (labelId) queryParams.append("label_id", labelId);

    try {
      const url1 = `${backend_url}/api/reports/specific-analysis-1?${queryParams}`;
      const url2 = `${backend_url}/api/reports/specific-analysis-2?${queryParams}${
        measureSelect ? `&filter_unit=${measureSelect}` : ""
      }`;
      const url3 = `${backend_url}/api/reports/specific-analysis-3?${queryParams}`;
      console.log(url2);

      const fetchReport = async (url: string) => {
        const res = await fetch(url, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${tokenBack}`,
            ruc: company?.ruc,
          },
        });
        return res.json();
      };

      const [resJSON1, resJSON2, resJSON3] = await Promise.all([
        fetchReport(url1),
        fetchReport(url2),
        fetchReport(url3),
      ]);

      const parse1 = responseArraySchema.parse(resJSON1);
      const parse2 = responseArraySchema.parse(resJSON2);
      const parse3 = responseArraySchema.parse(resJSON3);

      console.log(parse2.payload);

      const chartSpic = specificArraySchemaIN.parse(parse1.payload);
      const chartSpic2 = specificArraySchemaIN.parse(parse2.payload);
      const chartSpic3 = specific3ArraySchemaIN.parse(parse3.payload);
      console.log(chartSpic);
      console.log(chartSpic2);
      console.log(chartSpic3);

      setSpecificChart(chartSpic);
      setSpecificChart2(chartSpic2);
      const datafiltered = getFilteredExpenses({
        filterMonth,
        purchases: chartSpic3,
      });
      console.log(datafiltered);

      setspecificChart3(datafiltered);
    } catch (error) {
      throw new Error("Failed to fetch spesific analytics");
    } finally {
      setLoading(false);
    }
  }, [company, filterMonth, labelId, measureSelect, tokenBack]);

  useEffect(() => {
    getSpecificAnalitycs();
  }, [getSpecificAnalitycs]);

  return {
    loading,
    labelId,
    setLabelId,
    setFilterMonth,
    filterMonth,
    specificChart,
    specificChart2,
    specificChart3,
    measure,
    measureSelect,
    setMeasureSelect,
  };
}
