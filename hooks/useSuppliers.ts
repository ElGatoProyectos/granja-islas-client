import { SupplierTypeIn } from "@/components/suppliers/data-table/supplier-schema-table";
import { backend_url } from "@/constants/config";
import { useCompanySession } from "@/context/company-context";
import { useUserInfo } from "@/context/user-context";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";

export function useSuppliers({ ruc }: { ruc?: string }) {
  const [suppliers, setSuppliers] = useState<SupplierTypeIn[]>([]);
  const [loading, setLoading] = useState(false);
  const { tokenBack } = useUserInfo();

  const { data: session }: { data: any } = useSession();
  const getSuppliers = useCallback(async () => {
    if (!ruc) return;
    if (!session) return;
    setLoading(true);

    try {
      const res = await fetch(`${backend_url}/api/suppliers`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${session.user.tokenBack}`,
          ruc,
        },
      });

      if (!res.ok) {
        throw new Error("Failed to fetch suppliers");
      }

      const data = await res.json();

      setSuppliers(data.payload.data.reverse());
    } catch (error) {
      console.error("Error to fetch data suppliers", error);
    } finally {
      setLoading(false);
    }
  }, [ruc, session]);

  useEffect(() => {
    getSuppliers();
  }, [getSuppliers]);

  console.log("hook->", suppliers);

  return { suppliers, loadingSuppliers: loading, getSuppliers };
}
