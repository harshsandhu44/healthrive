"use client";

import {
  SignedIn,
  SignedOut,
  UserButton as ClerkUserButton,
} from "@clerk/nextjs";
import { LogIn } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

export function UserButton() {
  return (
    <>
      <SignedIn>
        <ClerkUserButton
          appearance={{
            elements: {
              avatarBox: "w-8 h-8",
            },
          }}
        />
      </SignedIn>
      <SignedOut>
        <Button asChild variant="outline" size="sm">
          <Link href="/sign-in">
            <LogIn className="mr-2 h-4 w-4" />
            Sign In
          </Link>
        </Button>
      </SignedOut>
    </>
  );
}
