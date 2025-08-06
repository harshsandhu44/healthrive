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
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import {
  LayoutDashboardIcon,
  PhoneCallIcon,
  User2Icon,
  Stethoscope,
  PlusIcon,
  Settings2Icon,
} from "lucide-react";
import { Logo } from "../icons";
import { CreateAppointmentModal } from "../modals/create-appointment-modal";

export const AppSidebar = ({
  ...props
}: React.ComponentProps<typeof Sidebar>) => {
  const navItems = [
    { icon: LayoutDashboardIcon, label: "Dashboard", href: "/dashboard" },
    { icon: PhoneCallIcon, label: "Appointments", href: "/appointments" },
    { icon: User2Icon, label: "Patients", href: "/patients" },
    { icon: Stethoscope, label: "Doctors", href: "/doctors" },
  ];

  const footerItems = [
    { icon: Settings2Icon, label: "Settings", href: "/settings" },
  ];

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu className="space-y-4">
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link href="/dashboard">
                <Logo className="size-8" />
                <span className="text-base font-semibold">Healthrive</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <CreateAppointmentModal>
                <Button className="justify-start w-full" variant="outline">
                  <PlusIcon />
                  Create an Appointment
                </Button>
              </CreateAppointmentModal>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.label}>
                  <SidebarMenuButton
                    asChild
                    className="data-[slot=sidebar-menu-button]:!p-1.5"
                  >
                    <Button
                      asChild
                      className="justify-start w-full"
                      variant="ghost"
                    >
                      <Link href={item.href}>
                        <item.icon />
                        {item.label}
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
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {footerItems.map((item) => (
                <SidebarMenuItem key={item.label}>
                  <SidebarMenuButton
                    asChild
                    className="data-[slot=sidebar-menu-button]:!p-1.5"
                  >
                    <Button
                      asChild
                      className="justify-start w-full"
                      variant="ghost"
                    >
                      <Link href={item.href}>
                        <item.icon />
                        {item.label}
                      </Link>
                    </Button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <UserButton
          showName
          appearance={{
            elements: {
              rootBox: "w-full",
              userButtonTrigger: "w-full justify-start",
              userButtonBox: "flex-row-reverse",
              userButtonOuterIdentifier: "font-medium",
            },
          }}
        />
      </SidebarFooter>
    </Sidebar>
  );
};
