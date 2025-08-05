import type { Metadata } from "next";
import type { PropsWithChildren } from "react";
import { APP_DESCRIPTION, APP_NAME } from "@/lib/constants";
import { RootProvider } from "@/components/providers";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: APP_NAME,
  description: APP_DESCRIPTION,
};

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <RootProvider>
          {children}
          <Toaster />
        </RootProvider>
      </body>
    </html>
  );
}
