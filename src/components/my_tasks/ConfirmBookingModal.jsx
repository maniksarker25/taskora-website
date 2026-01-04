import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useGetPlatformFeeQuery, useVerifyPromoMutation } from '@/lib/features/promo/promoApi';
import { toast } from 'sonner';


const ConfirmBookingModal = ({ isOpen, onClose, onContinue, bidAmount, isLoading }) => {
    const [showCoupon, setShowCoupon] = useState(false);
    const [promoCode, setPromoCode] = useState('');
    const [discount, setDiscount] = useState(0);
    const [isApplying, setIsApplying] = useState(false);
    const [totalPrice, setTotalPrice] = useState(bidAmount)
    const [verifyPromo, { data: promoData, isLoading: promoLoading }] = useVerifyPromoMutation();
    const { data: platformFeeData } = useGetPlatformFeeQuery();

    const referralDiscount = platformFeeData?.data?.referralDiscount || 0;
    const finalTotal = bidAmount - referralDiscount - (showCoupon ? discount : 0);

    if (!isOpen) return null;

    // Handle Apply Promo
    const handleApplyPromo = async () => {
        if (!promoCode) return;

        try {
            setIsApplying(true);
            const response = await verifyPromo({ promoCode }).unwrap();

            if (response && response.success) {
                const { discountType, discountNum } = response.data;
                let calculatedDiscount = 0;

                // Discount is applied on the bid amount
                if (discountType === 'PERCENT') {
                    calculatedDiscount = (bidAmount * discountNum) / 100;
                } else if (discountType === 'FIXED') {
                    calculatedDiscount = discountNum;
                }

                setDiscount(calculatedDiscount);
            } else {
                toast.error(response?.message || 'Invalid promo code');
                setDiscount(0);
            }
        } catch (err) {
            console.error(err);
            toast.error(err.data?.message || 'Something went wrong!');
            setDiscount(0);
        } finally {
            setIsApplying(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white rounded-xl w-full max-w-md shadow-xl relative overflow-hidden">
                {/* Close Button */}
                <button
                    type="button"
                    onClick={!(isApplying || isLoading) ? onClose : undefined}
                    className={`absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors ${(isApplying || isLoading) ? 'cursor-not-allowed opacity-50' : ''}`}
                    disabled={isApplying || isLoading}
                >
                    <X size={20} />
                </button>

                <div className="p-6 pt-10">
                    <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">Confirm Booking</h2>

                    {/* Total Amount */}
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2 font-medium">Total Amount:</label>
                        <div className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-600 bg-gray-50 flex items-center justify-between">
                            <span className={(referralDiscount > 0 || (showCoupon && discount > 0)) ? "line-through text-gray-400" : ""}>
                                ₦ {bidAmount?.toLocaleString() || '0.00'}
                            </span>
                            {(referralDiscount > 0 || (showCoupon && discount > 0)) && (
                                <span className="text-gray-900 font-bold">
                                    ₦ {finalTotal?.toLocaleString()}
                                </span>
                            )}
                        </div>
                        {(referralDiscount > 0 || (showCoupon && discount > 0)) && (
                            <div className="mt-2 ml-1 text-sm text-gray-600 space-y-1">
                                {referralDiscount > 0 && (
                                    <p>Referral Discount:  ₦ {referralDiscount.toLocaleString()}</p>
                                )}
                                {showCoupon && discount > 0 && (
                                    <p>Promo Discount:  ₦ {discount.toLocaleString()}</p>
                                )}
                                {/* <p className="font-semibold text-teal-700">Total Savings: ₦ {(referralDiscount + discount).toLocaleString()}</p> */}
                            </div>
                        )}
                    </div>

                    {/* Promo Section */}
                    <div className="mb-4">
                        <label className={`flex items-center justify-between cursor-pointer group ${isApplying ? 'opacity-50 pointer-events-none' : ''}`}>
                            <span className="font-medium text-gray-900">Apply a Promo code</span>
                            <input
                                type="checkbox"
                                checked={showCoupon}
                                onChange={(e) => setShowCoupon(e.target.checked)}
                                className="w-5 h-5 text-teal-700 rounded border-gray-300 focus:ring-teal-700 accent-[#115e59]"
                                disabled={isApplying}
                            />
                        </label>
                    </div>

                    {showCoupon && (
                        <div className="mb-8 flex gap-2">
                            <input
                                type="text"
                                value={promoCode}
                                onChange={(e) => setPromoCode(e.target.value)}
                                placeholder="Enter promo code"
                                className="flex-1 border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal-700 disabled:bg-gray-100 disabled:text-gray-500"
                                disabled={isApplying}
                            />
                            <button
                                type="button"
                                className="bg-[#115e59] text-white px-6 py-2.5 rounded-lg hover:bg-teal-800 transition-colors font-medium disabled:opacity-50"
                                onClick={handleApplyPromo}
                                disabled={isApplying}
                            >
                                {isApplying ? 'Applying...' : 'Apply'}
                            </button>
                        </div>
                    )}
                    {!showCoupon && <div className="mb-8"></div>}

                    {/* Action Buttons */}
                    <div className="flex gap-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-3 border border-red-500 text-red-500 rounded-lg font-semibold hover:bg-red-50 transition-colors disabled:opacity-50"
                            disabled={isApplying || isLoading}
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={() => onContinue(showCoupon ? promoCode : '', showCoupon ? discount : 0)}
                            className="flex-1 py-3 bg-[#115e59] text-white rounded-lg font-semibold hover:bg-teal-800 transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
                            disabled={isApplying || isLoading}
                        >
                            {(isApplying || isLoading) ? (
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
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
