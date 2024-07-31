import { backend_url } from "@/constants/config";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";

export function useLabels({ ruc }: { ruc?: string }) {
  const [labels, setLabels] = useState([]);
  const [loading, setLoading] = useState(false);
  const { data: session }: { data: any } = useSession();

  const getLabels = useCallback(async () => {
    if (!ruc) return;
    if (!session) return;
    setLoading(true);
    try {
      const res = await fetch(`${backend_url}/api/labels`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${session.user.tokenBack}`,
          ruc,
        },
      });

      if (!res.ok) {
        throw new Error("Failed to fetch labels");
      }

      const data = await res.json();
      setLabels(data.payload.reverse());
    } catch (error) {
      console.error("Error to fetch data labels", error);
    } finally {
      setLoading(false);
    }
  }, [ruc, session]);

  useEffect(() => {
    getLabels();
  }, [getLabels]);

  return { labels, loadingLabel: loading, getLabels };
}
