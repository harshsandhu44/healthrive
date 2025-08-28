import type { Metadata } from "next";

import { RootProvider } from "@/components/providers";
import { ProtectedHeader } from "@/components/headers";
import { ProtectedSidebar } from "@/components/sidebars";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

import "./globals.css";

export const metadata: Metadata = {
  title: "Vylune",
  description:
    "Vylune is a healthcare platform that provides a comprehensive solution for healthcare providers and patients.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <RootProvider>
          <SidebarProvider
            style={
              {
                "--sidebar-width": "calc(var(--spacing) * 72)",
                "--header-height": "calc(var(--spacing) * 12)",
              } as React.CSSProperties
            }
          >
            <ProtectedSidebar variant="inset" />
            <SidebarInset>
              <ProtectedHeader />
              <div className="@container/main container p-4 lg:p-6 max-h-[calc(100vh-64px)] flex flex-1 flex-col gap-2 overflow-y-auto">
                {children}
              </div>
            </SidebarInset>
          </SidebarProvider>
        </RootProvider>
      </body>
    </html>
  );
}
