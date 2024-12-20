'use client';

import { useTheme } from 'next-themes';
import { useState, useEffect, useContext } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import Button from './Button';
import { NFTContext } from '@/context/NFTContext';
import images from '../assets';

const MenuItems = ({ isMobile, active, setActive }) => {
  const generateLink = (item) => {
    if (item === 'Explore NFTs') return '/';
    const modifiedItem = item.toLowerCase().replace(' ', '-');
    return `/${modifiedItem}`;
  };

  return (
    <ul className={`list-none flexCenter flex-row ${isMobile ? 'flex-col h-full' : ''}`}>
      {['Explore NFTs', 'Listed NFTs', 'My NFTs'].map((item, index) => (
        <li
          key={index}
          onClick={() => { setActive(item); }}
          className={`flex flex-row items-center font-poppins font-semibold text-base dark:hover:text-white hover:text-nft-dark mx-3 ${
            active === item
              ? 'dark:text-white text-nft-black-1'
              : 'dark:text-nft-grey-3 text-nft-gray-2'
          } cursor-pointer `}
        >
          <Link href={generateLink(item)}>
            {item}
          </Link>
        </li>
      ))}
    </ul>
  );
};

const ButtonGroup = ({ setActive, router }) => {
  const { connectWallet, currentAccount } = useContext(NFTContext);

  return currentAccount ? (
    <Button
      btnName="Create"
      classStyles="mx-2 rounded-xl"
      handleClick={() => {
        setActive('');
        router.push('/create-nft');
      }}
    />
  ) : (
    <Button
      btnName="Connect"
      classStyles="mx-2 rounded-xl"
      handleClick={connectWallet}
    />
  );
};

const Navbar = () => {
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const pathname = usePathname();
  const [active, setActive] = useState('Explore NFTs');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setTheme('dark');
  }, []);

  useEffect(() => {
    const path = pathname;
    switch (path) {
      case '/':
        setActive('Explore NFTs');
        break;
      case '/listed-nfts':
        setActive('Listed NFTs');
        break;
      case '/my-nfts':
        setActive('My NFTs');
        break;
      default:
        setActive('');
    }

    setIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    // disable body scroll when navbar is open
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'visible';
    }
  }, [isOpen]);

  return (
    <nav className="flexBetween w-full fixed z-10 p-4 flex-row border-b dark:bg-nft-dark bg-white dark:border-nft-black-1 border-nft-gray-1">
      <div className="flex flex-1 flex-row justify-start">
        <Link href="/">
          <div className="flexCenter md:hidden cursor-pointer" onClick={() => {}}>
            <Image src={images.logo02} width={32} height={32} alt="logo" priority className='contain-fit'/>
            <p className="dark:text-white text-nft-black-1 font-semibold text-lg ml-1">CryptoKet</p>
          </div>
        </Link>
        <Link href="/">
          <div className="hidden md:flex cursor-pointer" onClick={() => {}}>
            <Image src={images.logo02} className='contain-fit' width={32} height={32} alt="logo" priority />
          </div>
        </Link>
      </div>

      <div className="flex flex-initial flex-row justify-end">
        <div className="flex items-center mr-2">
          <input
            type="checkbox"
            className="checkbox"
            id="checkbox"
            onChange={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          />
          <label htmlFor="checkbox" className="flexBetween w-8 h-4 bg-black rounded-2xl p-1 relative label">
            <i className="fas fa-sun" aria-hidden />
            <i className="fas fa-moon" aria-hidden />
            <div className="w-3 h-3 absolute bg-white rounded-full ball" />
          </label>
        </div>
      </div>

      <div className="md:hidden flex">
        <MenuItems active={active} setActive={setActive} />
        <div className="ml-4">
          <ButtonGroup setActive={setActive} router={router} />
        </div>
      </div>

      <div className="hidden md:flex ml-2">
        {isOpen
          ? (
            <Image
              src={images.cross}
              width={24}
              height={24}
              alt="close"
              onClick={() => setIsOpen(false)}
              className={theme === 'light' ? 'filter invert contain-fit' : 'contain-fit'}
            />
          ) : (
            <Image
              src={images.menu}
              width={24}
              height={24}
              alt="menu"
              onClick={() => setIsOpen(true)}
              className={theme === 'light' ? 'filter invert contain-fit' : 'contain-fit'}
            />
          )}

        {isOpen && (
          <div className="fixed inset-0 top-65 min-h-[calc(100vh-65px)] dark:bg-nft-dark bg-white z-10 nav-h flex justify-between flex-col">
            <div className="flex-1 p-4 relative top-[-32]">
              <MenuItems isMobile active={active} setActive={setActive} setIsOpen={setIsOpen}/>
            </div>
            <div className="p-4 border-t dark:border-nft-black-1 border-nft-gray-1 w-full">
              <div className="w-full flex align-center">
                <ButtonGroup setActive={setActive} router={router} />
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
