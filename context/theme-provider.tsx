"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { type ThemeProviderProps } from "next-themes/dist/types";

import { AuthProvider } from "./auth-provider";
import { CompanyProvider } from "./user-context";

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <AuthProvider>
      <NextThemesProvider {...props}>
        <CompanyProvider>{children}</CompanyProvider>
      </NextThemesProvider>
    </AuthProvider>
  );
}
