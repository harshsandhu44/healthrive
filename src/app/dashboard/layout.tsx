import type { PropsWithChildren } from 'react';

import { ClientBillingGate, OrganizationGate } from '@/components/auth';

export default function DashboardLayout({ children }: PropsWithChildren) {
  return (
    <OrganizationGate>
      <ClientBillingGate>{children}</ClientBillingGate>
    </OrganizationGate>
  );
}
