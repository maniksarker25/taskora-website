import React, { useState } from "react";
import {
  Calendar,
  ArrowLeftRight,
  Check,
  GitPullRequest,
  X,
} from "lucide-react";
import client from "../../../public/client.png";
import Image from "next/image";
import { useSelector } from "react-redux";

import RejectModal from "../extention/RejectModal";
import { useAcceptExtensionRequestMutation, useRejectExtensionRequestMutation, useMakeExtensionDisputeMutation } from "@/lib/features/extensionApi/extensionApi";
import { toast } from "sonner";

const DateExtensionRequestSection = ({ extensionStatus, extentionData }) => {
  console.log("ex",extentionData._id)
  const user = useSelector((state) => state.auth.user);
  const [showRejectModal, setShowRejectModal] = useState(false);

  const [acceptExtensionRequest, { isLoading: isAccepting }] = useAcceptExtensionRequestMutation();
  const [rejectExtensionRequest, { isLoading: isRejecting }] = useRejectExtensionRequestMutation();
  const [makeExtensionDispute, { isLoading: isDisputing }] = useMakeExtensionDisputeMutation();

  const isLoading = isAccepting || isRejecting || isDisputing;

  const currentUserRole = user?.role?.toLowerCase();

  const isRequestSender = (
    (currentUserRole === "customer" && extentionData?.requestedFromModel === "Customer") ||
    (currentUserRole === "provider" && extentionData?.requestedFromModel === "Provider")
  );

  const isRequestReceiver = (
    (currentUserRole === "customer" && extentionData?.requestToModel === "Customer") ||
    (currentUserRole === "provider" && extentionData?.requestToModel === "Provider")
  );


  const getExtensionContent = () => {
    if (!extensionStatus) return null;

    switch (extensionStatus.toUpperCase()) {
      case "PENDING":
        let showButtons = false;

        if (
          extentionData?.requestedFromModel === "Customer" &&
          extentionData?.requestToModel === "Provider" &&
          currentUserRole === "provider"
        ) {
          showButtons = true;

        }
        else if (
          extentionData?.requestedFromModel === "Provider" &&
          extentionData?.requestToModel === "Customer" &&
          currentUserRole === "customer"
        ) {
          showButtons = true;

        }



        return {
          statusText: "In Progress",
          statusColor: "text-green-600",
          statusIcon: <Check className="w-4 h-4 text-white" />,
          statusBgColor: "bg-green-700",
          buttons: showButtons ? [
            {
              text: "Reject Request",
              color: "bg-red-600 hover:bg-red-700",
              action: "reject",
            },
            {
              text: "Accept Request",
              color: "bg-[#115e59] hover:bg-teal-700",
              action: "accept",
            },
          ] : null,
          showMarkComplete: true,
        };
      case "ACCEPTED":
        return {
          statusText: extentionData?.requestToModel === "Provider"
            ? "Approved By Service Provider"
            : "Approved By Customer",
          statusColor: "text-[#115e59]",
          statusIcon: <Check className="w-4 h-4 text-white" />,
          statusBgColor: "bg-[#115e59]",
          buttons: null,
          showMarkComplete: true,
        };
      case "REJECTED":
        return {
          statusText: extentionData?.requestToModel === "Provider"
            ? "Rejected By Service Provider"
            : "Rejected By Customer",
          statusColor: "text-red-600",
          statusIcon: <X className="w-4 h-4 text-white" />,
          statusBgColor: "bg-red-600",
          buttons: isRequestSender ? [
            {
              text: "Dispute",
              color: "bg-[#115e59] hover:bg-[#115e59]/80",
              action: "dispute",
            }
          ] : null,
          showMarkComplete: false,
          rejectionReason: extentionData?.rejectDetails ||
            "The proposed extension cannot be granted due to project deadlines and client commitments.",
        };
      case "DISPUTED":
        return {
          statusText: extentionData?.requestToModel === "Provider"
            ? "Disputed By Service Provider"
            : "Disputed By Customer",
          statusColor: "text-red-600",
          statusIcon: <X className="w-4 h-4 text-white" />,
          statusBgColor: "bg-red-600",
          // buttons: isRequestSender ? [
          //   {
          //     text: "Accept Dispute",
          //     color: "bg-[#115e59] hover:bg-[#115e59]/80",
          //     action: "dispute",
          //   }
          // ] : null,
          showMarkComplete: false,
          rejectionReason: extentionData?.rejectDetails ||
            "The proposed extension cannot be granted due to project deadlines and client commitments.",
        };
      default:
        return null;
    }
  };

  const content = getExtensionContent();
  if (!content) return null;

  // Handle button clicks
  const handleButtonClick = (action) => {
    if (action === "reject") {
      setShowRejectModal(true);
    } else if (action === "accept") {
      handleAcceptRequest();
    } else if (action === "dispute") {
      handleDisputeRequest();
    }
  };

  // Handle accept request using RTK Query
  const handleAcceptRequest = async () => {
    try {
      const acceptExt = await acceptExtensionRequest(extentionData._id).unwrap();
      if (acceptExt.success) {
        toast.success("Extension request accepted successfully", {
          style: {
            backgroundColor: "#d1fae5",
            color: "#065f46",
            borderLeft: "6px solid #10b981",
          },
        });
      }

    } catch (error) {
      console.error("Error accepting request:", error);
      toast.error(error?.data?.message || "Failed to accept extension request. Please try again.", {
        style: {
          backgroundColor: "#fee2e2",
          color: "#991b1b",
          borderLeft: "6px solid #dc2626",
        },
      });
    }
  };

  // Handle dispute request with confirmation
  const handleDisputeRequest = async () => {
    toast("Are you sure you want to request a dispute ruling?", {
      action: {
        label: 'Confirm',
        onClick: async () => {
          try {
            const result = await makeExtensionDispute(extentionData._id).unwrap();
            if (result.success) {
              toast.success(result.message || "Dispute request submitted successfully!", {
                style: {
                  backgroundColor: "#d1fae5",
                  color: "#065f46",
                  borderLeft: "6px solid #10b981",
                },
              });
            }
          } catch (error) {
            console.error("Dispute action failed:", error);
            toast.error(error?.data?.message || "Failed to submit dispute request", {
              style: {
                backgroundColor: "#fee2e2",
                color: "#991b1b",
                borderLeft: "6px solid #dc2626",
              },
            });
          }
        },
      },
      cancel: {
        label: 'Cancel',
        onClick: () => {
          toast.dismiss();
        }
      },
      duration: 10000,
    });
  };

  // Handle reject submission from modal using RTK Query
  const handleRejectSubmit = async ({ reason, file }) => {
    try {
      const rejectData = {
        requestId: extentionData._id,
        rejectDetails: reason,
      };

      if (file) {
        rejectData.reject_evidence = file;
      }

      const rejectExt = await rejectExtensionRequest(rejectData).unwrap();

      if (rejectExt.success) {
        toast.success("Extension request rejected successfully", {
          style: {
            backgroundColor: "#d1fae5",
            color: "#065f46",
            borderLeft: "6px solid #10b981",
          },
        });
      }
      setShowRejectModal(false);


    } catch (error) {
      console.error("Error rejecting request:", error);
      toast.error("Failed to reject extension request. Please try again.", {
        style: {
          backgroundColor: "#fee2e2",
          color: "#991b1b",
          borderLeft: "6px solid #dc2626",
        },
      });
    }
  };


  const getHeadingText = () => {
    if (isRequestSender) {
      return "You Requested Change of Task Completion Date";
    } else if (isRequestReceiver) {
      return "Date Extension Request";
    } else {
      return "Date Extension Request";
    }
  };

  return (
    <>
      <div className="bg-[#E6F4F1] border border-green-200 rounded-lg p-6 mb-6">
        <div className="flex items-start gap-3">
          <div className="bg-white rounded-full p-2 hidden lg:block">
            <GitPullRequest className="w-5 h-5 text-green-900" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">
              {getHeadingText()}
            </h3>

            {/* Requested By Section */}
            <div className="flex flex-col md:flex-row md:items-center gap-4 justify-between mb-6">
              <div className="flex flex-col md:flex-row items-center gap-3">
                <div>
                  <Image
                    src={extentionData?.requestFrom?.profile_image || client}
                    width={40}
                    height={40}
                    alt="client"
                    className="rounded-full"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <p className="font-medium text-gray-900">Request From</p>
                  <p className="text-gray-600 text-sm">
                    {extentionData?.requestFrom?.name}
                    {isRequestSender && " (You)"}
                  </p>
                  <p className="text-xs text-gray-400">
                    {extentionData?.requestedFromModel}
                  </p>
                </div>
              </div>
              <div>
                <div className="flex flex-col gap-1">
                  <p className="font-medium text-gray-900">Extension Date:</p>
                  <p className="text-gray-500 text-sm">
                    {extentionData?.createdAt
                      ? new Date(extentionData.createdAt).toLocaleString()
                      : ""}
                  </p>
                </div>
              </div>
            </div>

            {/* Requested To Section */}
            <div className="mb-4">
              <div className="flex flex-col gap-1">
                <p className="font-medium text-gray-900">Request To</p>
                <p className="text-gray-600 text-sm">
                  {extentionData?.requestTo?.name}
                  {isRequestReceiver && " (You)"}
                </p>
                <p className="text-xs text-gray-400">
                  {extentionData?.requestToModel}
                </p>
              </div>
            </div>

            {/* Current and New Date Section */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6 border px-4 py-3 rounded-2xl">
              {/* Current Date */}
              <div className="flex-1">
                <h4 className="font-medium text-gray-900 mb-2">
                  Current Completion Date
                </h4>
                <div className="rounded-lg p-3 flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <p className="text-gray-500 text-sm">
                    {extentionData?.currentDate
                      ? new Date(extentionData.currentDate).toLocaleString()
                      : ""}
                  </p>
                </div>
              </div>

              {/* Arrow */}
              <div className="flex items-center justify-center">
                <ArrowLeftRight className="w-6 h-6 text-gray-400" />
              </div>

              {/* New Proposed Date */}
              <div className="flex-1">
                <h4 className="font-medium text-gray-900 mb-2">
                  New Proposed Date
                </h4>
                <div className="rounded-lg p-3 flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <p className="text-gray-500 text-sm">
                    {extentionData?.requestedDateTime
                      ? new Date(extentionData.requestedDateTime).toLocaleString()
                      : ""}
                  </p>
                </div>
              </div>
            </div>

            {/* Reason for Request */}
            <div className="mb-6">
              <h4 className="font-medium text-gray-900 mb-2">
                Reason For Request
              </h4>
              <p className="text-gray-600 text-sm leading-relaxed rounded-lg">
                {extentionData?.reason}
              </p>
            </div>

            {/* Extension Status */}
            <div className="flex flex-col md:flex-row md:items-center gap-4 justify-between mb-6">
              <div className="flex flex-col md:flex-row md:items-center gap-2">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center ${content.statusBgColor}`}
                >
                  {content.statusIcon}
                </div>
                <div>
                  <p className="font-medium text-gray-900">Extension Status</p>
                  <p className={`text-sm ${content.statusColor}`}>
                    {content.statusText}
                  </p>
                </div>
              </div>
            </div>

            {/* Rejection Reason */}
            {extensionStatus.toUpperCase() === "REJECTED" && content.rejectionReason && (
              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-2">
                  Reason For Rejection :
                </h4>
                <p className="text-gray-600 text-sm leading-relaxed rounded-lg">
                  {content.rejectionReason}
                </p>
              </div>
            )}

            {/* Action Buttons */}
            {content.buttons && !isLoading && (
              <div className="flex flex-wrap gap-3">
                {content.buttons.map((button, index) => (
                  <button
                    key={index}
                    className={`px-6 py-2.5 ${button.color} text-white rounded-md transition-colors font-medium cursor-pointer`}
                    onClick={() => handleButtonClick(button.action)}
                    disabled={isLoading}
                  >
                    {button.text}
                  </button>
                ))}
              </div>
            )}

            {/* Loading State */}
            {isLoading && (
              <div className="flex items-center gap-2 text-gray-600">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#115e59]"></div>
                Processing...
              </div>
            )}


          </div>
        </div>
      </div>

      {/* Reject Modal */}
      <RejectModal
        isOpen={showRejectModal}
        onClose={() => setShowRejectModal(false)}
        onSubmit={handleRejectSubmit}
        isLoading={isLoading}
      />
    </>
  );
};

export default DateExtensionRequestSection;