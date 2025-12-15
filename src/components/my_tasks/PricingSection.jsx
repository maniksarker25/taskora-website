import React from "react";

const PricingSection = ({ bidsData,budget, discountPercent = 0 }) => {
  const discountAmount = ((Number(budget) || 0) * discountPercent) / 100;
  const offeredPrice = (Number(budget) || 0) - discountAmount;

  console.log("bidssssss===>>",bidsData?.data?.result[0])

  return (
    <div className="flex flex-col gap-4 border-b-2 border-[#dedfe2] pb-4">
      <div className="flex justify-between items-center">
        <p className="text-base font-semibold">Accepeted Bid Amount</p>
        <p className="text-base text-[#6B7280]">₦ {bidsData?.data?.result[0]?.price}</p>
      </div>
      <div className="flex justify-between items-center">
        <p className="text-base font-semibold">Discount ({discountPercent}%)</p>
        <p className="text-base text-[#6B7280]">₦ {discountAmount}</p>
      </div>
    </div>
  );
};

export default PricingSection;