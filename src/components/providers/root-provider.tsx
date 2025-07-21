'use client';

import type { PropsWithChildren } from 'react';

import { ClerkProvider } from './clerk-provider';
import { SupabaseProvider } from './supabase-provider';
import { ThemeProvider } from './theme-provider';

export const RootProvider = ({ children }: PropsWithChildren) => {
  return (
    <ClerkProvider>
      <SupabaseProvider>
        <ThemeProvider>{children}</ThemeProvider>
      </SupabaseProvider>
    </ClerkProvider>
  );
};
