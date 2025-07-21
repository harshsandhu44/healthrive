import { SignedIn, SignedOut } from '@clerk/nextjs';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import { UserButton } from '@/components/user-button';

const HomePage = () => {
  return (
    <div className='flex min-h-screen flex-col items-center justify-center gap-4 p-8'>
      <div className='absolute top-4 right-4 flex items-center gap-2'>
        <UserButton />
        <ThemeToggle />
      </div>
      <h1 className='text-4xl font-bold text-foreground'>
        Welcome to Healthrive
      </h1>
      <p className='text-lg text-muted-foreground font-medium'>
        Explore our platform and start your journey to better health.
      </p>

      <SignedOut>
        <div className='flex gap-2'>
          <Button asChild>
            <Link href='/sign-up'>Get Started</Link>
          </Button>
          <Button asChild variant='outline'>
            <Link href='/sign-in'>Sign In</Link>
          </Button>
        </div>
      </SignedOut>

      <SignedIn>
        <Button asChild>
          <Link href='/dashboard'>Go to Dashboard</Link>
        </Button>
      </SignedIn>
    </div>
  );
};

export default HomePage;
