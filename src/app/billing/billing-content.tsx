'use client';

import { useOrganization } from '@clerk/nextjs';
import { Check, CreditCard } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export function BillingContent() {
  const { organization } = useOrganization();

  const handleUpgrade = async () => {
    // TODO: Integrate with your payment provider (Stripe, etc.)
    console.info('Upgrading organization:', organization?.id);
    alert('Billing integration would be implemented here.');
  };

  return (
    <div className='container mx-auto max-w-4xl px-4 py-8'>
      <div className='mb-8 text-center'>
        <h1 className='mb-2 text-3xl font-bold tracking-tight'>
          Upgrade Your Plan
        </h1>
        <p className='text-lg text-muted-foreground'>
          Choose the Individual Practitioner plan to access all features
        </p>
        {organization && (
          <p className='mt-2 text-sm text-muted-foreground'>
            Organization:{' '}
            <span className='font-medium'>{organization.name}</span>
          </p>
        )}
      </div>

      <div className='mx-auto max-w-md'>
        <Card>
          <CardHeader className='text-center'>
            <CardTitle>Individual Practitioner</CardTitle>
            <CardDescription>
              <span className='text-3xl font-bold text-foreground'>$29</span>
              <span className='text-muted-foreground'>/month</span>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className='space-y-3'>
              <li className='flex items-center'>
                <Check className='mr-2 h-4 w-4 text-green-500' />
                <span className='text-sm'>Full dashboard access</span>
              </li>
              <li className='flex items-center'>
                <Check className='mr-2 h-4 w-4 text-green-500' />
                <span className='text-sm'>Patient management</span>
              </li>
              <li className='flex items-center'>
                <Check className='mr-2 h-4 w-4 text-green-500' />
                <span className='text-sm'>Appointment scheduling</span>
              </li>
              <li className='flex items-center'>
                <Check className='mr-2 h-4 w-4 text-green-500' />
                <span className='text-sm'>Analytics and reporting</span>
              </li>
              <li className='flex items-center'>
                <Check className='mr-2 h-4 w-4 text-green-500' />
                <span className='text-sm'>Priority support</span>
              </li>
            </ul>
          </CardContent>
          <CardFooter className='flex flex-col space-y-4'>
            <Button onClick={handleUpgrade} className='w-full'>
              <CreditCard className='mr-2 h-4 w-4' />
              Upgrade Now
            </Button>
            <p className='text-center text-xs text-muted-foreground'>
              Cancel anytime. No hidden fees.
            </p>
          </CardFooter>
        </Card>
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
