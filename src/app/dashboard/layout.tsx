import type { PropsWithChildren } from 'react';

import { BillingGate, OrganizationGate } from '@/components/auth';

export default function DashboardLayout({ children }: PropsWithChildren) {
  return (
    <OrganizationGate>
      <BillingGate>{children}</BillingGate>
    </OrganizationGate>
  );
}
