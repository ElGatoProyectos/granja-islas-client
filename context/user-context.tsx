"use client";

import { BACKEND_URL } from "@/constants/config";
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

interface UserContextType {
  userInfo: UserSchemaIN | null;
  setUserInfo: Dispatch<SetStateAction<UserSchemaIN | null>>;
  loading: boolean;
  tokenBack: string;
  avatarURL: string;
  setavatarURL: Dispatch<SetStateAction<string>>;
  getUser: () => void;
}

interface DataUser {
  error: boolean;
  statusCode: number;
  message: string;
  payload: UserSchemaIN;
}

export const userInfoContext = createContext<UserContextType | null>(null);

export const UserInfoProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [userInfo, setUserInfo] = useState<UserSchemaIN | null>(null);
  const [avatarURL, setavatarURL] = useState("");
  const [loading, setLoading] = useState(false);
  const {
    data: session,
    status,
  }: { data: any; status: "loading" | "authenticated" | "unauthenticated" } =
    useSession();

  const getUser = useCallback(async () => {
    if (!session?.user?.id || !session?.user?.tokenBack) return;
    setLoading(true);

    try {
      const res = await fetch(`${BACKEND_URL}/api/users/${session.user.id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${session.user.tokenBack}`,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        throw new Error("Failed to fetch user");
      }
      const data: DataUser = await res.json();
      if (data.error) {
        throw new Error("Failed to fetch user backend");
      }

      setUserInfo(data.payload);
      setavatarURL(
        `${BACKEND_URL}/api/users/file/${
          data.payload.id
        }?t=${new Date().getTime()}`
      );
    } catch (error) {
      console.error("Error fetching user", error);
    } finally {
      setLoading(false);
    }
  }, [session?.user?.id, session?.user?.tokenBack]);

  useEffect(() => {
    if (status === "authenticated") {
      getUser();
    }
  }, [getUser, status]);

  const value = useMemo(
    () => ({
      userInfo,
      setUserInfo,
      loading,
      tokenBack: session?.user?.tokenBack,
      avatarURL,
      setavatarURL,
      getUser,
    }),
    [avatarURL, getUser, loading, session?.user?.tokenBack, userInfo]
  );

  return (
    <userInfoContext.Provider value={value}>
      {children}
    </userInfoContext.Provider>
  );
};

export function useUserInfo() {
  const context = useContext(userInfoContext);
  if (!context) {
    throw new Error("useUserInfo should be used inside of provider");
  }
  return context;
}
