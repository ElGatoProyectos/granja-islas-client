"use client";

import { backend_url } from "@/constants/config";
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
import { useUserInfo } from "../user-context";
import { useCompanySession } from "../company-context";
import { useDebounce } from "@/hooks/use-debounce";
import {
  responseArraySchema,
  responseSchema,
} from "@/lib/validations/response";
import { paginationSchema } from "@/lib/validations/pagination";
import {
  paymentGeneralArraySchemaIN,
  PaymentGeneralSchemaIN,
} from "@/lib/validations/payment";
import { userArraySchemaIN, UserSchemaIN } from "@/lib/validations/user";

interface PaymentContextType {
  payments: PaymentGeneralSchemaIN[];
  getPayments: () => Promise<void>;
  loading: boolean;
  totalPages: number;
  totalElements: number;
  limit: number;
  setLimit: Dispatch<SetStateAction<number>>;
  currentPage: number;
  setCurrentPage: Dispatch<SetStateAction<number>>;
  search: string;
  setSearch: Dispatch<SetStateAction<string>>;
  month: string;
  setMonth: Dispatch<SetStateAction<string>>;
  year: string;
  setYear: Dispatch<SetStateAction<string>>;
  usersFilters: UserSchemaIN[];
  setUserId: Dispatch<SetStateAction<string>>;
  updateState: ({
    idVoucher,
    statusNew,
  }: {
    idVoucher: string;
    statusNew: string;
  }) => Promise<void>;
}

export const PaymentContext = createContext<PaymentContextType | null>(null);

export const PaymentProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { tokenBack } = useUserInfo();
  const { company } = useCompanySession();
  const [payments, setPayments] = useState<PaymentGeneralSchemaIN[]>([]);
  const [loading, setLoading] = useState(false);
  /* pagination */
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  /* filters */
  const [search, setSearch] = useState("");
  const input = useDebounce(search);
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [usersFilters, setUsersFilters] = useState<UserSchemaIN[]>([]);
  const [userId, setUserId] = useState("");

  /* change status */

  const getPayments = useCallback(async () => {
    if (!company) return;
    if (!tokenBack) return;
    setLoading(true);

    try {
      const queryParams = new URLSearchParams();
      if (currentPage) queryParams.append("page", currentPage.toString());
      if (limit) queryParams.append("limit", limit.toString());
      if (input) queryParams.append("filter", input);
      if (month) queryParams.append("month", month);
      if (year) queryParams.append("year", year);
      if (userId) queryParams.append("user_group_id", userId);

      const url = `${backend_url}/api/vouchers/report?${queryParams
        .toString()
        .replace(/%2C/g, ",")}`;

      const res = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${tokenBack}`,
          ruc: company.ruc,
        },
      });

      /* filterUsers */
      const resUsers = await fetch(`${backend_url}/api/users`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${tokenBack}`,
        },
      });
      const resUsersJSON = await resUsers.json();
      const { payload: dataUsers, error: ErrorUsers } =
        responseArraySchema.parse(resUsersJSON);
      if (ErrorUsers) {
        throw new Error("error to fetch users");
      }
      const parseusers = userArraySchemaIN.parse(dataUsers);
      setUsersFilters(parseusers);
      /* filterUsers */
      const resJSON = await res.json();
      console.log("resJSON", resJSON);
      const { error, message, statusCode, payload } =
        responseSchema.parse(resJSON);
      if (error) {
        throw new Error("error to fetch payments");
      }

      const {
        data,
        limit: maxLimit,
        page,
        pageCount,
        total,
      } = paginationSchema.parse(payload);
      const formatdata = paymentGeneralArraySchemaIN.parse(payload.data);

      setPayments(formatdata);
      setTotalPages(pageCount);
      setTotalElements(total);
      setCurrentPage(page);
      setLimit(maxLimit);
    } catch (error) {
      throw new Error("error to fetch payments");
    } finally {
      setLoading(false);
    }
  }, [company, tokenBack, currentPage, limit, input, month, year, userId]);

  useEffect(() => {
    getPayments();
  }, [getPayments]);

  const updateState = useCallback(
    async ({
      idVoucher,
      statusNew,
    }: {
      idVoucher: string;
      statusNew: string;
    }) => {
      if (!company) return;
      if (!tokenBack) return;

      const url = `${backend_url}/api/vouchers/${idVoucher}?status=${statusNew}`;
      const res = await fetch(url, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${tokenBack}`,
          ruc: company.ruc,
        },
      });

      const data = await res.json();
      if (data.error) {
        throw new Error("error to update status");
      }
      await getPayments();
    },
    [company, getPayments, tokenBack]
  );

  const value = useMemo(
    () => ({
      payments,
      loading,
      getPayments,
      limit,
      setLimit,
      currentPage,
      setCurrentPage,
      totalPages,
      totalElements,
      setSearch,
      search,
      setMonth,
      month,
      setYear,
      year,
      usersFilters,
      setUserId,
      updateState,
    }),
    [
      payments,
      loading,
      getPayments,
      limit,
      currentPage,
      totalPages,
      totalElements,
      search,
      month,
      year,
      usersFilters,
      setUserId,
      updateState,
    ]
  );
  return (
    <PaymentContext.Provider value={value}>{children}</PaymentContext.Provider>
  );
};

export function usePayment() {
  const context = useContext(PaymentContext);
  if (!context) {
    throw new Error("usePayment should be used inside of provider");
  }
  return context;
}
