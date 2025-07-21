'use client';

import { OrganizationSwitcher, UserButton } from '@clerk/nextjs';
import { useOrganization } from '@clerk/nextjs';
import Link from 'next/link';

import { ThemeToggle } from '@/components/theme-toggle';
import { Button } from '@/components/ui/button';

export default function DashboardPage() {
  const { organization } = useOrganization();

  return (
    <div className='min-h-screen p-8'>
      <div className='flex items-center justify-between mb-8'>
        <div>
          <h1 className='text-3xl font-bold'>Dashboard</h1>
          {organization && (
            <p className='text-sm text-muted-foreground mt-1'>
              {organization.name}
            </p>
          )}
        </div>
        <div className='flex items-center gap-4'>
          <OrganizationSwitcher />
          <UserButton />
          <ThemeToggle />
        </div>
      </div>

      <div className='max-w-4xl'>
        <p className='text-lg text-muted-foreground mb-6'>
          Welcome to your Healthrive dashboard! This is a protected page that
          requires authentication and organization membership.
        </p>

        <Button asChild variant='outline'>
          <Link href='/'>Back to Home</Link>
        </Button>
      </div>
    </div>
  );
}
