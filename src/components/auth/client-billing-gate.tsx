'use client';

import { useOrganization } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { isPaidPlan } from '@/lib/constants';

interface ClientBillingGateProps {
  children: React.ReactNode;
}

export function ClientBillingGate({ children }: ClientBillingGateProps) {
  const { organization, isLoaded } = useOrganization();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && organization) {
      const currentPlan = organization.publicMetadata?.plan as string;

      if (!isPaidPlan(currentPlan)) {
        // Pass current plan (or lack thereof) to billing page via URL params
        const billingUrl = currentPlan
          ? `/billing?current=${encodeURIComponent(currentPlan)}`
          : '/billing';
        router.push(billingUrl);
        return;
      }
    }
  }, [isLoaded, organization, router]);

  // Loading state
  if (!isLoaded) {
    return (
      <div className='flex h-screen items-center justify-center'>
        <div className='h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-gray-900' />
      </div>
    );
  }

  // If no organization, let OrganizationGate handle it
  if (!organization) {
    return <>{children}</>;
  }

  // Check plan in metadata (fallback for client-side)
  const currentPlan = organization.publicMetadata?.plan as string;

  if (!isPaidPlan(currentPlan)) {
    // Will redirect via useEffect, show loading
    return (
      <div className='flex h-screen items-center justify-center'>
        <div className='h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-gray-900' />
      </div>
    );
  }

  return <>{children}</>;
}
