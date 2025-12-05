"use client";
import React, { useState } from "react";
import { Check, GitPullRequest, X, Download, Eye } from "lucide-react";
import Image from "next/image";
import client from "../../../public/client.png";
import {
    useGetCancellationRequestByTaskQuery,
    useDeleteCancellationRequestMutation,
    useAcceptCancellationRequestMutation,
    useRejectCancellationRequestMutation
} from "@/lib/features/cancelApi/cancellationApi";
import { toast } from "sonner";


const CancellationStatusComponent = ({ cancelData, taskId, taskDetails, isServiceProvider = false }) => {
    console.log("cancellation data====>", cancelData)
    const [showImagePreview, setShowImagePreview] = useState(false);
    const [selectedImage, setSelectedImage] = useState("");

    // Fetch cancellation request data from API
    const {
        data: cancellationResponse,
        isLoading,
        error
    } = useGetCancellationRequestByTaskQuery(taskId);

    const [deleteCancellationRequest] = useDeleteCancellationRequestMutation();
    const [acceptCancellationRequest] = useAcceptCancellationRequestMutation();
    const [rejectCancellationRequest] = useRejectCancellationRequestMutation();

    const cancellationRequest = cancellationResponse?.data;
    console.log("Cancellation Request Data:", cancellationRequest);

    // If no cancellation request or not in valid status, don't show anything
    if (!cancellationRequest || !cancellationRequest._id) {
        return null;
    }

    const isImageFile = (url) => {
        if (!url) return false;
        const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.svg'];
        return imageExtensions.some(ext => url.toLowerCase().includes(ext));
    };

    const isPDFFile = (url) => {
        if (!url) return false;
        return url.toLowerCase().includes('.pdf');
    };

    const getFileType = (url) => {
        if (isImageFile(url)) return 'image';
        if (isPDFFile(url)) return 'pdf';
        return 'document';
    };

    const handlePreviewImage = (imageUrl) => {
        setSelectedImage(imageUrl);
        setShowImagePreview(true);
    };

    const handleDownloadFile = (fileUrl, fileName) => {
        const link = document.createElement('a');
        link.href = fileUrl;
        link.download = fileName || 'evidence-file';
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const getStatusDisplay = (status, requestToModel, rejectDetails) => {
        switch (status.toUpperCase()) {
            case "PENDING":
                return {
                    statusText: requestToModel === "Provider"
                        ? "Pending Provider Review"
                        : "Pending Customer Review",
                    statusColor: "text-yellow-600",
                    bgColor: "bg-[#E6F4F1]",
                    icon: <div className="animate-pulse w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">!</span>
                    </div>,
                    showActionButtons: (isServiceProvider && requestToModel === "Provider") || (!isServiceProvider && requestToModel === "Customer"),
                    showDeleteButton: (isServiceProvider && requestToModel === "Customer") || (!isServiceProvider && requestToModel === "Provider"),
                    buttons: []
                };
            case "ACCEPTED":
                return {
                    statusText: "Request Accepted",
                    statusColor: "text-green-600",
                    bgColor: "bg-green-100",
                    icon: <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center">
                        <Check className="w-4 h-4 text-white" />
                    </div>,
                    showActionButtons: false,
                    buttons: [
                        {
                            text: "Request For Refund",
                            color: "bg-[#115e59] hover:bg-teal-700",
                            action: "refund"
                        }
                    ]
                };
            case "REJECTED":
                return {
                    statusText: "Request Rejected",
                    statusColor: "text-red-600",
                    bgColor: "bg-red-100",
                    icon: <div className="w-6 h-6 bg-red-600 rounded-full flex items-center justify-center">
                        <X className="w-4 h-4 text-white" />
                    </div>,
                    showActionButtons: false,
                    rejectionReason: rejectDetails,
                    buttons: [
                        {
                            text: "Request Ruling on Dispute",
                            color: "bg-[#115E59] hover:bg-teal-700",
                            action: "dispute"
                        }
                    ]
                };
            default:
                return {
                    statusText: "In Progress",
                    statusColor: "text-blue-600",
                    bgColor: "bg-blue-100",
                    icon: <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">?</span>
                    </div>,
                    showActionButtons: false,
                    buttons: []
                };
        }
    };

    const statusDisplay = getStatusDisplay(
        cancellationRequest.status,
        cancellationRequest.requestToModel,
        cancellationRequest.rejectDetails
    );

    const formatDate = (dateString) => {
        if (!dateString) return "";
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit"
            });
        } catch (error) {
            return "";
        }
    };

    // Handle button actions
    const handleButtonClick = async (action, buttonType) => {
        console.log(`Button clicked: ${action} - ${buttonType}`);

        try {
            switch (action) {
                case "accept":
                    if (confirm("Are you sure you want to accept this cancellation request?")) {
                        await acceptCancellationRequest(cancellationRequest._id).unwrap();
                        toast.success("Cancellation request accepted successfully");
                    }
                    break;
                case "reject":
                    if (confirm("Are you sure you want to reject this cancellation request?")) {
                        const reason = prompt("Please provide a reason for rejection:");
                        if (reason) {
                            await rejectCancellationRequest({ id: cancellationRequest._id, reason }).unwrap();
                            toast.success("Cancellation request rejected successfully");
                        }
                    }
                    break;
                case "view":
                    console.log("View cancellation details");
                    break;
                case "refund":
                    console.log("Request refund");
                    break;
                case "dispute":
                    console.log("Request dispute ruling");
                    break;
                case "delete":
                    if (confirm("Are you sure you want to delete this cancellation request?")) {
                        console.log("Deleting Request ID:", cancellationRequest._id);
                        await deleteCancellationRequest(cancellationRequest._id).unwrap();
                        toast.success("Cancellation request deleted successfully");
                    }
                    break;
                default:
                    console.log("Unknown action");
            }
        } catch (error) {
            console.error(`Failed to ${action} request:`, error);
            toast.error(error?.data?.message || `Failed to ${action} request`);
        }
    };

    return (
        <>
            <div className={`${statusDisplay.bgColor} border rounded-lg p-6 mb-6`}>
                <div className="flex items-start gap-3 mb-4">
                    <div className="bg-white rounded-full p-2 hidden lg:block">
                        <GitPullRequest className="w-5 h-5 text-[#115E59]" />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-6">
                            You requested to Cancel the task Via resolution center
                        </h3>

                        {/* Request Info Section */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                            {/* Requested By */}
                            <div className="flex flex-col md:flex-row items-start md:items-center gap-3">
                                <div className="w-12 h-12">
                                    <Image
                                        src={cancellationRequest.requestFrom?.profile_image || client}
                                        alt="requester"
                                        width={48}
                                        height={48}
                                        className="rounded-full object-cover"
                                    />
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900">Requested By</p>
                                    <p className="text-gray-600 text-sm">
                                        {cancellationRequest.requestFrom?.name || "N/A"}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Cancellation Reason */}
                        <div className="mb-6">
                            <h4 className="font-medium text-gray-900 mb-2">
                                Cancellation Reason
                            </h4>
                            <p className="text-gray-600 text-sm leading-relaxed rounded-lg ">
                                {cancellationRequest.reason}
                            </p>

                            {/* Additional cancellation details if available */}
                            {cancellationRequest.cancellationReason && (
                                <div className="mt-3">
                                    <h5 className="font-medium text-gray-900 mb-1">Additional Details:</h5>
                                    <p className="text-gray-600 text-sm leading-relaxed bg-white p-3 rounded-lg border">
                                        {cancellationRequest.cancellationReason}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Evidence Display */}
                        {(cancellationRequest.cancellationEvidence?.length > 0 || cancellationRequest.reject_evidence) && (
                            <div className="mb-6">
                                <h4 className="font-medium text-gray-900 mb-2">
                                    Supporting Evidence
                                </h4>
                                <div className="bg-white rounded-lg border p-4">
                                    {/* Cancellation Evidence */}
                                    {cancellationRequest.cancellationEvidence?.length > 0 && (
                                        <div className="mb-3">
                                            <h5 className="text-sm font-medium text-gray-700 mb-2">Cancellation Evidence:</h5>
                                            <div className="flex flex-wrap gap-2">
                                                {cancellationRequest.cancellationEvidence.map((evidence, index) => (
                                                    <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                                                        <span className="text-gray-500">📎</span>
                                                        <span className="text-sm text-gray-600">Evidence {index + 1}</span>
                                                        <button
                                                            onClick={() => handleDownloadFile(evidence, `evidence-${index + 1}`)}
                                                            className="text-xs text-[#115E59] hover:text-teal-700"
                                                        >
                                                            Download
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Reject Evidence */}
                                    {cancellationRequest.reject_evidence && (
                                        <div>
                                            <h5 className="text-sm font-medium text-gray-700 mb-2">Rejection Evidence:</h5>
                                            <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                                                <span className="text-gray-500">📎</span>
                                                <span className="text-sm text-gray-600">Rejection Evidence</span>
                                                <button
                                                    onClick={() => handleDownloadFile(cancellationRequest.reject_evidence, `reject-evidence`)}
                                                    className="text-xs text-[#115E59] hover:text-teal-700"
                                                >
                                                    Download
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Status Section */}
                        <div className="flex flex-col md:flex-row md:items-center gap-4 justify-between mb-6">
                            <div className="flex flex-col md:flex-row md:items-center gap-3">
                                {statusDisplay.icon}
                                <div>
                                    <p className="font-medium text-gray-900">
                                        Cancellation Status
                                    </p>
                                    <p className={`text-sm font-medium ${statusDisplay.statusColor}`}>
                                        {statusDisplay.statusText}
                                    </p>
                                </div>
                            </div>

                            <div className="text-right">
                                {cancellationRequest.reviewedRequestAt && (
                                    <p className="text-gray-500 text-xs">
                                        Reviewed: {formatDate(cancellationRequest.reviewedRequestAt)}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Rejection Reason (if rejected) */}
                        {cancellationRequest.status.toUpperCase() === "REJECTED" && cancellationRequest.rejectDetails && (
                            <div className="mb-6">
                                <h4 className="font-medium text-gray-900 mb-2">
                                    Reason for Rejection
                                </h4>
                                <p className="text-gray-600 text-sm leading-relaxed bg-white p-3 rounded-lg border border-red-200">
                                    {cancellationRequest.rejectDetails}
                                </p>
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex flex-wrap gap-3">
                            {/* Status based buttons */}
                            {statusDisplay.buttons.map((button, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleButtonClick(button.action, "status")}
                                    className={`px-6 py-2.5 text-white rounded-md transition-colors font-medium cursor-pointer ${button.color}`}
                                >
                                    {button.text}
                                </button>
                            ))}

                            {/* Accept/Reject Buttons for Recipient */}
                            {statusDisplay.showActionButtons && cancellationRequest.status.toUpperCase() === "PENDING" && (
                                <>
                                    <button
                                        onClick={() => handleButtonClick("accept", "provider")}
                                        className="px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors font-medium cursor-pointer"
                                    >
                                        Accept Request
                                    </button>
                                    <button
                                        onClick={() => handleButtonClick("reject", "provider")}
                                        className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors font-medium cursor-pointer"
                                    >
                                        Reject Request
                                    </button>
                                </>
                            )}

                            {/* Delete Button for Sender */}
                            {statusDisplay.showDeleteButton && cancellationRequest.status.toUpperCase() === "PENDING" && (
                                <button
                                    onClick={() => handleButtonClick("delete", "sender")}
                                    className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors font-medium cursor-pointer"
                                >
                                    Delete Request
                                </button>
                            )}
                        </div>

                        {/* Loading State */}
                        {isLoading && (
                            <div className="flex items-center justify-center py-4">
                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#115E59]"></div>
                                <span className="ml-2 text-gray-600">Loading cancellation details...</span>
                            </div>
                        )}

                        {/* Error State */}
                        {error && (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-4">
                                <p className="text-red-700 text-sm">
                                    Failed to load cancellation request details. Please try again.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Image Preview Modal */}
            {showImagePreview && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/80 p-4">
                    <div className="relative max-w-4xl max-h-full">
                        <button
                            onClick={() => setShowImagePreview(false)}
                            className="absolute -top-10 right-0 text-white hover:text-gray-300 cursor-pointer z-10"
                        >
                            <X className="w-6 h-6" />
                        </button>

                        <div className="bg-white rounded-lg overflow-hidden">
                            <Image
                                src={selectedImage}
                                alt="Evidence preview"
                                width={800}
                                height={600}
                                className="max-w-full max-h-[80vh] object-contain"
                            />
                        </div>

                        <div className="flex justify-center mt-4">
                            <button
                                onClick={() => handleDownloadFile(selectedImage, `evidence-image-${taskId}`)}
                                className="flex items-center gap-2 px-4 py-2 bg-[#115E59] text-white rounded-lg hover:bg-teal-700 transition-colors cursor-pointer"
                            >
                                <Download className="w-4 h-4" />
                                Download Image
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default CancellationStatusComponent;