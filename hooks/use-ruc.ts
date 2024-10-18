import { useCompanySession } from "@/context/company-context";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export function useRuc() {
  const searchParams = useSearchParams();
  const { company } = useCompanySession();
  const router = useRouter();
  const ruc = searchParams.get("ruc") ?? "";

  useEffect(() => {
    if (!ruc) {
      if (company) {
        const newParams = new URLSearchParams(searchParams);
        newParams.set("ruc", company.ruc);
        router.replace(`?${newParams.toString()}`);
        return;
      }
      router.push("/onboarding");
    }
  }, [searchParams, company, router, ruc]);
  return { ruc };
}
