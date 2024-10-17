import { BACKEND_URL } from "@/constants/config";
import { useCompanySession } from "@/context/company-context";
import { useUserInfo } from "@/context/user-context";
import { useCallback, useState } from "react";
import { toast } from "sonner";

export function useSyncSunat() {
  const { tokenBack } = useUserInfo();
  const { company } = useCompanySession();
  const [loading, setLoading] = useState(false);

  const [dateRange, setDateRange] = useState({
    monthStart: "",
    yearStart: "",
    monthEnd: "",
    yearEnd: "",
  });

  const syncSunatperMonth = useCallback(async () => {
    const { monthStart, yearStart, monthEnd, yearEnd } = dateRange;
    if (
      !company ||
      !tokenBack ||
      !monthStart ||
      !yearStart ||
      !monthEnd ||
      !yearEnd
    )
      return;
    setLoading(true);
    const url = `${BACKEND_URL}/api/sunat/synchronize`;

    const JSONdata = JSON.stringify({
      start: `${yearStart}-${monthStart}`,
      end: `${yearEnd}-${monthEnd}`,
    });

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${tokenBack}`,
          ruc: company?.ruc,
          "Content-Type": "application/json",
        },
        body: JSONdata,
      });
      const data = await res.json();

      if (data.error) {
        toast.error(`${data.message}`);
        return;
      }

      toast.success(
        "La sincronización ha comenzado. Recibirás una notificación cuando el proceso haya finalizado."
      );
    } catch (error) {
      toast.error("Verifica tus credenciales.");
    } finally {
      setLoading(false);
    }
  }, [company, dateRange, tokenBack]);

  // Funciones para actualizar el rango de fechas
  const setYearStart = (year: string) =>
    setDateRange((prev) => ({ ...prev, yearStart: year }));
  const setMonthStart = (month: string) =>
    setDateRange((prev) => ({ ...prev, monthStart: month }));
  const setYearEnd = (year: string) =>
    setDateRange((prev) => ({ ...prev, yearEnd: year }));
  const setMonthEnd = (month: string) =>
    setDateRange((prev) => ({ ...prev, monthEnd: month }));

  return {
    syncSunatperMonth,
    loading,
    setYearStart,
    setMonthStart,
    setMonthEnd,
    setYearEnd,
  };
}
