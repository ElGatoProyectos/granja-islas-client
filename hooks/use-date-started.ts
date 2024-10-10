import { getCompanyForRuc } from "@/lib/actions/company.actions";
import { getYearAndMonth } from "@/utils/getYearAndMonth";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export function useDateStarted() {
  const searchParams = useSearchParams();
  const company_ruc = searchParams.get("ruc") ?? "";
  const year = searchParams.get("year") ?? "";
  const month = searchParams.get("month") ?? "";
  const [yearStarted, setYearStarted] = useState(year);
  const [monthStarted, setMonthStarted] = useState(month);

  useEffect(() => {
    if (company_ruc) {
      const getData = async () => {
        const company = await getCompanyForRuc({ ruc: company_ruc });
        const { yearStarted, monthStarted } = getYearAndMonth({
          dateString: company.emisor_electronico_desde,
        });
        setYearStarted(yearStarted.toString());
        setMonthStarted(monthStarted.toString());
      };
      getData();
    }
  }, [company_ruc]);

  return { yearStarted, monthStarted };
}
