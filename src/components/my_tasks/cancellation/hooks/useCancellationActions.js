// components/my_tasks/cancellation/hooks/useCancellationActions.js
import { useState } from "react";
import { toast } from "sonner";

export const useCancellationActions = ({
  cancellationRequest,
  isServiceProvider,
  refetch,
  deleteCancellationRequest,
  acceptCancellationRequest,
  rejectCancellationRequest,
  makeDispute
}) => {
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [rejectEvidence, setRejectEvidence] = useState([]);
  const [isSubmittingReject, setIsSubmittingReject] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);
  const [isProcessingDispute, setIsProcessingDispute] = useState(false);
  const [showImagePreview, setShowImagePreview] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");

  const handleActionWithConfirmation = async (actionType, message, actionFn) => {
    toast(message, {
      action: {
        label: 'Confirm',
        onClick: async () => {
          try {
            await actionFn();
          } catch (error) {
            console.error(`${actionType} action failed:`, error);
            toast.error(error?.data?.message || `Failed to ${actionType} request`);
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

  const handleDisputeRequest = async () => {
    if (!cancellationRequest?._id) {
      toast.error("No cancellation request found");
      return;
    }

    handleActionWithConfirmation(
      "dispute",
      "Are you sure you want to request a dispute ruling? This will escalate the matter for official resolution.",
      async () => {
        setIsProcessingDispute(true);
        try {
          await makeDispute(cancellationRequest._id).unwrap();
          toast.success("Dispute request submitted successfully!");
          
          setTimeout(async () => {
            try {
              await refetch();
            } catch (e) {
              console.error("Refetch error after dispute:", e);
            }
          }, 500);
        } catch (error) {
          console.error("Dispute action failed:", error);
          
          if (error?.data?.message === "Cancellation Request not found") {
            toast.error("Cancellation request not found.");
          } else if (error?.status === 404) {
            toast.error("API endpoint not found.");
          } else {
            toast.error(error?.data?.message || "Failed to submit dispute request");
          }
        } finally {
          setIsProcessingDispute(false);
        }
      }
    );
  };

  const handleAction = async (actionType) => {
    try {
      switch (actionType) {
        case "accept":
          handleActionWithConfirmation(
            "accept",
            "Are you sure you want to accept this cancellation request?",
            async () => {
              await acceptCancellationRequest(cancellationRequest._id).unwrap();
              toast.success("Cancellation request accepted successfully");
              
              setTimeout(async () => {
                try {
                  await refetch();
                } catch (e) {
                  console.error("Refetch error:", e);
                }
              }, 500);
            }
          );
          break;
          
        case "reject":
          setShowRejectModal(true);
          break;
          
        case "delete":
          handleActionWithConfirmation(
            "delete",
            "Are you sure you want to delete this cancellation request? This action cannot be undone.",
            async () => {
              await deleteCancellationRequest(cancellationRequest._id).unwrap();
              toast.success("Cancellation request deleted successfully");
              setIsDeleted(true);
              
              setTimeout(async () => {
                try {
                  await refetch();
                } catch (e) {
                  console.error("Refetch error:", e);
                }
              }, 500);
            }
          );
          break;
          
        case "dispute":
          await handleDisputeRequest();
          break;
          
        case "refund":
          toast.info("Refund feature coming soon");
          break;
          
        default:
          console.log("Unknown action type:", actionType);
      }
    } catch (error) {
      console.error(`Action failed: ${actionType}`, error);
      toast.error(error?.data?.message || `Failed to ${actionType} request`);
    }
  };

  const handleRejectSubmit = async () => {
    if (!rejectReason.trim()) {
      toast.error('Please provide a reason for rejection');
      return;
    }
    
    setIsSubmittingReject(true);
    try {
      await rejectCancellationRequest({ 
        id: cancellationRequest._id, 
        reason: rejectReason, 
        evidence: rejectEvidence 
      }).unwrap();
      toast.success('Cancellation request rejected successfully');
      setShowRejectModal(false);
      setRejectReason("");
      setRejectEvidence([]);
      setTimeout(() => { try { refetch(); } catch (e) { } }, 400);
    } catch (err) {
      console.error('Reject failed', err);
      toast.error(err?.data?.message || 'Failed to reject request');
    } finally {
      setIsSubmittingReject(false);
    }
  };

  const handleFileDownload = (url, filename = "evidence") => {
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      });
    } catch {
      return "";
    }
  };

  const getStatusConfig = (status, requestToModel) => {
    const statusUpper = status?.toUpperCase();
    const isPending = statusUpper === "PENDING";
    const isToProvider = requestToModel === "Provider";

    return {
      PENDING: {
        statusText: isToProvider ? "Pending Provider Review" : "Pending Customer Review",
        statusColor: "text-yellow-600",
        bgColor: "bg-[#E6F4F1]",
        canAcceptReject: (isServiceProvider && isToProvider) || (!isServiceProvider && !isToProvider),
        canDelete: (isServiceProvider && !isToProvider) || (!isServiceProvider && isToProvider),
      },
      ACCEPTED: {
        statusText: "Request Accepted",
        statusColor: "text-green-600",
        bgColor: "bg-green-100",
        actions: [{ label: "Request For Refund", action: "refund" }]
      },
      REJECTED: {
        statusText: "Request Rejected",
        statusColor: "text-red-600",
        bgColor: "bg-red-100",
        actions: [{ label: "Request Ruling on Dispute", action: "dispute" }]
      },
      DISPUTED: {
        statusText: "Under Dispute Resolution",
        statusColor: "text-[#115e59]",
        bgColor: "bg-[#115e59]",
        actions: []
      }
    }[statusUpper] || {
      statusText: "In Progress",
      statusColor: "text-blue-600",
      bgColor: "bg-blue-100",
    };
  };

  return {
    showRejectModal,
    rejectReason,
    rejectEvidence,
    isSubmittingReject,
    isDeleted,
    isProcessingDispute,
    showImagePreview,
    selectedImage,
    
    setShowRejectModal,
    setRejectReason,
    setRejectEvidence,
    setIsDeleted,
    setShowImagePreview,
    setSelectedImage,
    
    handleAction,
    handleRejectSubmit,
    handleFileDownload,
    formatDate,
    getStatusConfig
  };
};