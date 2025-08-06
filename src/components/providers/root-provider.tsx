import type { PropsWithChildren } from "react";
import { ClerkProvider } from "@clerk/nextjs";
import { ConsentProvider } from "./consent-provider";
import { ThemeProvider } from "./theme-provider";

export const RootProvider = ({ children }: PropsWithChildren) => {
  return (
    <ClerkProvider>
      <ThemeProvider>
        <ConsentProvider>
          {children}
        </ConsentProvider>
      </ThemeProvider>
    </ClerkProvider>
  );
};
