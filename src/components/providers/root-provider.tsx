import type { PropsWithChildren } from "react";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/sonner";
import { PushNotificationProvider } from "./push-notification-provider";

export function RootProvider({ children }: PropsWithChildren) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <PushNotificationProvider />
      {children}
      <Toaster />
    </ThemeProvider>
  );
}
