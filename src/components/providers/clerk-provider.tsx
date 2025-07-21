'use client';

import { ClerkProvider as NextClerkProvider } from '@clerk/nextjs';
import type { PropsWithChildren } from 'react';

export function ClerkProvider({ children }: PropsWithChildren) {
  return <NextClerkProvider>{children}</NextClerkProvider>;
}
