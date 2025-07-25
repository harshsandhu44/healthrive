import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

import { PAID_PLANS } from '@/lib/constants';

import { OrganizationGate } from './organization-gate';

interface DashboardGateProps {
  children: React.ReactNode;
}

export async function DashboardGate({ children }: DashboardGateProps) {
  const { userId, orgId, has } = await auth();

  // Check if user is authenticated
  if (!userId) {
    redirect('/sign-in');
  }

  // If no organization, show organization selection UI
  if (!orgId) {
    return <OrganizationGate>{children}</OrganizationGate>;
  }

  // Check if organization has any of the valid paid plans
  const hasPaidPlan = PAID_PLANS.some(plan => has({ plan }));

  if (!hasPaidPlan) {
    redirect('/billing');
  }

  // User has organization and paid plan - show dashboard
  return <>{children}</>;
}
