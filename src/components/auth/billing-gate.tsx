import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

interface BillingGateProps {
  children: React.ReactNode;
}

export async function BillingGate({ children }: BillingGateProps) {
  const { has } = await auth();

  const hasPaidPlan = has({ plan: 'individual_practitioner' });

  if (!hasPaidPlan) {
    redirect('/billing');
  }

  return <>{children}</>;
}
