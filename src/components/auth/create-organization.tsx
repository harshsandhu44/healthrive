'use client';

import { CreateOrganization as ClerkCreateOrganization } from '@clerk/nextjs';

export function CreateOrganization() {
  return (
    <div className='min-h-screen bg-gray-50 flex items-center justify-center p-4'>
      <div className='w-full max-w-md'>
        <ClerkCreateOrganization
          afterCreateOrganizationUrl='/dashboard'
          appearance={{
            elements: {
              rootBox: 'w-full',
              card: 'w-full shadow-lg',
            },
          }}
        />
      </div>
    </div>
  );
}
