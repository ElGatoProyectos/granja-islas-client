import { backend_url } from "@/constants/config";
import { useCompanySession } from "@/context/company-context";
import { useUserInfo } from "@/context/user-context";
import { BankSchemaIN } from "@/lib/validations/bank";
import { useCallback, useEffect, useState } from "react";

export function useBanks() {
  const [banks, setBanks] = useState<BankSchemaIN[]>([]);
  const [loading, setLoading] = useState(false);
  const { tokenBack } = useUserInfo();
  const { company } = useCompanySession();

  const getBanks = useCallback(async () => {
    if (!company) return;
    if (!tokenBack) return;
    setLoading(true);
    try {
      const res = await fetch(`${backend_url}/api/banks`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${tokenBack}`,
          ruc: company?.ruc,
        },
      });

      if (!res.ok) {
        throw new Error("Failed to fetch banks");
      }

      const data = await res.json();
      setBanks(data.payload.reverse());
    } catch (error) {
      console.error("Error to fetch data banks", error);
    } finally {
      setLoading(false);
    }
  }, [company, tokenBack]);

  useEffect(() => {
    getBanks();
  }, [getBanks]);

  return { banks, loadingBanks: loading, getBanks };
}
