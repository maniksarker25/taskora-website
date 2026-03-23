"use client";

const ServiceSkeleton = () => {
  return (
    <div className="min-h-screen bg-slate-50/50 animate-pulse">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Skeleton */}
          <aside className="lg:w-1/4 xl:w-1/5 hidden lg:block">
            <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 h-[400px]">
              <div className="h-4 w-24 bg-slate-200 rounded-full mb-8" />
              <div className="space-y-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="h-4 w-4 bg-slate-100 rounded-full" />
                    <div className="h-3 w-full bg-slate-50 rounded-lg" />
                  </div>
                ))}
              </div>
            </div>
          </aside>

          {/* Main Content Skeleton */}
          <main className="flex-1">
            {/* Header Skeleton */}
            <div className="mb-8 space-y-6">
              <div className="flex justify-between items-center">
                <div className="h-8 w-48 bg-slate-200 rounded-xl" />
                <div className="h-4 w-24 bg-slate-100 rounded-full" />
              </div>
              <div className="h-14 w-full bg-white border border-slate-200 rounded-2xl shadow-sm" />
            </div>

            {/* Grid Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-[2rem] p-5 border border-slate-100 shadow-sm h-[320px]"
                >
                  {/* Image area */}
                  <div className="w-full h-40 bg-slate-100 rounded-2xl mb-4" />
                  {/* Content area */}
                  <div className="space-y-3">
                    <div className="h-4 w-3/4 bg-slate-200 rounded-lg" />
                    <div className="h-3 w-1/2 bg-slate-100 rounded-lg" />
                    <div className="flex justify-between pt-4">
                      <div className="h-6 w-20 bg-teal-50 rounded-lg" />
                      <div className="h-6 w-16 bg-slate-100 rounded-lg" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default ServiceSkeleton;
