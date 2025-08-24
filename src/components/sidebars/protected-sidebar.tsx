import Link from "next/link";
import {
  LayoutDashboardIcon,
  SettingsIcon,
  StethoscopeIcon,
  UserIcon,
  UsersIcon,
} from "lucide-react";

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
import { Settings } from "@/app/(protected)/components/settings";
import { UserProfile } from "@/app/(protected)/components/user-profile";

export async function ProtectedSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const items = [
    {
      icon: LayoutDashboardIcon,
      label: "Dashboard",
      href: { pathname: "/dashboard" },
    },
    { icon: UsersIcon, label: "Patients", href: { pathname: "/patients" } },
    {
      icon: StethoscopeIcon,
      label: "Appointments",
      href: { pathname: "/appointments" },
    },
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
                    <Button asChild variant="ghost" className="justify-start">
                      <Link href={item.href}>
                        {item.icon && <item.icon />}
                        <span>{item.label}</span>
                      </Link>
                    </Button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <Settings>
          <Button variant="ghost" className="justify-start">
            <SettingsIcon />
            <span>Settings</span>
          </Button>
        </Settings>
        <UserProfile>
          <Button variant="ghost" className="justify-start">
            <UserIcon />
            <span>Profile</span>
          </Button>
        </UserProfile>
      </SidebarFooter>
    </Sidebar>
  );
}
