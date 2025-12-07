import { X } from "lucide-react";
import Image from "next/image";

export const RejectModal = ({
    showRejectModal,
    setShowRejectModal,
    rejectReason,
    setRejectReason,
    rejectEvidence,
    setRejectEvidence,
    isSubmittingReject,
    handleRejectSubmit
}) => {
    if (!showRejectModal) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/60 p-4">
            <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Reject Cancellation Request</h3>
                    <button 
                        onClick={() => {
                            setShowRejectModal(false);
                            setRejectReason("");
                            setRejectEvidence([]);
                        }} 
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Reason for Rejection</label>
                    <textarea
                        value={rejectReason}
                        onChange={(e) => setRejectReason(e.target.value)}
                        placeholder="Please explain why you are rejecting this cancellation request."
                        className="w-full p-4 border rounded-lg h-28 resize-none"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Evidence (Optional)</label>
                    <div className="flex flex-wrap gap-4">
                        <label className="flex items-center justify-center w-28 h-28 border rounded-md bg-gray-50 cursor-pointer overflow-hidden relative">
                            <input
                                type="file"
                                accept="image/*,.pdf,.doc,.docx"
                                multiple
                                className="hidden"
                                onChange={(e) => {
                                    const files = Array.from(e.target.files || []);
                                    setRejectEvidence(prev => [...(prev || []), ...files]);
                                }}
                            />
                            <div className="text-center text-sm text-gray-500">
                                <div className="mb-1">Upload</div>
                                <div className="text-xs">Multiple</div>
                            </div>
                        </label>

                        {rejectEvidence && rejectEvidence.length > 0 && rejectEvidence.map((file, index) => (
                            <div key={index} className="w-28 h-28 border rounded-md overflow-hidden relative group">
                                {file.type.startsWith('image/') ? (
                                    <Image
                                        src={URL.createObjectURL(file)}
                                        alt="Preview"
                                        fill
                                        className="object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-500">
                                        <span className="text-2xl">📄</span>
                                    </div>
                                )}
                                <button
                                    onClick={() => setRejectEvidence(prev => prev.filter((_, i) => i !== index))}
                                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex justify-end gap-3 mt-6">
                    <button
                        type="button"
                        onClick={() => {
                            setShowRejectModal(false);
                            setRejectReason("");
                            setRejectEvidence([]);
                        }}
                        className="px-6 py-2.5 bg-gray-100 text-gray-800 rounded-md"
                        disabled={isSubmittingReject}
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={handleRejectSubmit}
                        className="px-6 py-2.5 bg-[#115E59] text-white rounded-md"
                        disabled={isSubmittingReject}
                    >
                        {isSubmittingReject ? (
                            <>
                                <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                                Submitting...
                            </>
                        ) : 'Submit'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RejectModal;