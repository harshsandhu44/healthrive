import { redirect } from "next/navigation";

import { SignOut } from "@/app/(protected)/components/sign-out";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { getUserWithProfile } from "@/lib/db/auth";

export async function ProtectedHeader() {
  const { user, profile } = await getUserWithProfile();

  if (!user || !profile) {
    redirect("/sign-in");
  }

  const firstName = user.user_metadata?.first_name || "";
  const lastName = user.user_metadata?.last_name || "";
  const account_type = profile.account_type || "";

  const title = `Dr. ${firstName} ${lastName}`;

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <span className="text-base font-medium line-clamp-1">{title}</span>
        <Badge variant="secondary" className="capitalize">
          {account_type.split("_").join(" ")}
        </Badge>

        <div className="ml-auto">
          <SignOut
            iconOnly
            className={buttonVariants({ variant: "ghost", size: "sm" })}
          />
        </div>
      </div>
    </header>
  );
}
