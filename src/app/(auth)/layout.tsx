import { Logo } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Preloader } from "@/components/Preloader";
import { ClerkLoaded, ClerkLoading } from "@clerk/nextjs";
import { HomeIcon } from "lucide-react";
import { PropsWithChildren } from "react";
import Link from "next/link";

export default function AuthLayout({ children }: PropsWithChildren) {
  return (
    <div className="mx-auto flex h-screen max-w-[400px] flex-col items-center justify-center gap-6">
      <div className="w-full grid grid-cols-3 items-center gap-4">
        <Button asChild size="icon" variant="ghost">
          <Link href="/">
            <HomeIcon />
          </Link>
        </Button>
        <div className="flex items-center gap-x-2">
          <Logo className="size-12 aspect-square" />
          <span className="text-lg font-black">Healthrive</span>
        </div>
        <div />
      </div>
      <ClerkLoading>
        <Preloader />
      </ClerkLoading>
      <ClerkLoaded>{children}</ClerkLoaded>
    </div>
  );
}
