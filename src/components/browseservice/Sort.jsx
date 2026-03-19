"use client";

const Sort = ({ value, onChange }) => {
  return (
    <div className="w-full max-w-sm">
      <select
        id="sort"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full cursor-pointer px-4 py-2 pr-10 border border-[#6B7280] rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-[#6B7280] focus:border-[#6B7280] text-[#6B7280]"
      >
        <option value="">Sort By</option>
        <option value="price_low_high cursor-pointer">Price: Low to High</option>
        <option value="price_high_low cursor-pointer">Price: High to Low</option>
      </select>
    </div>
  );
};

export default Sort;
