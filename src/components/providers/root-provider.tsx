"use client";

import type { PropsWithChildren } from "react";
import { ClerkProvider } from "./clerk-provider";
import { ThemeProvider } from "./theme-provider";

export const RootProvider = ({ children }: PropsWithChildren) => {
  return (
    <ClerkProvider>
      <ThemeProvider>{children}</ThemeProvider>
    </ClerkProvider>
  );
};
