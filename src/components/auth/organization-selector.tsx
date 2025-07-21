'use client';

import { OrganizationSwitcher } from '@clerk/nextjs';

export function OrganizationSelector() {
  return (
    <div className='min-h-screen bg-gray-50 flex items-center justify-center p-4'>
      <div className='w-full max-w-md text-center'>
        <h1 className='text-2xl font-bold text-gray-900 mb-6'>
          Select Organization
        </h1>
        <OrganizationSwitcher
          afterSelectOrganizationUrl='/dashboard'
          appearance={{
            elements: {
              rootBox: 'w-full',
              organizationSwitcherTrigger: 'w-full justify-center',
            },
          }}
        />
      </div>
    </div>
  );
}
