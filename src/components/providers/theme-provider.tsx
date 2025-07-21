'use client';

import { ThemeProvider as NextThemesProvider } from 'next-themes';
import type { ComponentProps, PropsWithChildren } from 'react';

type ThemeProviderProps = ComponentProps<typeof NextThemesProvider>;

export function ThemeProvider({
  children,
  ...props
}: PropsWithChildren<ThemeProviderProps>) {
  return (
    <NextThemesProvider
      attribute='class'
      defaultTheme='light'
      // disableTransitionOnChange
      {...props}
    >
      {children}
    </NextThemesProvider>
  );
}
