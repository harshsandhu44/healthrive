import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

import { BillingContent } from './billing-content';

export default async function BillingPage() {
  const { userId, orgId } = await auth();

  if (!userId) {
    redirect('/sign-in');
  }

  if (!orgId) {
    redirect('/dashboard');
  }

  return <BillingContent />;
}
