// components/my_tasks/CancellationStatusComponent.jsx
"use client";
import React from "react";
import { GitPullRequest } from "lucide-react";
import {
    useGetCancellationRequestByTaskQuery,
    useDeleteCancellationRequestMutation,
    useAcceptCancellationRequestMutation,
    useRejectCancellationRequestMutation,
    useMakeCancellationDisputeMutation
} from "@/lib/features/cancelApi/cancellationApi";

// Import custom hook
import { useCancellationActions } from "./cancellation/hooks/useCancellationActions";

// Import components
import RequesterInfo from "./cancellation/components/RequesterInfo";
import CancellationReason from "./cancellation/components/CancellationReason";
import EvidenceSection from "./cancellation/components/EvidenceSection";
import StatusSection from "./cancellation/components/StatusSection";
import RejectionReason from "./cancellation/components/RejectionReason";
import ActionButtons from "./cancellation/components/ActionButtons";
import RejectModal from "./cancellation/components/RejectModal";
import ImagePreviewModal from "./cancellation/components/ImagePreviewModal";

const CancellationStatusComponent = ({ taskId, isServiceProvider = false }) => {
    // API Hooks
    const { data: cancellationResponse, isLoading, error, refetch } = useGetCancellationRequestByTaskQuery(taskId);
    const [deleteCancellationRequest] = useDeleteCancellationRequestMutation();
    const [acceptCancellationRequest] = useAcceptCancellationRequestMutation();
    const [rejectCancellationRequest] = useRejectCancellationRequestMutation();
    const [makeDispute] = useMakeCancellationDisputeMutation();

    const cancellationRequest = cancellationResponse?.data;
    console.log("cancellationRequest", cancellationRequest);

    // Custom hook for all actions
    const {
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
    } = useCancellationActions({
        cancellationRequest,
        isServiceProvider,
        refetch,
        deleteCancellationRequest,
        acceptCancellationRequest,
        rejectCancellationRequest,
        makeDispute
    });

    if (isDeleted || !cancellationRequest?._id) return null;

    const statusConfig = getStatusConfig(
        cancellationRequest.status,
        cancellationRequest.requestToModel
    );

    const { status } = cancellationRequest;
    const isPending = status.toUpperCase() === "PENDING";
    const isRejected = status.toUpperCase() === "REJECTED";
    const isDisputed = status.toUpperCase() === "DISPUTED";

    return (
        <>
            <div className={`${statusConfig.bgColor} border rounded-lg p-6 mb-6`}>
                <div className="flex items-start gap-3 mb-4">
                    <div className="bg-white rounded-full p-2 hidden lg:block">
                        <GitPullRequest className="w-5 h-5 text-[#115E59]" />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-6">
                            You requested to Cancel the task Via resolution center
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                            <RequesterInfo requestFrom={cancellationRequest.requestFrom} />
                        </div>

                        <CancellationReason
                            reason={cancellationRequest.reason}
                            additionalReason={cancellationRequest.cancellationReason}
                        />

                        <EvidenceSection
                            cancellationEvidence={cancellationRequest.cancellationEvidence}
                            rejectEvidence={cancellationRequest.reject_evidence}
                            onDownload={handleFileDownload}
                        />

                        <StatusSection
                            status={cancellationRequest.status}
                            statusText={statusConfig.statusText}
                            statusColor={statusConfig.statusColor}
                            reviewedRequestAt={cancellationRequest.reviewedRequestAt}
                            formatDate={formatDate}
                        />

                        <RejectionReason rejectDetails={cancellationRequest.rejectDetails} />

                        <ActionButtons
                            statusConfig={statusConfig}
                            isPending={isPending}
                            isRejected={isRejected}
                            isDisputed={isDisputed}
                            isProcessingDispute={isProcessingDispute}
                            handleAction={handleAction}
                        />

                        {isLoading && (
                            <div className="flex items-center justify-center py-4">
                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#115E59]"></div>
                                <span className="ml-2 text-gray-600">Loading...</span>
                            </div>
                        )}

                        {error && (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-4">
                                <p className="text-red-700 text-sm">
                                    Failed to load cancellation request details.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <ImagePreviewModal
                showImagePreview={showImagePreview}
                setShowImagePreview={setShowImagePreview}
                selectedImage={selectedImage}
                taskId={taskId}
                handleFileDownload={handleFileDownload}
            />

            <RejectModal
                showRejectModal={showRejectModal}
                setShowRejectModal={setShowRejectModal}
                rejectReason={rejectReason}
                setRejectReason={setRejectReason}
                rejectEvidence={rejectEvidence}
                setRejectEvidence={setRejectEvidence}
                isSubmittingReject={isSubmittingReject}
                handleRejectSubmit={handleRejectSubmit}
            />
        </>
    );
};

export default CancellationStatusComponent;