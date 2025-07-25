'use client';

import { PricingTable, useOrganization } from '@clerk/nextjs';

import { Button } from '@/components/ui/button';

export function BillingContent() {
  const { organization } = useOrganization();

  return (
    <div className='container mx-auto max-w-4xl px-4 py-8'>
      <div className='mb-8 text-center'>
        <h1 className='mb-2 text-3xl font-bold tracking-tight'>
          Choose Your Plan
        </h1>
        <p className='text-lg text-muted-foreground'>
          Select the right plan for your healthcare practice
        </p>
        {organization && (
          <p className='mt-2 text-sm text-muted-foreground'>
            Organization:{' '}
            <span className='font-medium'>{organization.name}</span>
          </p>
        )}
      </div>

      <div className='mx-auto max-w-6xl'>
        <PricingTable forOrganizations />
      </div>

      <div className='mt-8 text-center'>
        <Button
          variant='ghost'
          onClick={() => (window.location.href = '/dashboard')}
        >
          ← Back to Dashboard
        </Button>
      </div>
    </div>
  );
}
