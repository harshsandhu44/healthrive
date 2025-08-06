import { PublicHeader } from "@/components/headers/public-header";
import type { PropsWithChildren } from "react";

export default function PublicLayout({ children }: PropsWithChildren) {
  return (
    <div>
      <PublicHeader />
      {children}
    </div>
  );
}
