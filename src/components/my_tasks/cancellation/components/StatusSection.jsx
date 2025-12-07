import  StatusIcon  from "./StatusIcon";

export const StatusSection = ({ 
    status, 
    statusText, 
    statusColor, 
    reviewedRequestAt, 
    formatDate 
}) => {
    return (
        <div className="flex flex-col md:flex-row md:items-center gap-4 justify-between mb-6">
            <div className="flex flex-col md:flex-row md:items-center gap-3">
                <StatusIcon status={status} />
                <div>
                    <p className="font-medium text-gray-900">Cancellation Status</p>
                    <p className={`text-sm font-medium ${statusColor}`}>
                        {statusText}
                    </p>
                </div>
            </div>
            {reviewedRequestAt && (
                <div className="text-right">
                    <p className="text-gray-500 text-xs">
                        Reviewed: {formatDate(reviewedRequestAt)}
                    </p>
                </div>
            )}
        </div>
    );
};

export default StatusSection;