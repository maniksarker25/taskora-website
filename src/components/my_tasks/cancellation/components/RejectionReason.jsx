export const RejectionReason = ({ rejectDetails }) => {
    if (!rejectDetails) return null;

    return (
        <div className="mb-6">
            <h4 className="font-medium text-gray-900 mb-2">Reason for Rejection</h4>
            <p className="text-gray-600 text-sm leading-relaxed rounded-lg">
                {rejectDetails}
            </p>
        </div>
    );
};

export default RejectionReason;