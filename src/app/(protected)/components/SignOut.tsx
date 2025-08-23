"use client";

import { createClient } from "@/lib/db/client";
import { redirect } from "next/navigation";

interface SignOutProps {
  className?: string;
}

export function SignOut({ className }: SignOutProps) {
  const supabase = createClient();

  const signOut = () => {
    supabase.auth.signOut();
    redirect("/sign-in");
  };

  return (
    <form action={signOut}>
      <button type="submit" className={className}>
        Sign Out
      </button>
    </form>
  );
}
