import { ProtectedHeader } from "@/components/headers";
import { ProtectedSidebar } from "@/components/sidebars";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default function ProtectedLayout({ children }: LayoutProps<"/">) {
  return (
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
        <div className="@container/main flex flex-1 flex-col gap-2">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
