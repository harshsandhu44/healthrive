import type { PropsWithChildren } from 'react';

import { DashboardGate } from '@/components/auth';

export default function DashboardLayout({ children }: PropsWithChildren) {
  return <DashboardGate>{children}</DashboardGate>;
}
