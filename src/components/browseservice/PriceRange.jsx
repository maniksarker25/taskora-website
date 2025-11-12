"use client";
import React, { useState, useEffect } from "react";

const PriceRange = ({ minPrice, maxPrice, onChange }) => {
  const [localMin, setLocalMin] = useState(minPrice || "");
  const [localMax, setLocalMax] = useState(maxPrice || "");
  const [showSlider, setShowSlider] = useState(false);

  useEffect(() => {
    setLocalMin(minPrice || "");
    setLocalMax(maxPrice || "");
  }, [minPrice, maxPrice]);

  const handleMinChange = (e) => {
    const value = e.target.value;
    setLocalMin(value);
  };

  const handleMaxChange = (e) => {
    const value = e.target.value;
    setLocalMax(value);
  };

  const applyPriceFilter = () => {
    onChange(localMin, localMax);
    setShowSlider(false);
  };

  const clearPriceFilter = () => {
    setLocalMin("");
    setLocalMax("");
    onChange("", "");
    setShowSlider(false);
  };

  return (
    <div className="w-full max-w-sm relative">
      {/* Price Range Button */}
      <button
        onClick={() => setShowSlider(!showSlider)}
        className="w-full px-4 py-2 pr-10 border border-[#6B7280] rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-[#6B7280] focus:border-[#6B7280] text-[#6B7280] bg-white text-left"
      >
        {minPrice || maxPrice ? `$${minPrice || "0"} - $${maxPrice || "Any"}` : "Price Range"}
      </button>

      {/* Price Range Slider Dropdown */}
      {showSlider && (
        <div className="absolute top-full left-0 mt-2 w-80 bg-white border border-gray-300 rounded-lg shadow-lg z-10 p-4">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Price Range
            </label>
            
            {/* Min and Max Inputs */}
            <div className="flex gap-3 mb-4">
              <div className="flex-1">
                <label className="block text-xs text-gray-500 mb-1">Min Price ($)</label>
                <input
                  type="number"
                  placeholder="0"
                  value={localMin}
                  onChange={handleMinChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  min="0"
                />
              </div>
              <div className="flex-1">
                <label className="block text-xs text-gray-500 mb-1">Max Price ($)</label>
                <input
                  type="number"
                  placeholder="Any"
                  value={localMax}
                  onChange={handleMaxChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  min="0"
                />
              </div>
            </div>

            {/* Range Slider */}
            <div className="mb-4">
              <div className="flex justify-between text-xs text-gray-500 mb-2">
                <span>${localMin || "0"}</span>
                <span>${localMax || "Any"}</span>
              </div>
              <div className="relative">
                <div className="h-2 bg-gray-200 rounded-full">
                  <div 
                    className="h-2 bg-blue-500 rounded-full"
                    style={{
                      width: localMax ? `${(Math.min(parseInt(localMax) || 0, 10000) / 10000) * 100}%` : '0%'
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button
              onClick={clearPriceFilter}
              className="flex-1 px-4 py-2 text-sm border border-gray-300 rounded-md text-gray-600 hover:bg-gray-50"
            >
              Clear
            </button>
            <button
              onClick={applyPriceFilter}
              className="flex-1 px-4 py-2 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Apply
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PriceRange;

