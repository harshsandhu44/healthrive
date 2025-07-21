import { UserButton } from '@clerk/nextjs';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';

export default function DashboardPage() {
  return (
    <div className='min-h-screen p-8'>
      <div className='flex items-center justify-between mb-8'>
        <h1 className='text-3xl font-bold'>Dashboard</h1>
        <div className='flex items-center gap-2'>
          <UserButton />
          <ThemeToggle />
        </div>
      </div>

      <div className='max-w-4xl'>
        <p className='text-lg text-muted-foreground mb-6'>
          Welcome to your Healthrive dashboard! This is a protected page that
          requires authentication.
        </p>

        <Button asChild variant='outline'>
          <Link href='/'>Back to Home</Link>
        </Button>
      </div>
    </div>
  );
}
