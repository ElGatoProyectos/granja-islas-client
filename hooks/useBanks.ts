import { backend_url } from "@/constants/config";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";

export function useBanks({ ruc }: { ruc?: string }) {
  const [banks, setBanks] = useState([]);
  const [loading, setLoading] = useState(false);
  const { data: session }: { data: any } = useSession();

  const getBanks = useCallback(async () => {
    if (!ruc) return;
    if (!session) return;
    setLoading(true);
    try {
      const res = await fetch(`${backend_url}/api/banks`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${session.user.tokenBack}`,
          ruc,
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
  }, [ruc, session]);

  useEffect(() => {
    getBanks();
  }, [getBanks]);

  return { banks, loadingBanks: loading, getBanks };
}
