export const CancellationReason = ({ reason, additionalReason }) => {
    return (
        <div className="mb-6">
            <h4 className="font-medium text-gray-900 mb-2">Cancellation Reason</h4>
            <p className="text-gray-600 text-sm leading-relaxed rounded-lg">
                {reason}
            </p>
            {additionalReason && (
                <div className="mt-3">
                    <h5 className="font-medium text-gray-900 mb-1">Additional Details:</h5>
                    <p className="text-gray-600 text-sm leading-relaxed bg-white p-3 rounded-lg border">
                        {additionalReason}
                    </p>
                </div>
            )}
        </div>
    );
};

export default CancellationReason;