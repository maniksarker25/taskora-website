"use client";

import Image from "next/image";
import { useState } from "react";
import srvcporvider from "../../../../public/women.svg";
import MyTaskCard from "@/components/my_tasks/MyTaskCard";
import popularcateIcon from "../../../../public/popularcate.svg";
import Link from "next/link";
import { useGetMyTasksQuery } from "@/lib/features/task/taskApi"; 

const statusCategories = [
  {
    name: "All Tasks",
    status: "",
  },
  {
    name: "Open for Bids",
    status: "OPEN_FOR_BID",
  },
  {
    name: "In Progress",
    status: "IN_PROGRESS",
  },
  {
    name: "Completed",
    status: "COMPLETED",
  },
  {
    name: "Cancelled",
    status: "CANCELLED",
  },
  {
    name: "Assigned",
    status: "ASSIGNED",
  }
];

const MyTasks = () => {
  const [activeTab, setActiveTab] = useState("All Tasks");

  const activeStatus = statusCategories.find((cat) => cat.name === activeTab)?.status || "";

  const { 
    data: tasksData, 
    isLoading, 
    error,
    refetch 
  } = useGetMyTasksQuery({
    status: activeStatus,
    limit: 20 
  });

  const tasks = tasksData?.data?.result || tasksData?.data || [];

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
                  My Tasks
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
                  My Tasks
                </p>
              </div>
            </div>
          </div>
          <div className="text-center py-8">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Failed to Load Tasks</h2>
            <p className="text-gray-600 mb-4">There was an error loading your tasks.</p>
            <button 
              onClick={refetch}
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
          {/* top header */}
          <div>
            <div className="flex items-center gap-4">
              <Image
                src={popularcateIcon}
                alt="Popular Category"
                height={24}
                width={24}
              />
              <p className="font-semibold text-md md:text-xl text-color pb-3">
                My Tasks
              </p>
            </div>
          </div>
        </div>

        <div className="">
          {/* Tabs */}
          <div className="flex flex-wrap gap-3 mb-8">
            {statusCategories.map((cat) => (
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

          {/* Tasks Grid */}
          {tasks?.length === 0 ? (
            <div className="text-center py-12">
              <div className="bg-gray-50 rounded-lg p-8 max-w-md mx-auto">
                <Image
                  src={srvcporvider}
                  alt="No tasks"
                  width={80}
                  height={80}
                  className="mx-auto mb-4 opacity-50"
                />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No Tasks Found
                </h3>
                <p className="text-gray-600 mb-4">
                  {activeTab === "All Tasks" 
                    ? "You haven't created any tasks yet." 
                    : `You don't have any ${activeTab.toLowerCase()} tasks.`
                  }
                </p>
                <Link 
                  href="/post_task" 
                  className="inline-block px-6 py-2 bg-[#115e59] text-white rounded-lg hover:bg-teal-700 transition-colors"
                >
                  Create Your First Task
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {tasks?.map((task) => (
                <div key={task._id}>
                  <Link href={`/my_task/${task._id}`}>
                    <MyTaskCard 
                      service={{
                        id: task._id,
                        title: task.title,
                        price: `₦${parseInt(task.budget || 0).toLocaleString()}`,
                        locations: [task.address, task.city].filter(Boolean),
                        date: task.preferredDate 
                          ? new Date(task.preferredDate).toLocaleDateString("en-US", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            }) + (task.preferredTime ? ` ${task.preferredTime}` : "")
                          : "Schedule not set",
                        category: task.category?.name || "General",
                        status: task.status || "OPEN_FOR_BID",
                        offers: task.totalOffer || 0,
                        image: task.customer?.profile_image || srvcporvider
                      }} 
                      activeTab={activeTab}
                    />
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default MyTasks;