"use client";

import Image from "next/image";
import { useState } from "react";
import srvcporvider from "../../../../public/women.svg";
import popularcateIcon from "../../../../public/popularcate.svg";
import Link from "next/link";

const bidStatusCategories = [
  {
    name: "Ongoing Task",
    status: "ACTIVE",
  },
  {
    name: "Bids Made", 
    status: "PENDING",
  },
  {
    name: "Bids Received",
    status: "ACCEPTED",
  },
   {
    name: "Completed Tasks",
    status: "WON",
  },
  {
    name: "Rejected Bids",
    status: "REJECTED",
  }
];

const MyBids = () => {
  const [activeTab, setActiveTab] = useState("Active Bids");

  // TODO: Add API call here when you have the endpoint
  // const { data: bidsData, isLoading, error } = useGetMyBidsQuery({
  //   status: activeStatus,
  //   limit: 20
  // });

  const isLoading = false; 
  const error = null;
  const bids = []; 
  const activeStatus = bidStatusCategories.find((cat) => cat.name === activeTab)?.status || "";

  const handleTabChange = (tabName) => {
    setActiveTab(tabName);
  };

  if (isLoading) {
    return (
      <section className="max-w-[1240px] mx-auto px-4 pb-28">
        <div className="flex flex-col gap-8">
          <div className="mt-16 md:mt-20 flex flex-col gap-5 md:flex-row justify-between md:items-center">
            <div>
              <div className="flex items-center gap-4">
                <Image
                  src={popularcateIcon}
                  alt="Popular Category"
                  height={24}
                  width={24}
                />
                <p className="font-semibold text-md md:text-xl text-color pb-3">
                  My Bids
                </p>
              </div>
            </div>
          </div>
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="max-w-[1240px] mx-auto px-4 pb-28">
        <div className="flex flex-col gap-8">
          <div className="mt-16 md:mt-20 flex flex-col gap-5 md:flex-row justify-between md:items-center">
            <div>
              <div className="flex items-center gap-4">
                <Image
                  src={popularcateIcon}
                  alt="Popular Category"
                  height={24}
                  width={24}
                />
                <p className="font-semibold text-md md:text-xl text-color pb-3">
                  My Bids
                </p>
              </div>
            </div>
          </div>
          <div className="text-center py-8">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Failed to Load Bids</h2>
            <p className="text-gray-600 mb-4">There was an error loading your bids.</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-[#115e59] text-white rounded-lg hover:bg-teal-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="max-w-[1240px] mx-auto px-4 pb-28">
      <div className="flex flex-col gap-8">
        <div className="mt-16 md:mt-20 flex flex-col gap-5 md:flex-row justify-between md:items-center">
          <div>
            <div className="flex items-center gap-4">
              <Image
                src={popularcateIcon}
                alt="Popular Category"
                height={24}
                width={24}
              />
              <p className="font-semibold text-md md:text-xl text-color pb-3">
                My Bids
              </p>
            </div>
          </div>
        </div>

        <div className="">
          {/* Tabs */}
          <div className="flex flex-wrap gap-3 mb-8">
            {bidStatusCategories.map((cat) => (
              <button
                key={cat.name}
                onClick={() => handleTabChange(cat.name)}
                className={`px-4 md:px-6 py-2 rounded-md text-sm font-medium transition cursor-pointer ${
                  activeTab === cat.name
                    ? "bg-[#115e59] text-white"
                    : "bg-[#e6f4f1] hover:bg-[#115e59] hover:text-white"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Bids Grid */}
          {bids?.length === 0 ? (
            <div className="text-center py-12">
              <div className="bg-gray-50 rounded-lg p-8 max-w-md mx-auto">
                <Image
                  src={srvcporvider}
                  alt="No bids"
                  width={80}
                  height={80}
                  className="mx-auto mb-4 opacity-50"
                />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No Bids Found
                </h3>
                <p className="text-gray-600 mb-4">
                  {activeTab === "Active Bids" 
                    ? "You haven't placed any active bids yet." 
                    : `You don't have any ${activeTab.toLowerCase()}.`
                  }
                </p>
                <Link 
                  href="/browseservice" 
                  className="inline-block px-6 py-2 bg-[#115e59] text-white rounded-lg hover:bg-teal-700 transition-colors"
                >
                  Browse Tasks to Bid
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {/* TODO: Map through actual bids data when API is available */}
              {/* {bids?.map((bid) => (
                <div key={bid._id}>
                  <Link href={`/bid/${bid._id}`}>
                    <BidCard 
                      bid={bid}
                      activeTab={activeTab}
                    />
                  </Link>
                </div>
              ))} */}
              
              {/* Temporary message until API is integrated */}
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">Bid data will appear here once the API is integrated.</p>
                <p className="text-sm text-gray-400">Active Tab: {activeTab} | Status: {activeStatus}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default MyBids;