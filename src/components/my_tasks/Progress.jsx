import React from "react";
import TaskInfoSection from "./TaskInfoSection";
import TaskDetailsSection from "./TaskDetailsSection";
import PricingSection from "./PricingSection";
import ProgressBarComponent from "./ProgressBarComponent";
import CancellationStatusComponent from "./CancellationStatusComponent";
import DateExtensionRequestSection from "./DateExtensionRequestSection";
import { useCompleteTaskMutation } from "@/lib/features/task/taskApi";
import { toast } from "sonner";
import { useGetExtensionRequestsByTaskIdQuery } from "@/lib/features/extensionApi/extensionApi";
import { useGetCancellationRequestByTaskQuery } from "@/lib/features/cancelApi/cancellationApi";

const Progress = ({
  bidsData,
  taskDetails,
  taskId
}) => {
  const [completeTask, { isLoading: isCompleting }] = useCompleteTaskMutation();
  const { data: extensionRequest } = useGetExtensionRequestsByTaskIdQuery(taskId)
  const extentionData = extensionRequest?.data?.[0] || []

  const extensionStatuss = extentionData?.status
  const extensionStatus = extensionStatuss


  const formatDate = (date) => {
    if (!date) return "";
    try {
      const d = new Date(date);
      return d.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return "";
    }
  };


  const offeredDate = taskDetails?.createdAt ? formatDate(taskDetails.createdAt) : "";
  const inProgressDate = (taskDetails?.status === "IN_PROGRESS" || taskDetails?.status === "ASSIGNED")
    ? formatDate(taskDetails?.updatedAt || taskDetails?.createdAt)
    : "";
  const completedDate = taskDetails?.status === "COMPLETED" ? formatDate(taskDetails?.updatedAt) : "";

  const isInProgress = taskDetails?.status === "IN_PROGRESS" || taskDetails?.status === "ASSIGNED";
  const isCompleted = taskDetails?.status === "COMPLETED";

  const steps = [
    { id: 1, label: "Offered", date: offeredDate, completed: true },
    { id: 2, label: "In Progress", date: inProgressDate, completed: isInProgress || isCompleted },
    { id: 3, label: "Completed on", date: completedDate, completed: isCompleted },
  ];

  const progressWidth = isCompleted ? "100%" : (isInProgress ? "66.67%" : "33.33%");

  const assignedTo = (() => {
    if (taskDetails?.provider && typeof taskDetails.provider === "object" && taskDetails.provider.name) {
      return taskDetails.provider.name;
    }
    const providerId = typeof taskDetails?.provider === "string" ? taskDetails.provider : null;
    if (providerId && Array.isArray(bidsData?.data)) {
      const matchedBid = bidsData.data.find(
        (b) => b?.provider?._id === providerId
      );
      if (matchedBid?.provider?.name) {
        return matchedBid.provider.name;
      }
    }
    return "Not assigned";
  })();

  const location = taskDetails?.address || taskDetails?.city || "Location not specified";

  const dateLabel = taskDetails?.preferredDate
    ? new Date(taskDetails.preferredDate).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }) + (taskDetails?.preferredTime ? ` ${taskDetails.preferredTime}` : "")
    : "Schedule not set";

  const description = taskDetails?.description || "No description available.";
  const budget = taskDetails?.budget;

  const handleMarkAsComplete = async () => {
    if (!taskDetails?._id) {
      toast.error("Task ID not found");
      return;
    }

    // if (!confirm("Are you sure you want to mark this task as complete?")) {
    //   return;
    // }

    try {
      const result = await completeTask(taskDetails._id).unwrap();
      console.log("complete task customer",result)
      if (result.success) {
        toast.success("Task marked as complete successfully!");
        window.location.reload();
      }
    } catch (error) {
      console.error("Failed to complete task:", error);
      toast.error(error?.data?.message || "Failed to mark task as complete. Please try again.");
    }
  };

  const { data: cancellationData } = useGetCancellationRequestByTaskQuery(taskId);
  const cancellationRequest = cancellationData?.data;

  const handleScrollToCancellation = () => {
    const element = document.getElementById("cancellation-status");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="flex flex-col gap-12">
      <TaskInfoSection
        assignedTo={assignedTo}
        location={location}
        dateLabel={dateLabel}
        taskDetails={taskDetails}
        bidsData={bidsData}
      />

      <PricingSection 
      bidsData={bidsData}
      budget={budget} />

      <ProgressBarComponent steps={steps} progressWidth={progressWidth} />

      <div id="cancellation-status">
        <CancellationStatusComponent
          taskId={taskId}
          taskDetails={taskDetails}
          isServiceProvider={false}
        />
        <DateExtensionRequestSection extensionStatus={extensionStatus} extentionData={extentionData} />
      </div>

      {!isCompleted && (
        <div className="flex flex-wrap gap-3 justify-start">
          <button
            onClick={handleMarkAsComplete}
            disabled={isCompleting}
            className={`px-6 py-2.5 rounded-md transition-colors font-medium cursor-pointer ${isCompleting
              ? "bg-gray-400 text-white cursor-not-allowed"
              : "bg-[#115E59] hover:bg-teal-700 text-white"
              }`}
          >
            {isCompleting ? "Marking Complete..." : "Mark As Complete"}
          </button>
        </div>
      )}

      {isCompleted && (
        <div className="flex justify-start">
          <div className="px-6 py-2.5 bg-green-100 text-green-800 rounded-md font-medium">
            Task Completed
          </div>
        </div>
      )}
    </div>
  );
};

export default Progress;