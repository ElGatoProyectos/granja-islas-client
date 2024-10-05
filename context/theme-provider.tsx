"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { type ThemeProviderProps } from "next-themes/dist/types";

import { AuthProvider } from "./auth-provider";
import { CompanyProvider } from "./company-context";
import { UserInfoProvider } from "./user-context";
import { Suspense } from "react";

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <AuthProvider>
      <NextThemesProvider {...props}>
        <UserInfoProvider>
          <CompanyProvider>{children}</CompanyProvider>
        </UserInfoProvider>
      </NextThemesProvider>
    </AuthProvider>
  );
}
