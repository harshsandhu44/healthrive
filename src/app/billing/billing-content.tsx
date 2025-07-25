'use client';

import { PricingTable, useOrganization } from '@clerk/nextjs';
import { useSearchParams } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { PAID_PLANS, getPlanDisplayName, PaidPlan } from '@/lib/constants';

export function BillingContent() {
  const { organization } = useOrganization();
  const searchParams = useSearchParams();
  const currentPlan = searchParams.get('current');

  const getCurrentPlanDisplay = () => {
    return getPlanDisplayName(currentPlan);
  };

  const getPageTitle = () => {
    const currentPlanDisplay = getCurrentPlanDisplay();
    if (currentPlanDisplay) {
      return `Upgrade from ${currentPlanDisplay}`;
    }
    return 'Choose Your Plan';
  };

  const getPageDescription = () => {
    const currentPlanDisplay = getCurrentPlanDisplay();
    if (currentPlanDisplay) {
      return `You're currently on the ${currentPlanDisplay}. Upgrade to access more features for your healthcare practice.`;
    }
    return 'Select the right plan for your healthcare practice and unlock powerful features.';
  };

  const getBackButtonText = () => {
    const organizationPlan = organization?.publicMetadata?.plan as string;
    if (getPlanDisplayName(organizationPlan)) {
      return '← Continue with Current Plan';
    }
    return '← Back to Dashboard';
  };

  const handleBackNavigation = () => {
    // If user has a valid plan, go to dashboard, otherwise stay on billing
    const organizationPlan = organization?.publicMetadata?.plan as string;

    if (PAID_PLANS.includes(organizationPlan as PaidPlan)) {
      window.location.href = '/dashboard';
    } else {
      // Could redirect to a different page or show a message
      window.location.href = '/dashboard';
    }
  };

  return (
    <div className='container mx-auto max-w-4xl px-4 py-8'>
      <div className='mb-8 text-center'>
        <h1 className='mb-2 text-3xl font-bold tracking-tight'>
          {getPageTitle()}
        </h1>
        <p className='text-lg text-muted-foreground'>{getPageDescription()}</p>
        {organization && (
          <div className='mt-4 space-y-1'>
            <p className='text-sm text-muted-foreground'>
              Organization:{' '}
              <span className='font-medium'>{organization.name}</span>
            </p>
            {getCurrentPlanDisplay() && (
              <p className='text-xs text-muted-foreground'>
                Current Plan: {getCurrentPlanDisplay()}
              </p>
            )}
          </div>
        )}
      </div>

      <div className='mx-auto max-w-6xl'>
        <PricingTable forOrganizations />
      </div>

      <div className='mt-8 text-center'>
        <Button variant='ghost' onClick={handleBackNavigation}>
          {getBackButtonText()}
        </Button>
      </div>
    </div>
  );
}
