import { backend_url } from "@/constants/config";
import { useCompanySession } from "@/context/company-context";
import { useUserInfo } from "@/context/user-context";
import { labelArraySchemaIN, LabelSchemaIN } from "@/lib/validations/label";
import { useCallback, useEffect, useState } from "react";

export function useLabels() {
  const { tokenBack } = useUserInfo();
  const { company } = useCompanySession();
  const [labels, setLabels] = useState<LabelSchemaIN[]>([]);
  const [loading, setLoading] = useState(false);
  const [assignLabel, setAssignLabel] = useState<number[]>([]);

  const getLabels = useCallback(async () => {
    if (!company) return;
    if (!tokenBack) return;
    setLoading(true);
    try {
      const res = await fetch(`${backend_url}/api/labels`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${tokenBack}`,
          ruc: company?.ruc,
        },
      });

      if (!res.ok) {
        throw new Error("Failed to fetch labels");
      }

      const data = await res.json();
      const parseLabel = labelArraySchemaIN.parse(data.payload);
      setLabels(parseLabel.reverse());
    } catch (error) {
      console.error("Error to fetch data labels", error);
    } finally {
      setLoading(false);
    }
  }, [company, tokenBack]);

  useEffect(() => {
    getLabels();
  }, [getLabels]);

  const assignLabelToProduct = async ({
    id_product,
    getProductDetails,
  }: {
    id_product: string;
    getProductDetails: () => Promise<void>;
  }) => {
    if (!company) return;
    const res = await fetch(
      `${backend_url}/api/products/${id_product}/labels`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${tokenBack}`,
          ruc: company?.ruc,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          label_id: assignLabel,
        }),
      }
    );

    const data = await res.json();
    if (data.error) {
      throw new Error("Failed to asign labels");
    }

    await getProductDetails();
  };

  return {
    labels,
    loadingLabel: loading,
    getLabels,
    setAssignLabel,
    assignLabelToProduct,
  };
}
