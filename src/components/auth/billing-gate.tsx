import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

import { PAID_PLANS } from '@/lib/constants';

interface BillingGateProps {
  children: React.ReactNode;
}

export async function BillingGate({ children }: BillingGateProps) {
  const { has } = await auth();

  // Check if user has any of the valid paid plans
  const hasPaidPlan = PAID_PLANS.some(plan => has({ plan }));

  if (!hasPaidPlan) {
    redirect('/billing');
  }

  return <>{children}</>;
}
