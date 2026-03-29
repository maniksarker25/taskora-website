import { useRejectOfferMutation } from '@/lib/features/bidApi/bidApi';
import { Banknote, Calendar, Layers, MapPin, Users } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import { toast } from 'sonner';

const BidCard = ({ task }) => {
  const [rejectOffer, { isLoading: isRejecting }] = useRejectOfferMutation();
  const user = useSelector((state) => state.auth?.user);

  const isDirectOffer =
    task.provider === user?.profileId ||
    (typeof task.provider === 'object' && task.provider?._id === user?.profileId);

  const handleReject = async (e) => {
    e.preventDefault();
    toast('Reject Offer', {
      description: 'Are you sure you want to reject this offer?',
      action: {
        label: 'Reject',
        onClick: async () => {
          try {
            const result = await rejectOffer(task._id).unwrap();
            if (result.success) toast.success('Offer rejected successfully');
          } catch (error) {
            toast.error(error?.data?.message || 'Failed to reject offer');
          }
        },
      },
    });
  };

  const getStatusStyles = (status) => {
    const statusMap = {
      OPEN_FOR_BID: 'bg-emerald-50 text-emerald-700 border-emerald-100',
      IN_PROGRESS: 'bg-amber-50 text-amber-700 border-amber-100',
      COMPLETED: 'bg-blue-50 text-blue-700 border-blue-100',
      CANCELLED: 'bg-slate-100 text-slate-600 border-slate-200',
    };
    return statusMap[status] || 'bg-gray-50 text-gray-600 border-gray-100';
  };

  return (
    <div className="group bg-white rounded-2xl border border-slate-200 p-5 hover:border-teal-500/50 hover:shadow-xl hover:shadow-teal-900/5 transition-all duration-300">
      {/* Top Section: Status & Offers */}
      <div className="flex justify-between items-start mb-4">
        <span
          className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${getStatusStyles(task.status)}`}
        >
          {task.status?.replace(/_/g, ' ')}
        </span>
        {task.totalOffer > 0 && (
          <div className="flex items-center gap-1.5 text-slate-400 text-xs font-medium">
            <Users size={14} />
            <span>{task.totalOffer} Bids</span>
          </div>
        )}
      </div>

      {/* Title & Description */}
      <div className="mb-5">
        <h3 className="text-lg font-bold text-slate-900 line-clamp-1 group-hover:text-[#115e59] transition-colors">
          {task.title}
        </h3>
        <p className="text-slate-500 text-sm line-clamp-2 mt-1 leading-relaxed">
          {task.description}
        </p>
      </div>

      {/* Data Grid */}
      <div className="grid grid-cols-2 gap-y-4 gap-x-2 mb-6 border-y border-slate-50 py-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-slate-50 rounded-lg text-slate-500">
            <Banknote size={16} />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 uppercase font-bold">Budget</p>
            <p className="text-sm font-bold text-slate-900">
              ₦{task.budget?.toLocaleString() || '0'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-slate-50 rounded-lg text-slate-500">
            <Calendar size={16} />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 uppercase font-bold">Timeline</p>
            <p className="text-sm font-bold text-slate-900">
              {task.preferredDeliveryDateTime
                ? new Date(task.preferredDeliveryDateTime).toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: 'short',
                  })
                : task.scheduleType || 'Flexible'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-slate-50 rounded-lg text-slate-500">
            <MapPin size={16} />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] text-slate-400 uppercase font-bold">Location</p>
            <p className="text-sm font-bold text-slate-900 truncate">
              {task.address || task.city || 'Remote/Online'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-slate-50 rounded-lg text-slate-500">
            <Layers size={16} />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] text-slate-400 uppercase font-bold">Category</p>
            <p className="text-sm font-bold text-slate-900 truncate">
              {task.category?.name || 'General'}
            </p>
          </div>
        </div>
      </div>

      {/* Footer: User & Actions */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0">
          <div className="h-8 w-8 rounded-full bg-teal-50 flex-shrink-0 border border-teal-100 overflow-hidden relative">
            {task.customer?.profile_image ? (
              <Image src={task.customer.profile_image} alt="User" fill className="object-cover" />
            ) : (
              <span className="flex h-full w-full items-center justify-center text-xs font-bold text-teal-700">
                {task.customer?.name?.charAt(0) || 'U'}
              </span>
            )}
          </div>
          <p className="text-xs font-bold text-slate-700 truncate">{task.customer?.name}</p>
        </div>

        <div className="flex gap-2">
          {isDirectOffer && task.status === 'OPEN_FOR_BID' && (
            <button
              onClick={handleReject}
              disabled={isRejecting}
              className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors disabled:opacity-50"
              title="Reject Offer"
            >
              <XCircle size={20} />
            </button>
          )}
          <Link
            href={`/my_bids/${task._id}`}
            className="px-4 py-2 bg-[#115e59] text-white rounded-xl text-xs font-bold hover:bg-teal-800 transition-all shadow-md shadow-teal-900/10 active:scale-95"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BidCard;
