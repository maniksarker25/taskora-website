'use client';

import BidCard from '@/components/Bids/BidCard';
import { useGetMyBidsQuery } from '@/lib/features/bidApi/bidApi';
import { AlertCircle, CheckCircle2, Clock, Inbox, LayoutGrid, XCircle } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import popularcateIcon from '../../../../public/popularcate.svg';
import srvcporvider from '../../../../public/women.svg';

const bidStatusCategories = [
  {
    name: 'bidMade',
    displayName: 'Bids Made',
    icon: <Clock size={16} />,
    description: "Tasks you've proposed to work on.",
  },
  {
    name: 'bidReceived',
    displayName: 'Bids Received',
    icon: <Inbox size={16} />,
    description: 'Proposals sent by others for your tasks.',
  },
  {
    name: 'IN_PROGRESS',
    displayName: 'Ongoing',
    icon: <LayoutGrid size={16} />,
    description: 'Active tasks currently in development.',
  },
  {
    name: 'COMPLETED',
    displayName: 'Completed',
    icon: <CheckCircle2 size={16} />,
    description: 'Successfully finished assignments.',
  },
  {
    name: 'DISPUTE',
    displayName: 'Disputes',
    icon: <AlertCircle size={16} />,
    description: 'Tasks requiring mediation.',
  },
  {
    name: 'CANCELLED',
    displayName: 'Cancelled',
    icon: <XCircle size={16} />,
    description: 'Tasks that were terminated.',
  },
];

const MyBids = () => {
  const [activeTab, setActiveTab] = useState('bidMade');
  const { data, isLoading, isFetching, error, refetch } = useGetMyBidsQuery(activeTab);

  const activeCategory = bidStatusCategories.find((cat) => cat.name === activeTab);
  const tasks = data?.data?.result || [];
  const totalTasks = data?.data?.meta?.total || 0;

  useEffect(() => {
    refetch();
  }, [activeTab, refetch]);

  // Loading Skeleton Component for a "Human" feel
  const SkeletonCard = () => (
    <div className="bg-white border border-slate-100 rounded-2xl p-5 animate-pulse">
      <div className="w-full h-40 bg-slate-100 rounded-xl mb-4" />
      <div className="h-4 bg-slate-100 rounded w-3/4 mb-2" />
      <div className="h-3 bg-slate-100 rounded w-1/2" />
    </div>
  );

  return (
    <section className="min-h-screen bg-[#FBFCFD] pb-20">
      {/* Header Section */}
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-[1240px] mx-auto px-4 py-10 md:py-16">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-teal-50 rounded-lg">
                  <Image src={popularcateIcon} alt="icon" height={20} width={20} />
                </div>
                <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight uppercase">
                  My Bid Manager
                </h1>
              </div>
              <p className="text-slate-500 text-sm font-medium">
                Track, manage, and finalize your service proposals in one dashboard.
              </p>
            </div>

            <div className="flex items-center gap-4 bg-slate-50 p-1.5 rounded-2xl border border-slate-100">
              <div className="px-5 py-2">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Global Status
                </p>
                <p className="text-xl font-black text-[#115e59]">
                  {totalTasks} <span className="text-xs font-bold text-slate-400">Total</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1240px] mx-auto px-4 mt-8">
        {/* Sticky Tabs Bar */}
        <div className="sticky top-0 z-30 bg-[#FBFCFD]/80 backdrop-blur-md py-4 mb-8">
          <div className="flex flex-nowrap overflow-x-auto gap-2 pb-2 scrollbar-hide">
            {bidStatusCategories.map((cat) => (
              <button
                key={cat.name}
                onClick={() => setActiveTab(cat.name)}
                className={`cursor-pointer flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold transition-all whitespace-nowrap border ${
                  activeTab === cat.name
                    ? 'bg-[#115e59] text-white border-[#115e59] shadow-lg shadow-teal-900/20 scale-105'
                    : 'bg-white text-slate-500 border-slate-100 hover:border-teal-200 hover:text-teal-700'
                }`}
              >
                {cat.icon}
                {cat.displayName}
                {activeTab === cat.name && (
                  <span className="ml-1 bg-white/20 px-2 py-0.5 rounded-md text-[10px]">
                    {totalTasks}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-100 rounded-2xl p-10 text-center max-w-lg mx-auto">
            <XCircle className="mx-auto text-red-400 mb-4" size={48} />
            <h2 className="text-lg font-bold text-red-900 mb-2">Sync Error</h2>
            <p className="text-red-600/70 text-sm mb-6">
              {error?.data?.message || "We couldn't refresh your bids."}
            </p>
            <button
              onClick={() => refetch()}
              className="px-8 py-3 bg-red-600 text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-red-700 transition-all"
            >
              Try Refreshing
            </button>
          </div>
        )}

        {/* Loading State */}
        {(isLoading || isFetching) && !error ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : (
          <>
            {/* Content State */}
            {tasks.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[2.5rem] border border-dashed border-slate-200">
                <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                  <Image
                    src={srvcporvider}
                    alt="No items"
                    width={50}
                    height={50}
                    className="grayscale opacity-30"
                  />
                </div>
                <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-2">
                  No {activeCategory?.displayName}
                </h3>
                <p className="text-slate-400 text-sm font-medium mb-8 max-w-xs text-center">
                  {activeCategory?.description}
                </p>
                {activeTab === 'bidMade' && (
                  <Link
                    href="/browseservice"
                    className="px-8 py-4 bg-[#115e59] text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] shadow-xl shadow-teal-900/20 hover:bg-teal-800 transition-all"
                  >
                    Find a Task to Bid
                  </Link>
                )}
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center justify-between px-2">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                    Displaying {tasks.length} Results
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {tasks.map((task) => (
                    <div
                      key={task._id}
                      className="transition-transform duration-300 hover:scale-[1.02]"
                    >
                      <BidCard task={task} />
                    </div>
                  ))}
                </div>

                {/* Pagination Section */}
                {data?.data?.meta?.totalPage > 1 && (
                  <div className="flex items-center justify-center gap-4 mt-12 pt-8 border-t border-slate-100">
                    <button className="p-3 rounded-xl bg-white border border-slate-200 text-slate-400 hover:text-teal-600 disabled:opacity-30">
                      <ArrowLeft size={20} />
                    </button>
                    <div className="flex gap-2">
                      <span className="h-10 w-10 flex items-center justify-center rounded-xl bg-[#115e59] text-white font-bold text-sm">
                        {data.data.meta.page}
                      </span>
                    </div>
                    <button className="p-3 rounded-xl bg-white border border-slate-200 text-slate-400 hover:text-teal-600">
                      <ArrowRight size={20} />
                    </button>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

// Helper components for icons not imported
const ArrowLeft = ({ size }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="m15 18-6-6 6-6" />
  </svg>
);
const ArrowRight = ({ size }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="m9 18 6-6-6-6" />
  </svg>
);

export default MyBids;
