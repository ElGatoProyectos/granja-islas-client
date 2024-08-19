import { backend_url } from "@/constants/config";
import { useCompanySession } from "@/context/company-context";
import { useUserInfo } from "@/context/user-context";
import {
  specificArraySchemaIN,
  SpecificSchemaIN,
} from "@/lib/validations/analytics";
import { responseArraySchema } from "@/lib/validations/response";
import { useCallback, useEffect, useState } from "react";

export function useAnalyticsSpecific() {
  const [loading, setLoading] = useState(false);
  const { tokenBack } = useUserInfo();
  const { company } = useCompanySession();
  const [labelId, setLabelId] = useState("");
  const [filterMonth, setFilterMonth] = useState("1");
  const [specificChart, setSpecificChart] = useState<SpecificSchemaIN[]>();

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
      const url2 = `${backend_url}/api/reports/specific-analysis-2?${queryParams}`;
      const url3 = `${backend_url}/api/reports/specific-analysis-3?${queryParams}`;

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

      // Ahora tienes los resultados de ambas peticiones.
      console.log(resJSON1, resJSON2);
      const parse1 = responseArraySchema.parse(resJSON1);
      const parse2 = responseArraySchema.parse(resJSON2);
      const parse3 = responseArraySchema.parse(resJSON3);
      //   const url = `${backend_url}/api/reports/specific-analysis-1?${queryParams}`;
      //   const res = await fetch(url, {
      //     method: "GET",
      //     headers: {
      //       Authorization: `Bearer ${tokenBack}`,
      //       ruc: company?.ruc,
      //     },
      //   });
      //   const resJSON = await res.json();
      //   const { error, payload } = responseArraySchema.parse(resJSON);
      //   if (error) {
      //     throw new Error("Failed to fetch spesific analytics");
      //   }

      //   const url2 = `${backend_url}/api/reports/specific-analysis-2?${queryParams}`;
      //   const res2 = await fetch(url, {
      //     method: "GET",
      //     headers: {
      //       Authorization: `Bearer ${tokenBack}`,
      //       ruc: company?.ruc,
      //     },
      //   });
      //   const resJSON2 = await res.json();
      console.log(parse1.payload);
      console.log(parse2.payload);
      console.log(parse3.payload);
      const chartSpic = specificArraySchemaIN.parse(parse1.payload);

      setSpecificChart(chartSpic);
    } catch (error) {
      throw new Error("Failed to fetch spesific analytics");
    } finally {
      setLoading(false);
    }
  }, [company, filterMonth, labelId, tokenBack]);

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
  };
}
