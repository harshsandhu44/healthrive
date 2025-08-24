"use client";

import { createClient } from "@/lib/db/client";
import { LogOutIcon } from "lucide-react";
import { redirect } from "next/navigation";

interface SignOutProps {
  iconOnly?: boolean;
  className?: string;
}

export function SignOut({ iconOnly = false, className }: SignOutProps) {
  const supabase = createClient();

  const signOut = () => {
    supabase.auth.signOut();
    redirect("/sign-in");
  };

  return (
    <form action={signOut}>
      <button type="submit" className={className}>
        {iconOnly ? <LogOutIcon className="text-destructive" /> : "Sign Out"}
      </button>
    </form>
  );
}
