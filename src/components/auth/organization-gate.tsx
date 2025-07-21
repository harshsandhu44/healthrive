'use client';

import { useOrganization, useOrganizationList, useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { CreateOrganization } from './create-organization';
import { OrganizationSelector } from './organization-selector';

export function OrganizationGate({ children }: { children: React.ReactNode }) {
  const { user, isLoaded: userLoaded } = useUser();
  const { organization, isLoaded: orgLoaded } = useOrganization();
  const { organizationList, isLoaded: orgListLoaded } = useOrganizationList();
  const router = useRouter();

  const isLoaded = userLoaded && orgLoaded && orgListLoaded;

  useEffect(() => {
    if (isLoaded && user && organization) {
      router.push('/dashboard');
    }
  }, [isLoaded, user, organization, router]);

  if (!isLoaded || !user) {
    return (
      <div className='flex h-screen items-center justify-center'>
        <div className='h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-gray-900' />
      </div>
    );
  }

  // User has organization(s) but none selected
  if (organizationList && organizationList.length > 0 && !organization) {
    return <OrganizationSelector organizations={organizationList} />;
  }

  // User has no organizations
  if (!organizationList || organizationList.length === 0) {
    return <CreateOrganization />;
  }

  // User has organization selected, show children (dashboard)
  return <>{children}</>;
}
