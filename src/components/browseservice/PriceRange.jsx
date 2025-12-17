"use client";
import React, { useState, useEffect, useRef } from "react";
import { Slider } from "antd";

const PriceRange = ({ minPrice, maxPrice, onChange }) => {
  const [localMin, setLocalMin] = useState(minPrice || "");
  const [localMax, setLocalMax] = useState(maxPrice || "");
  const [showSlider, setShowSlider] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    setLocalMin(minPrice || "");
    setLocalMax(maxPrice || "");
  }, [minPrice, maxPrice]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setShowSlider(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
    <div className="w-full max-w-sm relative" ref={containerRef}>
      {/* Price Range Button */}
      <button
        onClick={() => setShowSlider(!showSlider)}
        className="w-full px-4 py-2 pr-10 border border-[#6B7280] rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-[#6B7280] focus:border-[#6B7280] text-[#6B7280] bg-white text-left"
      >
        {minPrice || maxPrice ? `$${minPrice || "0"} - $${maxPrice || "Any"}` : "Price Range"}
      </button>

      {/* Price Range Slider Dropdown */}
      {showSlider && (
        <div className="absolute top-full left-0 mt-2 w-80 bg-white border border-gray-300 rounded-lg shadow-lg p-4 z-50">
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#115E59]"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#115E59]"
                  min="0"
                />
              </div>
            </div>

            {/* Range Slider */}
            <div className="mb-6 px-2">
              <Slider
                range
                min={0}
                max={100000}
                value={[
                  parseInt(localMin) || 0,
                  parseInt(localMax) || 100000
                ]}
                onChange={(values) => {
                  setLocalMin(values[0]);
                  setLocalMax(values[1]);
                }}
                trackStyle={[{ backgroundColor: '#115E59' }]}
                handleStyle={[
                  { borderColor: '#115E59', backgroundColor: '#115E59' },
                  { borderColor: '#115E59', backgroundColor: '#115E59' }
                ]}
              />
              <div className="flex justify-between text-xs text-gray-500 mt-2">
                <span>$0</span>
                <span>$100k+</span>
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
              className="flex-1 px-4 py-2 text-sm bg-[#115E59] text-white rounded-md hover:bg-[#0F504C] transition-colors"
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
