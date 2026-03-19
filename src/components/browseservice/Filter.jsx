"use client";

import { RotateCcw, Search } from "lucide-react";
import { useCallback, useState } from "react";
import CategorySelect from "./CategorySelect";
import Location from "./Location";
import PriceRange from "./PriceRange";
import Sort from "./Sort";

const Filter = ({ onFilterChange }) => {
  const [filters, setFilters] = useState({
    search: "",
    category: "",
    location: "",
    minPrice: "",
    maxPrice: "",
    sort: "",
  });

  // Debounced-like state update to avoid heavy parent re-renders on every keystroke
  const updateFilters = useCallback(
    (updatedFields) => {
      const newFilters = { ...filters, ...updatedFields };
      setFilters(newFilters);
      onFilterChange(newFilters);
    },
    [filters, onFilterChange]
  );

  const handleReset = () => {
    const resetState = {
      search: "",
      category: "",
      location: "",
      minPrice: "",
      maxPrice: "",
      sort: "",
    };
    setFilters(resetState);
    onFilterChange(resetState);
  };

  const hasActiveFilters = Object.values(filters).some((val) => val !== "");

  return (
    <div className="w-full bg-white py-4 mb-6">
      <div className="flex flex-col gap-4">
        {/* Top Row: Search & Reset */}
        <div className="flex flex-col md:flex-row items-center gap-3">
          <div className="relative flex-1 group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400 group-focus-within:text-[#115E59] transition-colors" />
            </div>
            <input
              type="text"
              placeholder="What are you looking for?"
              className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:ring-2 focus:ring-[#115E59]/20 focus:border-[#115E59] outline-none transition-all text-sm font-medium text-gray-700"
              value={filters.search}
              onChange={(e) => updateFilters({ search: e.target.value })}
            />
          </div>

          {hasActiveFilters && (
            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              Reset Filters
            </button>
          )}
        </div>

        {/* Bottom Row: Selectors Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 items-center gap-3">
          <div className="relative">
            <label className="text-[10px] uppercase tracking-wider font-bold text-gray-400 absolute -top-2 left-3 bg-white px-1 z-10">
              Category
            </label>
            <CategorySelect
              value={filters.category}
              onChange={(value) => updateFilters({ category: value })}
            />
          </div>

          <div className="relative cursor-pointer">
            <label className="text-[10px] uppercase tracking-wider font-bold text-gray-400 absolute -top-2 left-3 bg-white px-1 z-10">
              Location
            </label>
            <Location
              value={filters.location}
              onChange={(value) => updateFilters({ location: value })}
            />
          </div>

          <div className="relative">
            <label className="text-[10px] uppercase tracking-wider font-bold text-gray-400 absolute -top-2 left-3 bg-white px-1 z-10">
              Budget
            </label>
            <PriceRange
              minPrice={filters.minPrice}
              maxPrice={filters.maxPrice}
              onChange={(min, max) => updateFilters({ minPrice: min, maxPrice: max })}
            />
          </div>

          <div className="relative">
            <label className="text-[10px] uppercase tracking-wider font-bold text-gray-400 absolute -top-2 left-3 bg-white px-1 z-10">
              Sort
            </label>
            <Sort value={filters.sort} onChange={(value) => updateFilters({ sort: value })} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Filter;
