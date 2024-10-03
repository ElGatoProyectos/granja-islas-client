import { BACKEND_URL } from "@/constants/config";
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
      const res = await fetch(`${BACKEND_URL}/api/banks`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${tokenBack}`,
          ruc: company?.ruc,
        },
      });

      const data = await res.json();

      if (data.error) {
        throw new Error("Failed to fetch banks");
      }
      setBanks(data.payload);
    } catch (error) {
      throw new Error("Failed to fetch banks");
    } finally {
      setLoading(false);
    }
  }, [company, tokenBack]);

  useEffect(() => {
    getBanks();
  }, [getBanks]);

  return { banks, loadingBanks: loading, getBanks };
}
