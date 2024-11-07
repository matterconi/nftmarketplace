'use client';

import { ApolloProvider } from '@apollo/client';
import client from '../apolloClient'; // Adjust path as needed
import { ThemeProvider } from 'next-themes';
import { NFTProvider } from '@/context/NFTContext';
import { GrantProvider } from '@/context/GrantContext';
import { DashboardProvider } from '@/context/DashboardContext';

export function Providers({ children }) {
  return (
    <ApolloProvider client={client}>
      <ThemeProvider attribute="class">
        <NFTProvider>
          <GrantProvider>
            <DashboardProvider>
              {children}
            </DashboardProvider>
          </GrantProvider>
        </NFTProvider>
      </ThemeProvider>
    </ApolloProvider>
  );
}
