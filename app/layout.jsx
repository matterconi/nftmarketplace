import PropTypes from 'prop-types';
import { Inter } from 'next/font/google';
import { ThemeProvider } from 'next-themes';
import './globals.css';
import './index.css'
import { Providers } from './providers';

import Navbar from '@/components/Navbar';
import { Footer } from '@/components';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'NFT Marketplace - Buy, Sell, and Discover Digital Art',
  description: 'Explore a diverse collection of NFTs, connect with creators, and invest in digital assets in our secure and intuitive NFT marketplace.',
  keywords: 'NFT marketplace, digital art, buy NFTs, sell NFTs, blockchain, crypto art, collectibles',
  ogTitle: 'NFT Marketplace - Explore, Buy, and Sell Unique Digital Art',
  ogDescription: 'A premier NFT marketplace for discovering unique digital collectibles. Buy, sell, and interact directly with creators on a secure blockchain platform.',
  ogImage: '/path/to/your-og-image.jpg', // Replace with the path to an Open Graph image
  twitterTitle: 'NFT Marketplace | Discover Unique Digital Art',
  twitterDescription: 'Join the NFT revolution. Discover, buy, and sell digital collectibles on our secure marketplace.',
  favicon: '/logo02.png', // Replace with the actual path to logo2
};

const RootLayout = ({ children }) => (
  <html lang="en">
    <head>
      <meta charSet="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="description" content={metadata.description} />
      <meta name="keywords" content={metadata.keywords} />
      <meta property="og:title" content={metadata.ogTitle} />
      <meta property="og:description" content={metadata.ogDescription} />
      <meta property="og:image" content={metadata.ogImage} />
      <meta property="og:type" content="website" />
      <meta name="twitter:title" content={metadata.twitterTitle} />
      <meta name="twitter:description" content={metadata.twitterDescription} />
      <meta name="twitter:card" content="summary_large_image" />
      <link rel="icon" href={metadata.favicon} type="image/png" /> {/* Web icon */}
      <title>{metadata.title}</title>
    </head>
    <body className={inter.className}>
      <Providers> 
        <div className="dark:bg-nft-dark bg-white">
          <Navbar />
          <main className='dark:bg-nft-dark bg-white relative pt-65 w-full'>{children}</main>
          <Footer/>
        </div>
      </Providers>
    </body>
  </html>
);

RootLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default RootLayout;
