'use client';

import { ApolloProvider } from '@apollo/client';
import client from '../apolloClient'; // Adjust path as needed
import { ThemeProvider } from 'next-themes';
import { NFTProvider } from '@/context/NFTContext';
import { GrantProvider } from '@/context/GrantContext';

export function Providers({ children }) {
  return (
    <ApolloProvider client={client}>
      <ThemeProvider attribute="class">
        <NFTProvider>
          <GrantProvider>
            {children}
          </GrantProvider>
        </NFTProvider>
      </ThemeProvider>
    </ApolloProvider>
  );
}
