"use client";

import { backend_url } from "@/constants/config";
import { UserSchemaIN } from "@/lib/validations/user";
import { useSession } from "next-auth/react";
import {
  createContext,
  Dispatch,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

interface DatesFilterContextType {
  loading: boolean;
}

export const datesFilterContext = createContext<DatesFilterContextType | null>(
  null
);

export const DatesFilterProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [loading, setLoading] = useState(false);

  const value = useMemo(
    () => ({
      loading,
    }),
    [loading]
  );

  return (
    <datesFilterContext.Provider value={value}>
      {children}
    </datesFilterContext.Provider>
  );
};

export function useDatesFilter() {
  const context = useContext(datesFilterContext);
  if (!context) {
    throw new Error("useDatesFilter should be used inside of provider");
  }
  return context;
}
