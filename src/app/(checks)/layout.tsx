import { PublicHeader } from "@/components/headers/public-header";
import { Preloader } from "@/components/Preloader";
import { ClerkLoaded, ClerkLoading } from "@clerk/nextjs";
import type { PropsWithChildren } from "react";

export default function AuthLayout({ children }: PropsWithChildren) {
  return (
    <div className="container min-h-screen">
      <ClerkLoading>
        <Preloader />
      </ClerkLoading>
      <ClerkLoaded>
        <PublicHeader />
        <div className="py-16">{children}</div>
      </ClerkLoaded>
    </div>
  );
}
