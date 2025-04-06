'use client';

import { PropsWithChildren } from 'react';
import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from 'next-themes';
import ImpersonationBanner from '@/components/ImpersonationBanner';

export default function Providers({ children }: PropsWithChildren) {
  return (
    <SessionProvider>
      <ThemeProvider attribute="class">
        <ImpersonationBanner />
        {children}
      </ThemeProvider>
    </SessionProvider>
  );
} 