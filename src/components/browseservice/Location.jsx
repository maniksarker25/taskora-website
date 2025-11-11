"use client";
import React from "react";

const Location = ({ value, onChange }) => {
  return (
    <div className="w-full max-w-sm">
      <select
        id="location"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-2 pr-10 border border-[#6B7280] rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-[#6B7280] focus:border-[#6B7280] text-[#6B7280]"
      >
        <option value="">All Locations</option>
        <option value="USA">USA</option>
        <option value="Canada">Canada</option>
        <option value="England">England</option>
        <option value="Moscow">Moscow</option>
        <option value="Bangladesh">Bangladesh</option>
      </select>
    </div>
  );
};

export default Location;