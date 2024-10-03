"use client";

import {
  productDetailSchemaIN,
  ProductDetailSchemaIN,
} from "@/lib/validations/product";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useUserInfo } from "../user-context";
import { useCompanySession } from "../company-context";
import { BACKEND_URL } from "@/constants/config";
import { responseSchema } from "@/lib/validations/response";
import { useParams } from "next/navigation";

interface ProductDetailsContextType {
  productDetails?: ProductDetailSchemaIN;
  id_product: string;
  getProductDetails: () => Promise<void>;
  removeLabelOfProduct: ({ label_id }: { label_id: string }) => Promise<void>;
}

export const productDetailsContext =
  createContext<ProductDetailsContextType | null>(null);

export const ProductDetailsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { tokenBack } = useUserInfo();
  const { company } = useCompanySession();
  const [productDetails, setProductDetails] = useState<ProductDetailSchemaIN>();
  const { id } = useParams();
  const id_product = id as string;

  const getProductDetails = useCallback(async () => {
    if (!company) return;
    if (!tokenBack) return;

    try {
      const res = await fetch(`${BACKEND_URL}/api/products/${id_product}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${tokenBack}`,
          "Content-Type": "application/json",
          ruc: company?.ruc,
        },
      });

      const resJSON = await res.json();
      const { error, message, statusCode, payload } =
        responseSchema.parse(resJSON);

      if (error) {
        throw new Error("Failed to fetch receipt payment detail");
      }
      const parsePaymentReceipt = productDetailSchemaIN.parse(payload);
      setProductDetails(parsePaymentReceipt);
    } catch (error) {
      throw new Error("Failed to fetch receipt payment detail");
    }
  }, [company, id_product, tokenBack]);

  const removeLabelOfProduct = useCallback(
    async ({ label_id }: { label_id: string }) => {
      if (!company) return;
      if (!tokenBack) return;
      const res = await fetch(
        `${BACKEND_URL}/api//products/${id_product}/labels/${label_id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${tokenBack}`,
            "Content-Type": "application/json",
            ruc: company?.ruc,
          },
        }
      );
      const resJSON = await res.json();
      const { error, message, statusCode, payload } =
        responseSchema.parse(resJSON);
      if (error) {
        throw new Error("Failed to remove label to product");
      }
      getProductDetails();
    },
    [company, getProductDetails, id_product, tokenBack]
  );

  useEffect(() => {
    getProductDetails();
  }, [getProductDetails]);

  const value = useMemo(
    () => ({
      productDetails,
      id_product,
      getProductDetails,
      removeLabelOfProduct,
    }),
    [getProductDetails, id_product, productDetails, removeLabelOfProduct]
  );
  return (
    <productDetailsContext.Provider value={value}>
      {children}
    </productDetailsContext.Provider>
  );
};

export function useProductDetails() {
  const context = useContext(productDetailsContext);

  if (!context) {
    throw new Error("useProductDetails should be used inside of provider");
  }
  return context;
}
