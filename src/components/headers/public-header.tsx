import { UserButton } from "@clerk/nextjs";
import { Logo } from "@/components/icons";
import Link from "next/link";

export const PublicHeader = () => {
  return (
    <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear">
      <div className="flex container w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <Link href="/" className="inline-flex items-center gap-2">
          <Logo className="size-6" />
          <span className="font-bold">Healthrive</span>
        </Link>
        <div className="ml-auto flex items-center gap-2">
          <UserButton />
        </div>
      </div>
    </header>
  );
};
