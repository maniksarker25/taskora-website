"use client";
import { ArrowRight, ImageIcon, ShieldCheck, Star } from "lucide-react";
import Image from "next/image";

const ServiceCard = ({ service }) => {
  // 1. Better approach for default images
  const serviceImage = service?.images?.[0] || null;

  // 2. Clean HTML stripping for description
  const cleanDescription = service?.description
    ? service.description.replace(/<[^>]*>/g, "").substring(0, 60) + "..."
    : "Professional service available for booking.";

  return (
    <div className="group bg-white rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-teal-900/5 transition-all duration-300 overflow-hidden flex flex-col h-full">
      {/* Image Section */}
      <div className="relative h-52 w-full overflow-hidden bg-slate-100">
        {serviceImage ? (
          <Image
            src={serviceImage}
            alt={service?.title || "Service"}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-slate-300">
            <ImageIcon className="w-10 h-10 mb-2 opacity-20" />
            <span className="text-[10px] font-black uppercase tracking-widest opacity-40">
              No Image Available
            </span>
          </div>
        )}

        {/* Category Badge */}
        <div className="absolute top-4 left-4">
          <span className="bg-white/90 backdrop-blur-md text-teal-700 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm">
            {service?.category?.name || "Premium Service"}
          </span>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6 flex flex-col flex-1">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5 bg-amber-50 px-2 py-1 rounded-lg">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span className="text-xs font-bold text-amber-700">
              {service?.averageRating ? Number(service.averageRating).toFixed(1) : "New"}
            </span>
          </div>
          <div className="flex items-center gap-1 text-slate-400">
            <ShieldCheck className="w-4 h-4 text-teal-500" />
            <span className="text-[10px] font-bold uppercase tracking-tighter">Verified</span>
          </div>
        </div>

        <h3 className="text-lg font-bold text-slate-900 mb-2 line-clamp-1 group-hover:text-teal-600 transition-colors">
          {service?.title || "Untitled Service"}
        </h3>

        <p className="text-slate-500 text-xs leading-relaxed mb-6 line-clamp-2">
          {cleanDescription}
        </p>

        {/* Footer Section: Price & Button */}
        <div className="mt-auto flex items-center justify-between pt-4 border-t border-slate-50">
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">
              Price From
            </p>
            <p className="text-xl font-black text-slate-900 tracking-tight">
              ₦{service?.price?.toLocaleString() || "Negotiable"}
            </p>
          </div>

          <div className="h-10 w-10 bg-slate-50 rounded-xl flex items-center justify-center text-teal-600 group-hover:bg-[#115E59] group-hover:text-white transition-all duration-300 shadow-sm">
            <ArrowRight className="w-5 h-5" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;
