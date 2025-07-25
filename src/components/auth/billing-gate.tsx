import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

interface BillingGateProps {
  children: React.ReactNode;
}

// Define valid paid plans (should match client-side)
const PAID_PLANS = ['individual_practitioner'] as const;

export async function BillingGate({ children }: BillingGateProps) {
  const { has } = await auth();

  // Check if user has any of the valid paid plans
  const hasPaidPlan = PAID_PLANS.some(plan => has({ plan }));

  if (!hasPaidPlan) {
    redirect('/billing');
  }

  return <>{children}</>;
}
