"use client";

import type { PropsWithChildren } from "react";
import { ThemeProvider } from "./theme-provider";

export const RootProvider = ({ children }: PropsWithChildren) => {
  return <ThemeProvider>{children}</ThemeProvider>;
};
