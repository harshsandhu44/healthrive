'use client';

import { useOrganization, useOrganizationList, useUser } from '@clerk/nextjs';

import { CreateOrganization } from './create-organization';
import { OrganizationSelector } from './organization-selector';

export function OrganizationGate({ children }: { children: React.ReactNode }) {
  const { user, isLoaded: userLoaded } = useUser();
  const { organization, isLoaded: orgLoaded } = useOrganization();
  const { userMemberships, isLoaded: orgListLoaded } = useOrganizationList();

  const isLoaded = userLoaded && orgLoaded && orgListLoaded;

  const organizationList =
    userMemberships.data?.map(membership => membership.organization) || [];

  console.info('🛡️ OrganizationGate: State check', {
    userLoaded,
    orgLoaded,
    orgListLoaded,
    isLoaded,
    hasUser: !!user,
    hasOrganization: !!organization,
    userMemberships: userMemberships,
    organizationList: organizationList,
    organizationListType: typeof organizationList,
    organizationListLength: organizationList?.length,
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
      organizations: organizationList,
    });
    return <OrganizationSelector />;
  }

  // User has no organizations
  if (!organizationList || organizationList.length === 0) {
    console.info('➕ OrganizationGate: Showing create organization', {
      organizationListNull: organizationList === null,
      organizationListUndefined: organizationList === undefined,
      organizationListLength: organizationList?.length,
      organizationListEmpty: organizationList?.length === 0,
      userMembershipsData: userMemberships.data,
      userMembershipsCount: userMemberships.count,
    });
    return <CreateOrganization />;
  }

  // User has organization selected, show children (dashboard)
  console.info('✅ OrganizationGate: Showing dashboard', {
    organizationId: organization?.id,
  });
  return <>{children}</>;
}
