"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { type ThemeProviderProps } from "next-themes/dist/types";
import { UserSessionProvider } from "./user-context";
import { AuthProvider } from "./auth-provider";

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <AuthProvider>
      <NextThemesProvider {...props}>
        <UserSessionProvider>{children}</UserSessionProvider>
      </NextThemesProvider>
    </AuthProvider>
  );
}
