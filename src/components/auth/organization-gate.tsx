'use client';

import { useOrganization, useOrganizationList, useUser } from '@clerk/nextjs';

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

  // Has active organization - show dashboard
  if (organization) {
    console.info(
      '✅ OrganizationGate: Active organization found, showing dashboard'
    );
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
