'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useTheme } from 'next-themes';

import images from '../assets';
import Input from './Input';

const SearchBar = ({ activeSelect, setActiveSelect, handleSearch, clearSearch }) => {
    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const { theme } = useTheme();
    const [toggle, setToggle] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const timer = setTimeout(() => {
            setSearch(debouncedSearch);
        }, 300);

        return () => clearTimeout(timer);
    }, [debouncedSearch]);

    useEffect(() => {
        if (search) {
            handleSearch(search);
        } else {
            clearSearch();
        }
    }, [search, handleSearch, clearSearch]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setToggle(false); // Close dropdown if click is outside
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleSelect = (item) => {
        setActiveSelect(item);
        setToggle(false); // Close the dropdown after selection
    };

    return (
        <>
            <div className='flex-1 flexCenter dark:bg-nft-black-2 bg-white border dark:border-nft-black-2 border-nft-gray-2 px-2 py-3 rounded-md'>
                <Image src={images.search} alt="search_icon" width={20} height={20} style={{ objectFit: 'contain' }} className={theme === 'light' ? 'filter invert' : ''} />
                <input
                    type="text"
                    placeholder="Search for NFTs, creators, or collectibles..."
                    className="dark:bg-nft-black-2 bg-white mx-4 w-full dark:text-white text-nft-black-1 font-normal text-xs outline-none"
                    onChange={(e) => setDebouncedSearch(e.target.value)}
                    value={debouncedSearch}
                />
            </div>
            <div 
                ref={dropdownRef} // Reference for click detection outside
                onClick={() => setToggle(!toggle)} // Toggle on click
                className='relative flexBetween ml-4 sm:ml-0 sm:mt-2 min-w-190 cursor-pointer dark:bg-nft-black-2 bg-white border dark:border-nft-black-2 border-nft-gray-2 p-2 rounded-md'
            >
                <p className='font-poppins dark:text-white text-nft-black-1 font-normal text-xs'>
                    {activeSelect}
                </p>
                <Image 
                    src={images.arrow} 
                    alt="arrow_icon" 
                    width={15} 
                    height={15} 
                    style={{ objectFit: 'contain', width: 'auto', height: 'auto' }} // Ensuring aspect ratio maintenance
                    className={theme === 'light' ? 'filter invert' : ''} 
                />

                {toggle && (
                    <div className='absolute top-full left-0 right-0 w-full mt-3 z-10 dark:bg-nft-black-2 bg-white border dark:border-nft-black-2 border-nft-gray-2 p-2 rounded-md py-3 px-4'>
                        {['Recently Listed', 'Price (low to high)', 'Price (high to low)'].map((item) => (
                            <p 
                                className='font-poppins dark:text-white text-nft-black-1 font-normal text-xs my-3 cursor-pointer' 
                                onClick={() => handleSelect(item)} // Handle selection and close
                                key={item}
                            >
                                {item}
                            </p>
                        ))}
                    </div>
                )}
            </div>
        </>
    )
}

export default SearchBar;
