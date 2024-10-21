'use client'; // This is required for using React hooks in this component

import { ThemeProvider } from 'next-themes'; // Import the theme provider you're using
import { NFTProvider } from '@/context/NFTContext'; // Import your custom NFTProvider

export function Providers({ children }) {
  return (
    <ThemeProvider attribute="class">  {/* Ensures theme support for dark/light modes */}
      <NFTProvider>
        {children} {/* All components in the app will have access to both contexts */}
      </NFTProvider>
    </ThemeProvider>
  );
}
