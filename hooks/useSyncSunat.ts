import { useToast } from "@/components/ui/use-toast";
import { backend_url } from "@/constants/config";
import { useCompanySession } from "@/context/company-context";
import { useUserInfo } from "@/context/user-context";
import { useCallback, useState } from "react";

export function useSyncSunat() {
  const { tokenBack } = useUserInfo();
  const { company } = useCompanySession();
  const [monthStart, setMonthStart] = useState("");
  const [yearStart, setYearStart] = useState("");
  const [loading, setLoading] = useState(false);
  const [monthEnd, setMonthEnd] = useState("");
  const [yearEnd, setYearEnd] = useState("");
  const { toast } = useToast();
  const syncSunatperMonth = useCallback(async () => {
    if (!company) return;
    if (!tokenBack) return;
    if (!monthStart || !yearStart || !yearEnd || !monthEnd) return;
    setLoading(true);
    const url = `${backend_url}/api/sunat/synchronize`;

    const JSONdata = JSON.stringify({
      start: `${yearStart}-${monthStart}`,
      end: `${yearEnd}-${monthEnd}`,
    });
    console.log(JSONdata);
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
      console.log(data);
      if (data.error) {
        toast({
          variant: "destructive",
          title: "Uh oh! Ocurrio un error.",
          description: data.message,
        });
      }
      toast({
        variant: "success",
        title: data.message,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Uh oh! Ocurrio un error.",
        description: "Verifica tus credenciales.",
      });
    } finally {
      setLoading(false);
    }
  }, [company, monthEnd, monthStart, toast, tokenBack, yearEnd, yearStart]);

  return {
    syncSunatperMonth,
    loading,
    setYearStart,
    yearStart,
    setMonthStart,
    monthStart,
    monthEnd,
    setMonthEnd,
    yearEnd,
    setYearEnd,
  };
}
