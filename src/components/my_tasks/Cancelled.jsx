import React from "react";
import { Check, Calendar } from "lucide-react";
import Image from "next/image";
import customer from "../../../public/customer.svg";
import { FaCalendar, FaMapPin } from "react-icons/fa6";
import { BsChatLeftText } from "react-icons/bs";

const Cancelled = ({ taskDetails }) => {
  console.log("Cancelled task details:", taskDetails);

  // Format date function
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Format currency function
  const formatCurrency = (amount) => {
    if (!amount && amount !== 0) return "N/A";
    return `₦ ${amount.toLocaleString()}`;
  };

  // Get steps from statusWithDate array
  const getSteps = () => {
    if (!taskDetails?.statusWithDate || !Array.isArray(taskDetails.statusWithDate)) {
      return [
        { id: 1, label: "OFFERED", date: "N/A", completed: true },
        { id: 2, label: "IN_PROGRESS", date: "N/A", completed: true },
        { id: 3, label: "CANCELLED", date: "N/A", completed: false, cancelled: true },
      ];
    }

    return taskDetails.statusWithDate.map((statusItem, index) => ({
      id: index + 1,
      label: statusItem.status,
      date: formatDate(statusItem.date),
      completed: statusItem.status !== "CANCELLED",
      cancelled: statusItem.status === "CANCELLED",
    }));
  };

  const steps = getSteps();

  return (
    <div className="flex flex-col gap-12 pb-20">
      <div className="flex flex-col md:flex-row justify-between">
        {/* left side */}
        <div>
          {/* Assigned To */}
          <div className="flex mt-8 items-center gap-3">
            <Image
              src={taskDetails?.provider?.profile_image || customer}
              alt="Provider Image"
              className="w-8 md:w-12 h-8 md:h-12 rounded-full object-cover"
              width={48}
              height={48}
            />
            <div>
              <p className="text-base md:text-xl font-semibold">Assigned To</p>
              <p className="text-[#6B7280] text-sm">
                {taskDetails?.provider?.name || "Not assigned"}
              </p>
            </div>
          </div>

          {/* Location */}
          <div className="flex mt-8 items-center gap-3">
            <div className="bg-[#E6F4F1] rounded-full p-2 md:p-3">
              <FaMapPin className="text-[#115E59] text-sm md:text-xl" />
            </div>
            <div>
              <p className="text-base md:text-xl font-semibold">Location</p>
              <p className="text-[#6B7280] text-sm">
                {taskDetails?.address || "Location not specified"}
                {taskDetails?.city && `, ${taskDetails.city}`}
              </p>
            </div>
          </div>

          {/* To Be Done On */}
          <div className="flex mt-8 items-center gap-3">
            <div className="bg-[#E6F4F1] rounded-full p-2 md:p-3">
              <FaCalendar className="text-[#115E59] text-sm md:text-xl" />
            </div>
            <div>
              <p className="text-base md:text-xl font-semibold">To Be Done On</p>
              <p className="text-[#6B7280] text-sm">
                {formatDate(taskDetails?.preferredDeliveryDateTime) || "Not scheduled"}
              </p>
            </div>
          </div>

          {/* Task Category */}
          {taskDetails?.category?.name && (
            <div className="flex mt-8 items-center gap-3">
              <div className="bg-[#E6F4F1] rounded-full p-2 md:p-3">
                <svg
                  className="text-[#115E59] text-sm md:text-xl w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
              </div>
              <div>
                <p className="text-base md:text-xl font-semibold">Category</p>
                <p className="text-[#6B7280] text-sm">{taskDetails.category.name}</p>
              </div>
            </div>
          )}

          {/* Task ID */}
          <div className="flex mt-8 items-center gap-3">
            <div className="bg-[#E6F4F1] rounded-full p-2 md:p-3">
              <svg
                className="text-[#115E59] text-sm md:text-xl w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"
                />
              </svg>
            </div>
            <div>
              <p className="text-base md:text-xl font-semibold">Task ID</p>
              <p className="text-[#6B7280] text-sm">{taskDetails?._id || "N/A"}</p>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div>
          <button
            href="/construction"
            className="px-6 py-2.5 bg-[#115e59] text-white rounded-md hover:bg-teal-800 transition transform duration-300 hover:scale-105 cursor-pointer flex gap-2 items-center justify-center mt-12"
          >
            <BsChatLeftText />
            Chat Now
          </button>
        </div>
      </div>

      {/* Task Details */}
      <div className="flex flex-col gap-4">
        <p className="text-xl font-semibold">Details</p>
        <p className="text-[#6B7280]">
          {taskDetails?.description || "No description provided"}
        </p>
      </div>

      {/* Payment Information */}
      <div className="flex flex-col gap-4 border-b-2 border-[#dedfe2] pb-4">
        <div className="flex justify-between items-center">
          <p className="text-base font-semibold">Budget</p>
          <p className="text-base text-[#6B7280]">{formatCurrency(taskDetails?.budget)}</p>
        </div>
        <div className="flex justify-between items-center">
          <p className="text-base font-semibold">Customer Paying Amount</p>
          <p className="text-base text-[#6B7280]">{formatCurrency(taskDetails?.customerPayingAmount)}</p>
        </div>
        {taskDetails?.acceptedBidAmount && (
          <div className="flex justify-between items-center">
            <p className="text-base font-semibold">Accepted Bid Amount</p>
            <p className="text-base text-[#6B7280]">{formatCurrency(taskDetails.acceptedBidAmount)}</p>
          </div>
        )}
        <div className="flex justify-between items-center">
          <p className="text-base font-semibold">Payment Status</p>
          <p className={`text-base ${
            taskDetails?.paymentStatus === "REFUNDED" 
              ? "text-green-600" 
              : "text-[#6B7280]"
          }`}>
            {taskDetails?.paymentStatus || "N/A"}
          </p>
        </div>
        <div className="flex justify-between items-center">
          <p className="text-base font-semibold">Payment Reference</p>
          <p className="text-base text-[#6B7280]">{taskDetails?.paymentReferenceId || "N/A"}</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="relative">
          {/* Progress Line Background */}
          <div className="absolute top-4 left-8 right-8 h-0.5 bg-gray-300 z-0"></div>

          {/* Green Progress Line (from first to second step) */}
          <div
            className="absolute top-4 left-8 h-0.5 bg-[#115e59] z-10 transition-all duration-500"
            style={{ width: "calc(50% - 16px)" }}
          ></div>

          {/* Red Progress Line (from second to third step) */}
          <div
            className="absolute top-4 h-0.5 bg-red-500 z-10 transition-all duration-500"
            style={{ left: "50%", width: "calc(50% - 32px)" }}
          ></div>

          {/* Steps */}
          <div className="relative z-20 flex justify-between items-start">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className="flex flex-col items-center text-center"
              >
                {/* Circle with icon */}
                <div
                  className={`
                  w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300
                  ${
                    step.cancelled
                      ? "bg-red-500"
                      : step.completed
                      ? "bg-[#115e59]"
                      : "bg-gray-400"
                  }
                `}
                >
                  {step.completed || step.cancelled ? (
                    <Check className="w-4 h-4 text-white" strokeWidth={2} />
                  ) : (
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  )}
                </div>

                {/* Label */}
                <div className="mt-3 min-w-[80px]">
                  <p className="text-sm font-medium mb-1 text-gray-900">
                    {step.label}
                  </p>

                  {/* Date */}
                  {step.date && (
                    <div className="flex items-center justify-center text-xs text-gray-500">
                      <Calendar className="w-3 h-3 mr-1" />
                      <span>{step.date}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Additional Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold mb-2">Task Information</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Schedule Type:</span>
              <span>{taskDetails?.scheduleType || "N/A"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Delivery Method:</span>
              <span>{taskDetails?.doneBy || "N/A"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Payment On:</span>
              <span>{taskDetails?.payOn || "N/A"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Total Offers:</span>
              <span>{taskDetails?.totalOffer || 0}</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold mb-2">Customer Information</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Name:</span>
              <span>{taskDetails?.customer?.name || "N/A"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Email:</span>
              <span>{taskDetails?.customer?.email || "N/A"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Created At:</span>
              <span>{formatDate(taskDetails?.createdAt)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Last Updated:</span>
              <span>{formatDate(taskDetails?.updatedAt)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cancelled;