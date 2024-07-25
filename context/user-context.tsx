"use client";

import { Session } from "next-auth";
import { getSession, useSession } from "next-auth/react";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

type RoleType = "SUPERADMIN" | "ADMIN" | "USER";

type UserContextType = {
  email: `${string}@${string}`;
  full_name: string;
  role: RoleType;
};

type User = {
  email: `${string}@${string}`;
  id: number;
  full_name: string;
  role: RoleType;
  iat: number;
  exp: number;
  jti: string;
};

type SessionType = {
  user: User;
  expires: Date;
};

interface ExtendedSession extends Session {
  token?: {
    user: {
      id: number;
      role: RoleType;
      full_name: string;
      tokenBack: string;
    };
  };
}

export const UserSessionContext = createContext<ExtendedSession | null>(null);

export const UserSessionProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { data: session, status } = useSession();

  console.log("session", session);
  // const sessionData = {
  //   token: {
  //     id: (session as ExtendedSession).token.user.id,
  //     role: (session as ExtendedSession).token.user.role,
  //     full_name: (session as ExtendedSession).token.user.full_name,
  //     tokenBack: (session as ExtendedSession).token.user.tokenBack,
  //   },
  //   expires: session?.expires,
  // };

  return (
    <UserSessionContext.Provider value={session}>
      {children}
    </UserSessionContext.Provider>
  );
};

export function useUserSession() {
  const context = useContext(UserSessionContext);
  if (!context) {
    throw new Error("useUsersession");
  }
  return context;
}
