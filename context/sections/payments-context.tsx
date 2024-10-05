"use client";

import { BACKEND_URL } from "@/constants/config";
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
import { getUsers } from "@/service/users";
import { statusPayment_formatSpanish } from "@/constants/status-payment";
import { formatDate } from "@/utils/format-date";
import { formatWithCommas } from "@/utils/format-number-comas";

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
  exportExcel: () => any;
  deleteVoucher: (idVoucher: number) => void;
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

  const getFilters = useCallback(async () => {
    if (!tokenBack) return;
    const resUsersJSON = await getUsers({ tokenBack });
    const { payload: dataUsers, error: ErrorUsers } =
      responseArraySchema.parse(resUsersJSON);
    if (ErrorUsers) {
      throw new Error("error to fetch users");
    }
    const parseusers = userArraySchemaIN.parse(dataUsers);
    setUsersFilters(parseusers);
  }, [tokenBack]);

  useEffect(() => {
    getFilters();
  }, [getFilters]);

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

      const url = `${BACKEND_URL}/api/vouchers/report?${queryParams
        .toString()
        .replace(/%2C/g, ",")}`;

      const res = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${tokenBack}`,
          ruc: company.ruc,
        },
      });

      const resJSON = await res.json();
      const { error, payload } = responseSchema.parse(resJSON);
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
      const formatdata = paymentGeneralArraySchemaIN.parse(data);

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

  const exportExcel = useCallback(async () => {
    if (!company) return;
    if (!tokenBack) return;
    setLoading(true);

    try {
      const queryParams = new URLSearchParams();
      queryParams.append("page", "1");
      queryParams.append("limit", "10000");
      if (input) queryParams.append("filter", input);
      if (month) queryParams.append("month", month);
      if (year) queryParams.append("year", year);
      if (userId) queryParams.append("user_group_id", userId);

      const url = `${BACKEND_URL}/api/vouchers/report?${queryParams
        .toString()
        .replace(/%2C/g, ",")}`;

      const res = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${tokenBack}`,
          ruc: company.ruc,
        },
      });
      const resJSON = await res.json();
      const { error, payload } = responseSchema.parse(resJSON);
      if (error) {
        throw new Error("error to fetch payments");
      }
      const { data } = paginationSchema.parse(payload);
      const formatdata = paymentGeneralArraySchemaIN.parse(data);

      const updatedDocuments = formatdata.map((document) => {
        const foundType = statusPayment_formatSpanish.find(
          (type) => type.value === document.status
        );
        if (foundType) {
          document.status = foundType.label as
            | "PENDING"
            | "APPROVED"
            | "REFUSED";
        }
        document.date = formatDate(document.date);
        const newdf =
          document.exchange_rate === 1 ? "" : document.exchange_rate;
        document.exchange_rate = newdf as number;

        return document;
      });

      return updatedDocuments;
    } catch (error) {
      throw new Error("error to fetch payments");
    } finally {
      setLoading(false);
    }
  }, [company, tokenBack, input, month, year, userId]);

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

      const url = `${BACKEND_URL}/api/vouchers/${idVoucher}?status=${statusNew}`;
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

  const deleteVoucher = useCallback(
    async (idVoucher: number) => {
      if (!company) return;
      if (!tokenBack) return;

      const url = `${BACKEND_URL}/api/vouchers/${idVoucher}`;
      const res = await fetch(url, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${tokenBack}`,
          ruc: company.ruc,
        },
      });

      if (!res.ok) {
        const data = await res.json();
        if (data.error) {
          throw new Error("Error deleting voucher");
        }
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
      exportExcel,
      deleteVoucher,
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
      updateState,
      exportExcel,
      deleteVoucher,
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
