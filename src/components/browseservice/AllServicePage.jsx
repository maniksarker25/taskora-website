"use client";

import ServiceCard from "@/components/browseservice/ServiceCard";
import { useGetAllTasksQuery } from "@/lib/features/task/taskApi";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const AllServicePage = ({ filters }) => {
  const pathname = usePathname();
  const currentTaskId = pathname.split("/").pop();

  // Optimized API call: Send all filter logic to the server
  const {
    data: tasksData,
    isLoading,
    isFetching,
    error,
  } = useGetAllTasksQuery({
    page: 1,
    limit: 50, // Increased limit for better browse experience
    searchTerm: filters.search || "",
    category: filters.category || "",
    sortBy: filters.sort || "",
    minPrice: filters.minPrice || "",
    maxPrice: filters.maxPrice || "",
    location: filters.location || "",
  });

  const tasks = tasksData?.data?.result || [];

  // Loading State
  if (isLoading) {
    return (
      <div className="w-full pl-4 md:w-[350px] lg:w-[500px] flex flex-col gap-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="w-full h-64 bg-gray-100 animate-pulse rounded-xl" />
        ))}
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="w-full pl-4 md:w-[350px] lg:w-[500px] h-[400px] flex flex-col items-center justify-center text-center">
        <p className="text-red-500 font-medium">Failed to load tasks</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-2 text-sm text-[#115e59] underline"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Visual indicator when background fetching happens */}
      {isFetching && (
        <div className="absolute top-2 right-2 z-10">
          <Loader2 className="w-5 h-5 animate-spin text-[#115e59]" />
        </div>
      )}

      <div className="w-full pl-4 md:w-[350px] lg:w-[500px] flex flex-col gap-4 h-[calc(100vh-70px)] overflow-y-auto custom-scrollbar pb-10">
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <Link
              key={task._id}
              href={`/browseservice/${task?._id}`}
              className="block no-underline"
            >
              <ServiceCard task={task} isActive={currentTaskId === task?._id} />
            </Link>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center h-[300px] text-gray-500">
            <div className="bg-gray-50 p-6 rounded-full mb-4">
              <Loader2 className="w-10 h-10 text-gray-300" />
            </div>
            <p className="font-semibold text-lg">No tasks matched</p>
            <p className="text-sm">Try adjusting your filters or location</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllServicePage;
