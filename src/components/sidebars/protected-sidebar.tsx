import { OrganizationSwitcher } from '@clerk/nextjs';
import {
  BellIcon,
  ChartAreaIcon,
  LayoutDashboardIcon,
  StethoscopeIcon,
} from 'lucide-react';
import Link from 'next/link';
import * as React from 'react';

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
} from '@/components/ui/sidebar';
import { UserButton } from '@/components/user-button';

export function ProtectedSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const nav = [
    {
      label: 'Dashboard',
      href: '/dashboard',
      icon: LayoutDashboardIcon,
    },
    {
      label: 'Doctors',
      href: '/doctors',
      icon: StethoscopeIcon,
    },
    {
      label: 'Appointments',
      href: '/appointments',
      icon: BellIcon,
    },
    {
      label: 'Analytics',
      href: '/analytics',
      icon: ChartAreaIcon,
    },
  ];

  return (
    <Sidebar collapsible='offcanvas' {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className='data-[slot=sidebar-menu-button]:!p-1.5'
            >
              <Link href='/dashboard'>
                <span className='text-base font-semibold'>Healthrive</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className='data-[slot=sidebar-menu-button]:!p-1.5'
            >
              <OrganizationSwitcher hidePersonal />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent className='flex flex-col gap-2'>
            <SidebarMenu>
              {nav.map(item => (
                <SidebarMenuItem key={item.label}>
                  <SidebarMenuButton asChild tooltip={item.label}>
                    <Link href={item.href}>
                      {item.icon && <item.icon />}
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <UserButton />
      </SidebarFooter>
    </Sidebar>
  );
}
