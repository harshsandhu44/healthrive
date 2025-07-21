'use client';

import { useOrganization, useOrganizationList, useUser } from '@clerk/nextjs';

import { CreateOrganization } from './create-organization';
import { OrganizationSelector } from './organization-selector';

export function OrganizationGate({ children }: { children: React.ReactNode }) {
  const { user, isLoaded: userLoaded } = useUser();
  const { organization, isLoaded: orgLoaded } = useOrganization();
  const { organizationList, isLoaded: orgListLoaded } = useOrganizationList();

  const isLoaded = userLoaded && orgLoaded && orgListLoaded;

  console.info('🛡️ OrganizationGate: State check', {
    userLoaded,
    orgLoaded,
    orgListLoaded,
    isLoaded,
    hasUser: !!user,
    hasOrganization: !!organization,
    organizationCount: organizationList?.length || 0,
    organizationId: organization?.id,
    organizationName: organization?.name,
  });

  // Remove redirect logic since OrganizationGate is used in dashboard layout

  if (!isLoaded || !user) {
    console.info('⏳ OrganizationGate: Loading state');
    return (
      <div className='flex h-screen items-center justify-center'>
        <div className='h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-gray-900' />
      </div>
    );
  }

  // User has organization(s) but none selected
  if (organizationList && organizationList.length > 0 && !organization) {
    console.info('📋 OrganizationGate: Showing organization selector', {
      organizationCount: organizationList.length,
    });
    return <OrganizationSelector organizations={organizationList} />;
  }

  // User has no organizations
  if (!organizationList || organizationList.length === 0) {
    console.info('➕ OrganizationGate: Showing create organization');
    return <CreateOrganization />;
  }

  // User has organization selected, show children (dashboard)
  console.info('✅ OrganizationGate: Showing dashboard', {
    organizationId: organization?.id,
  });
  return <>{children}</>;
}
