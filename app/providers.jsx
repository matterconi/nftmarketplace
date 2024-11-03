'use client';

import { ThemeProvider } from 'next-themes';
import { NFTProvider } from '@/context/NFTContext';
import { GrantProvider } from '@/context/GrantContext';

export function Providers({ children }) {
  return (
    <ThemeProvider attribute="class">
      <NFTProvider>
        <GrantProvider>
          {children}
        </GrantProvider>
      </NFTProvider>
    </ThemeProvider>
  );
}

