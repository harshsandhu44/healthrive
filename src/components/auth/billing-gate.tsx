import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

interface BillingGateProps {
  children: React.ReactNode;
}

export function BillingGate({ children }: BillingGateProps) {
  const { has } = auth();

  const hasPaidPlan = has({ plan: 'individual_practitioner' });

  if (!hasPaidPlan) {
    redirect('/billing');
  }

  return <>{children}</>;
}
