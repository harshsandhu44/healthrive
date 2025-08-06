import type { PropsWithChildren } from "react";
import { ClerkProvider } from "@clerk/nextjs";
import { ConsentProvider } from "./consent-provider";

export const RootProvider = ({ children }: PropsWithChildren) => {
  return (
    <ClerkProvider>
      <ConsentProvider>
        {children}
      </ConsentProvider>
    </ClerkProvider>
  );
};
