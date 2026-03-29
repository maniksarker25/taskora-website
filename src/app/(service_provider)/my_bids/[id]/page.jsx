'use client';
import ProviderBids from '@/components/my_bids/ProviderBids';
import ProviderProgress from '@/components/my_bids/ProviderProgress';
import Cancelled from '@/components/my_tasks/Cancelled';
import Completed from '@/components/my_tasks/Completed';
import ResolutionModal from '@/components/my_tasks/ResolutionModal';
import { useGetBidsByTaskIdQuery } from '@/lib/features/bidApi/bidApi';
import { useGetTaskByIdQuery } from '@/lib/features/task/taskApi';
import {
  Calendar,
  Clock,
  Handshake,
  Hash,
  MapPin,
  MoreHorizontal,
  Share2,
  ShieldCheck,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { FaArrowLeftLong } from 'react-icons/fa6';

const BidsDetails = () => {
  const params = useParams();
  const taskId = params.id;
  const [currentStatus, setCurrentStatus] = useState('Bids');
  const [showResolutionModal, setShowResolutionModal] = useState(false);
  const [activeImage, setActiveImage] = useState(0);

  const { data: taskData, isLoading } = useGetTaskByIdQuery(taskId);
  const taskDetails = taskData?.data;
  const { data: bidsData } = useGetBidsByTaskIdQuery(taskId);

  const tabForStatus = useMemo(() => {
    const s = taskDetails?.status;
    if (s === 'ASSIGNED' || s === 'IN_PROGRESS') return 'Progress';
    if (s === 'COMPLETED') return 'Completed';
    if (s === 'CANCELLED') return 'Cancelled';
    return 'Bids';
  }, [taskDetails?.status]);

  useEffect(() => {
    setCurrentStatus(tabForStatus);
  }, [tabForStatus]);

  if (isLoading)
    return (
      <div className="h-screen flex items-center justify-center bg-white">
        <div className="w-8 h-8 border-4 border-teal-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* 1. Ultra-Thin Global Header */}
      <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link
            href="/my_bids"
            className="flex items-center gap-2 text-slate-500 hover:text-teal-700 transition-colors"
          >
            <FaArrowLeftLong size={14} />
            <span className="text-xs font-bold uppercase tracking-wider">Back to Dashboard</span>
          </Link>
          <div className="flex items-center gap-3">
            <button className="p-2 hover:bg-slate-100 rounded-full transition-colors">
              <Share2 size={16} className="text-slate-400" />
            </button>
            <button className="p-2 hover:bg-slate-100 rounded-full transition-colors">
              <MoreHorizontal size={16} className="text-slate-400" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* LEFT: PRIMARY CONTENT */}
          <div className="lg:col-span-8 space-y-10">
            {/* Title & Badge */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="px-3 py-1 bg-teal-50 border border-teal-200 text-teal-700 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 bg-teal-500 rounded-full animate-pulse" />
                  {taskDetails?.status?.replace(/_/g, ' ')}
                </div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                  <Clock size={12} /> Expiring in 2 days
                </span>
              </div>
              <h1 className="text-4xl font-extrabold text-slate-900 leading-tight">
                {taskDetails?.title}
              </h1>
            </div>

            {/* Description - Resolved Overflow */}
            <section>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mb-4">
                The Brief
              </h3>
              <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
                <div className="max-w-full prose prose-slate">
                  <p className="text-slate-600 leading-relaxed whitespace-pre-wrap break-words overflow-hidden text-lg">
                    {taskDetails?.description || 'Project details were not specified.'}
                  </p>
                </div>
              </div>
            </section>

            {/* Gallery */}
            {taskDetails?.task_attachments?.length > 0 && (
              <section>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mb-4">
                  Project Assets
                </h3>
                <div className="grid grid-cols-4 gap-4">
                  <div className="col-span-4 relative h-[400px] rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 group">
                    <Image
                      src={taskDetails.task_attachments[activeImage]}
                      fill
                      alt="Task"
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                  {taskDetails.task_attachments.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImage(i)}
                      className={`relative h-20 rounded-xl overflow-hidden border-2 transition-all ${activeImage === i ? 'border-teal-600 shadow-md' : 'border-transparent opacity-70 hover:opacity-100'}`}
                    >
                      <Image src={img} fill alt="thumb" className="object-cover" />
                    </button>
                  ))}
                </div>
              </section>
            )}

            {/* Bids/Progress Component Area */}
            <section className="pt-10 border-t border-slate-200">
              <h3 className="text-xl font-bold text-slate-900 mb-6">{currentStatus} Timeline</h3>
              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm min-h-[400px]">
                {currentStatus === 'Bids' && (
                  <ProviderBids taskDetails={taskDetails} bidsData={bidsData} taskId={taskId} />
                )}
                {currentStatus === 'Progress' && (
                  <ProviderProgress taskId={taskId} taskDetails={taskDetails} bidsData={bidsData} />
                )}
                {currentStatus === 'Completed' && (
                  <Completed taskDetails={taskDetails} bidsData={bidsData} />
                )}
                {currentStatus === 'Cancelled' && <Cancelled taskDetails={taskDetails} />}
              </div>
            </section>
          </div>

          {/* RIGHT: SIDEBAR METADATA */}
          <aside className="lg:col-span-4 space-y-6">
            <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm sticky top-24">
              <div className="space-y-8">
                {/* Price Block */}
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                    Contract Amount
                  </p>
                  <h2 className="text-3xl font-black text-slate-900">
                    ₦{taskDetails?.customerPayingAmount?.toLocaleString()}
                  </h2>
                  <p className="text-xs text-teal-600 font-medium mt-1">Verified Payment Method</p>
                </div>

                <div className="h-[1px] bg-slate-100" />

                {/* Details List */}
                <div className="space-y-5">
                  <div className="flex items-center justify-between group">
                    <div className="flex items-center gap-3 text-slate-500">
                      <Calendar size={16} />
                      <span className="text-sm font-medium">Date Posted</span>
                    </div>
                    <span className="text-sm font-bold text-slate-900">22 Mar 2026</span>
                  </div>
                  <div className="flex items-center justify-between group">
                    <div className="flex items-center gap-3 text-slate-500">
                      <MapPin size={16} />
                      <span className="text-sm font-medium">Location</span>
                    </div>
                    <span className="text-sm font-bold text-slate-900">Remote</span>
                  </div>
                  <div className="flex items-center justify-between group">
                    <div className="flex items-center gap-3 text-slate-500">
                      <Hash size={16} />
                      <span className="text-sm font-medium">Reference ID</span>
                    </div>
                    <span className="text-sm font-mono text-slate-400">{taskId.slice(-8)}</span>
                  </div>
                </div>

                <div className="h-[1px] bg-slate-100" />

                {/* Trust Section */}
                <div className="p-4 bg-slate-50 rounded-2xl flex items-start gap-3">
                  <ShieldCheck className="text-teal-600 shrink-0" size={20} />
                  <div>
                    <p className="text-xs font-bold text-slate-900">SafeContract Guarantee</p>
                    <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                      Funds are held in escrow until you approve completion.
                    </p>
                  </div>
                </div>

                {/* Main Action if in Progress */}
                {currentStatus === 'Progress' && (
                  <button
                    onClick={() => setShowResolutionModal(true)}
                    className="w-full py-4 bg-white border border-rose-200 text-rose-600 rounded-2xl font-bold text-sm hover:bg-rose-50 transition-all flex items-center justify-center gap-2"
                  >
                    <Handshake size={18} />
                    Open Resolution Case
                  </button>
                )}
              </div>
            </div>
          </aside>
        </div>
      </main>

      {showResolutionModal && (
        <ResolutionModal
          taskId={taskId}
          taskDetails={taskDetails}
          onClose={() => setShowResolutionModal(false)}
        />
      )}
    </div>
  );
};

export default BidsDetails;
