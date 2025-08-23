import { LayoutDashboardIcon, StethoscopeIcon, UsersIcon } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

export async function ProtectedSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const items = [
    { icon: LayoutDashboardIcon, label: "Dashboard", href: "/dashboard" },
    { icon: UsersIcon, label: "Patients", href: "/patients" },
    { icon: StethoscopeIcon, label: "Appointments", href: "/appointments" },
  ];

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton className="p-3">
              <span className="text-xl font-mono">Vylune</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent className="flex flex-col gap-2">
            <SidebarMenu>
              <SidebarMenuItem className="flex items-center gap-2">
                {/* TODO: quick action button */}
              </SidebarMenuItem>
            </SidebarMenu>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.label}>
                  <SidebarMenuButton asChild tooltip={item.label}>
                    <Button variant="ghost" className="justify-start">
                      {item.icon && <item.icon />}
                      <span>{item.label}</span>
                    </Button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        {/* TODO: settings */}
        {/* TODO: user profile popover */}
      </SidebarFooter>
    </Sidebar>
  );
}
