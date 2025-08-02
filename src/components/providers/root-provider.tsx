import type { PropsWithChildren } from "react";
import { ClerkProvider } from "@clerk/nextjs";

export const RootProvider = ({ children }: PropsWithChildren) => {
  return <ClerkProvider>{children}</ClerkProvider>;
};
