"use client";

import ServiceCard from "@/components/serviceprovider/ServiceCard";
import ServicePagination from "@/components/serviceprovider/ServicePagination";
import ServiceSkeleton from "@/components/serviceprovider/ServiceSkeleton";
import ServiceSidebar from "@/components/sliders/ServiceSidebar";
import { useServiceListing } from "@/hooks/useServiceListing";
import { Search } from "lucide-react";
import Link from "next/link";

const ServiceListing = () => {
  const {
    states: { searchQuery, selectedCategory, currentPage, services, meta, isLoading, categories },
    handlers: { setSearchQuery, handleCategoryChange, handlePageChange },
  } = useServiceListing();

  if (isLoading) return <ServiceSkeleton />;

  return (
    <div className="min-h-screen bg-slate-50/50">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar: Sticky on scroll */}
          <aside className="lg:w-1/4 xl:w-1/5">
            <div className="sticky top-24">
              <ServiceSidebar
                categories={categories}
                selectedCategory={selectedCategory}
                onCategoryChange={handleCategoryChange}
              />
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {/* Header / Search Area */}
            {/* <div className="mb-8 space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight">
                  Available Services
                </h1>
                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">
                  {meta.total || 0} Results Found
                </p>
              </div>

              <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-teal-600 transition-colors" />
                <input
                  type="text"
                  placeholder="What service are you looking for today?"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl shadow-sm focus:ring-4 focus:ring-teal-500/5 focus:border-teal-500 outline-none transition-all placeholder:text-slate-300 font-medium"
                />
              </div>
            </div> */}

            {/* Sticky Header Section */}
            <div className="sticky top-12 z-40 bg-gray-50/80 backdrop-blur-md pt-8 pb-4 mb-4 transition-all duration-300">
              <div className="space-y-6">
                {/* Title and Metadata */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight">
                    Available Services
                  </h1>
                  <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">
                    {meta.total || 0} Results Found
                  </p>
                </div>

                {/* Search Input */}
                <div className="relative group">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-teal-600 transition-colors" />
                  <input
                    type="text"
                    placeholder="What service are you looking for today?"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl shadow-sm focus:ring-4 focus:ring-teal-500/5 focus:border-teal-500 outline-none transition-all placeholder:text-slate-300 font-medium"
                  />
                </div>
              </div>
            </div>
            {/* Grid Area */}
            {services.length > 0 ? (
              <div className="space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6">
                  {services.map((service) => (
                    <Link
                      key={service._id}
                      href={`/service-listing/${service._id}`}
                      className="transition-transform duration-300 hover:-translate-y-1"
                    >
                      <ServiceCard service={service} />
                    </Link>
                  ))}
                </div>

                <ServicePagination
                  meta={meta}
                  currentPage={currentPage}
                  onPageChange={handlePageChange}
                />
              </div>
            ) : (
              <EmptyState />
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

const EmptyState = () => (
  <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[2rem] border border-dashed border-slate-200">
    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
      <Search className="w-8 h-8 text-slate-200" />
    </div>
    <h3 className="text-lg font-bold text-slate-800">No services found</h3>
    <p className="text-slate-400 text-sm">Try adjusting your filters or search terms.</p>
  </div>
);

export default ServiceListing;
