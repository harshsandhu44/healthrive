import type { PropsWithChildren } from 'react';

import { OrganizationGate } from '@/components/auth';

export default function DashboardLayout({ children }: PropsWithChildren) {
  return <OrganizationGate>{children}</OrganizationGate>;
}
