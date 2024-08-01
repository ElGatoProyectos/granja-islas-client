"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { type ThemeProviderProps } from "next-themes/dist/types";

import { AuthProvider } from "./auth-provider";
import { CompanyProvider } from "./company-context";
import { UserInfoProvider } from "./user-context";
import { SupplierProvider } from "./supplier-context";

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <AuthProvider>
      <NextThemesProvider {...props}>
        <UserInfoProvider>
          <CompanyProvider>
            <SupplierProvider>{children}</SupplierProvider>
          </CompanyProvider>
        </UserInfoProvider>
      </NextThemesProvider>
    </AuthProvider>
  );
}
