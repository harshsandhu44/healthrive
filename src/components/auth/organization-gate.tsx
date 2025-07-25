'use client';

import {
  useOrganization,
  useOrganizationList,
  useUser,
  has,
} from '@clerk/nextjs';

import { CreateOrganization } from './create-organization';
import { OrganizationSelector } from './organization-selector';

export function OrganizationGate({ children }: { children: React.ReactNode }) {
  const { user, isLoaded: userLoaded } = useUser();
  const { organization, isLoaded: orgLoaded } = useOrganization();
  const { userMemberships, isLoaded: orgListLoaded } = useOrganizationList({
    userMemberships: true, // This is required to fetch the organizations
  });

  const isLoaded = userLoaded && orgLoaded && orgListLoaded;

  console.info('🛡️ OrganizationGate: Simplified state check', {
    isLoaded,
    hasUser: !!user,
    hasActiveOrganization: !!organization,
    organizationId: organization?.id,
    organizationName: organization?.name,
    userMembershipsCount: userMemberships.count,
  });

  // Loading state
  if (!isLoaded || !user) {
    return (
      <div className='flex h-screen items-center justify-center'>
        <div className='h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-gray-900' />
      </div>
    );
  }

  // Has active organization - check for valid plan
  if (organization) {
    const hasPaidPlan = has({ plan: 'individual_practitioner' });
    const isFreeUser = !hasPaidPlan;

    console.info(
      '✅ OrganizationGate: Active organization found, checking plan',
      {
        organizationId: organization.id,
        hasPaidPlan,
        isFreeUser,
      }
    );

    if (isFreeUser) {
      return (
        <div className='flex h-screen items-center justify-center p-4'>
          <div className='mx-auto max-w-md space-y-4 rounded-lg border bg-card p-6 text-card-foreground shadow-lg'>
            <div className='space-y-2'>
              <h2 className='text-2xl font-semibold tracking-tight'>
                Upgrade Required
              </h2>
              <p className='text-sm text-muted-foreground'>
                Your organization needs a paid plan to access the dashboard.
                Free plans are not allowed.
              </p>
            </div>
            <button
              type='button'
              className='inline-flex h-10 w-full items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50'
              onClick={() => {
                window.location.href = '/billing';
              }}
            >
              Upgrade Plan
            </button>
          </div>
        </div>
      );
    }

    return <>{children}</>;
  }

  // Has organizations but none active - show selector
  if (userMemberships.count > 0) {
    console.info('📋 OrganizationGate: Organizations found, showing selector');
    return <OrganizationSelector />;
  }

  // No organizations - show create
  console.info('➕ OrganizationGate: No organizations, showing create');
  return <CreateOrganization />;
}
