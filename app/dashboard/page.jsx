'use client'

import React, { useState } from 'react';
import { ethers } from 'ethers';
import { useDashboard } from '../../context/DashboardContext';

const Dashboard = () => {
  const {
    setMarketplaceAddress,
    setAdminAddress,
    setGrantContractAddress,
    updateListingPrice,
    isOwner,
    userAddress
  } = useDashboard();

  const [newMarketplaceAddress, setNewMarketplaceAddress] = useState('');
  const [newAdminAddress, setNewAdminAddress] = useState('');
  const [newGrantAddress, setNewGrantAddress] = useState('');
  const [newListingPrice, setNewListingPrice] = useState('');

  if (!isOwner) return <div className="text-center text-red-600 mt-10">You are not authorized to access this page.</div>;

  return (
    <div className="flex flex-col items-center p-10 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-semibold text-gray-800 mb-8">Admin Dashboard</h1>
      <p className="text-gray-600 mb-6">Admin Wallet Address: <span className="font-semibold">{userAddress}</span></p>

      <div className="w-full max-w-md bg-white shadow-md rounded-lg p-6 space-y-8">
        <div>
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Set Contract Addresses</h2>
          <div className="space-y-4">
            {/* Input for Marketplace Address */}
            <div className="flex flex-col">
              <input
                type="text"
                placeholder="New Marketplace Address"
                value={newMarketplaceAddress}
                onChange={(e) => setNewMarketplaceAddress(e.target.value)}
                className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={() => setMarketplaceAddress(newMarketplaceAddress)}
                className="mt-2 px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700"
              >
                Set Marketplace Address
              </button>
            </div>

            {/* Input for Admin Address */}
            <div className="flex flex-col">
              <input
                type="text"
                placeholder="New Admin Address"
                value={newAdminAddress}
                onChange={(e) => setNewAdminAddress(e.target.value)}
                className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={() => setAdminAddress(newAdminAddress)}
                className="mt-2 px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700"
              >
                Set Admin Address
              </button>
            </div>

            {/* Input for Grant Contract Address */}
            <div className="flex flex-col">
              <input
                type="text"
                placeholder="New Grant Contract Address"
                value={newGrantAddress}
                onChange={(e) => setNewGrantAddress(e.target.value)}
                className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={() => setGrantContractAddress(newGrantAddress)}
                className="mt-2 px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700"
              >
                Set Grant Contract Address
              </button>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Update Listing Price</h2>
          <div className="flex flex-col">
            <input
              type="text"
              placeholder="New Listing Price (in ether)"
              value={newListingPrice}
              onChange={(e) => setNewListingPrice(e.target.value)}
              className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={() => updateListingPrice(ethers.utils.parseEther(newListingPrice))}
              className="mt-2 px-4 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700"
            >
              Update Listing Price
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
