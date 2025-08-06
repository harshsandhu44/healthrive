import { Preloader } from "@/components/Preloader";
import { ClerkLoaded, ClerkLoading } from "@clerk/nextjs";
import { PropsWithChildren } from "react";

export default function AuthLayout({ children }: PropsWithChildren) {
  return (
    <div className="container min-h-screen flex flex-col justify-center gap-6">
      <ClerkLoading>
        <Preloader />
      </ClerkLoading>
      <ClerkLoaded>{children}</ClerkLoaded>
    </div>
  );
}
