import { ActionButton } from "./ActionButton";

export const ActionButtons = ({ 
    statusConfig, 
    isPending, 
    isRejected, 
    isDisputed, 
    isProcessingDispute, 
    handleAction 
}) => {
    return (
        <div className="flex flex-wrap gap-3">
            {/* Status-based actions */}
            {statusConfig.actions?.map((action, index) => (
                <ActionButton
                    key={index}
                    onClick={() => handleAction(action.action)}
                    variant={action.action === "dispute" ? "dispute" : "primary"}
                    disabled={action.action === "dispute" && isProcessingDispute}
                >
                    {action.action === "dispute" && isProcessingDispute ? (
                        <>
                            <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                            Processing...
                        </>
                    ) : (
                        action.label
                    )}
                </ActionButton>
            ))}

            {/* Accept/Reject buttons */}
            {isPending && statusConfig.canAcceptReject && (
                <>
                    <ActionButton onClick={() => handleAction("accept")} variant="accept">
                        Accept Request
                    </ActionButton>
                    <ActionButton onClick={() => handleAction("reject")} variant="reject">
                        Reject Request
                    </ActionButton>
                </>
            )}

            {/* Delete button */}
            {isPending && statusConfig.canDelete && (
                <ActionButton onClick={() => handleAction("delete")} variant="delete">
                    Delete Request
                </ActionButton>
            )}

            {/* Dispute already requested message */}
            {isDisputed && (
                <div className="px-4 py-2 bg-purple-100 text-purple-800 rounded-md">
                    ⚖️ Dispute resolution in progress
                </div>
            )}
        </div>
    );
};

export default ActionButtons;