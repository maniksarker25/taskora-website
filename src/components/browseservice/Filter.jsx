"use client";
import React, { useState, useEffect } from "react";
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
    sort: ""
  });

  const handleFilterChange = (key, value) => {
    const newFilters = {
      ...filters,
      [key]: value
    };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 items-center mb-6 gap-3 md:gap-10">
      {/* Search Bar */}
      <div>
        <div className="flex items-center px-4 py-3 rounded-md border border-[#6B7280] overflow-hidden max-w-md mx-auto">
          <div className="border-r mr-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 192.904 192.904"
              width="16px"
              className="fill-gray-600 mr-3 rotate-90"
            >
              <path d="m190.707 180.101-47.078-47.077c11.702-14.072 18.752-32.142 18.752-51.831C162.381 36.423 125.959 0 81.191 0 36.422 0 0 36.423 0 81.193c0 44.767 36.422 81.187 81.191 81.187 19.688 0 37.759-7.049 51.831-18.751l47.079 47.078a7.474 7.474 0 0 0 5.303 2.197 7.498 7.498 0 0 0 5.303-12.803zM15 81.193C15 44.694 44.693 15 81.191 15c36.497 0 66.189 29.694 66.189 66.193 0 36.496-29.692 66.187-66.189 66.187C44.693 147.38 15 117.689 15 81.193z"></path>
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search for a task"
            className="w-full outline-none bg-transparent text-gray-600 text-sm"
            value={filters.search}
            onChange={(e) => handleFilterChange("search", e.target.value)}
          />
        </div>
      </div>

      {/* Filter Components */}
      <CategorySelect
        value={filters.category}
        onChange={(value) => handleFilterChange("category", value)}
      />
      <Location
        value={filters.location}
        onChange={(value) => handleFilterChange("location", value)}
      />

      <PriceRange
        minPrice={filters.minPrice}
        maxPrice={filters.maxPrice}
        onChange={(min, max) => {
          handleFilterChange("minPrice", min);
          handleFilterChange("maxPrice", max);
        }}
      />
      <Sort
        value={filters.sort}
        onChange={(value) => handleFilterChange("sort", value)}
      />
    </div>
  );
};

export default Filter;