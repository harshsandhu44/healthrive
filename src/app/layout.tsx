import type { Metadata } from 'next';
import type { PropsWithChildren } from 'react';

import { RootProvider } from '@/components/providers';
import './globals.css';

export const metadata: Metadata = {
  title: 'Healthrive by Vylune',
  description:
    'Healthrive is a comprehensive health and wellness platform designed to empower individuals to take control of their health and well-being.',
};

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body>
        <RootProvider>{children}</RootProvider>
      </body>
    </html>
  );
}
