import React, { useState } from 'react';
import { X } from 'lucide-react';

const ConfirmBookingModal = ({ isOpen, onClose, onContinue, bidAmount, isLoading }) => {
    const [showCoupon, setShowCoupon] = useState(false);
    const [couponCode, setCouponCode] = useState('');

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white rounded-xl w-full max-w-md shadow-xl relative overflow-hidden">
                {/* Close Button */}
                <button
                    type="button"
                    onClick={!isLoading ? onClose : undefined}
                    className={`absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors ${isLoading ? 'cursor-not-allowed opacity-50' : ''}`}
                    disabled={isLoading}
                >
                    <X size={20} />
                </button>

                <div className="p-6 pt-10">
                    <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">Confirm Booking</h2>

                    {/* Total Amount */}
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2 font-medium">Total Amount:-</label>
                        <div className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-600 bg-gray-50 cursor-not-allowed">
                            ₦ {bidAmount?.toLocaleString() || '0.00'} (-0%)
                        </div>
                        {/* <p className="text-xs text-gray-400 mt-1">Referral Applied (-2%)</p> */}
                    </div>

                    {/* Coupon Checkbox */}
                    <div className="mb-4">
                        <label className={`flex items-center justify-between cursor-pointer group ${isLoading ? 'opacity-50 pointer-events-none' : ''}`}>
                            <span className="font-medium text-gray-900">Apply a coupon code</span>
                            <input
                                type="checkbox"
                                checked={showCoupon}
                                onChange={(e) => setShowCoupon(e.target.checked)}
                                className="w-5 h-5 text-teal-700 rounded border-gray-300 focus:ring-teal-700 accent-[#115e59]"
                                disabled={isLoading}
                            />
                        </label>
                    </div>

                    {/* Coupon Input Section */}
                    {showCoupon && (
                        <div className="mb-8 flex gap-2">
                            <input
                                type="text"
                                value={couponCode}
                                onChange={(e) => setCouponCode(e.target.value)}
                                placeholder="Enter your coupon code"
                                className="flex-1 border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal-700 disabled:bg-gray-100 disabled:text-gray-500"
                                disabled={isLoading}
                            />
                            <button
                                type="button"
                                className="bg-[#115e59] text-white px-6 py-2.5 rounded-lg hover:bg-teal-800 transition-colors font-medium cursor-default disabled:opacity-50"
                                onClick={(e) => e.preventDefault()}
                                disabled={isLoading}
                            >
                                Apply
                            </button>
                        </div>
                    )}

                    {/* Spacing if coupon hidden to match visual balance */}
                    {!showCoupon && <div className="mb-8"></div>}

                    {/* Action Buttons */}
                    <div className="flex gap-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-3 border border-red-500 text-red-500 rounded-lg font-semibold hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={isLoading}
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={() => onContinue(couponCode)}
                            className="flex-1 py-3 bg-[#115e59] text-white rounded-lg font-semibold hover:bg-teal-800 transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    Processing...
                                </>
                            ) : (
                                'Continue'
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConfirmBookingModal;
