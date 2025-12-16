"use client"
import GoogleMap from "@/components/browseservice/GoogleMap";
import React, { useState } from "react";
import Filter from "@/components/browseservice/Filter";
import AllServicePage from "@/components/browseservice/AllServicePage";

const BrowseService = () => {
  const [filters, setFilters] = useState({
    search: "",
    category: "",
    location: "",
    minPrice: "",
    maxPrice: "",
    sort: ""
  });

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  return (
    <div >
      {/* filter head */}
      <Filter onFilterChange={handleFilterChange} />

      {/* card and map */}
      <div className="flex flex-col md:flex-row gap-8">
        <AllServicePage filters={filters} />

        <div className="w-full h-96 md:h-[800px] ">
          <GoogleMap filters={filters} />
        </div>
      </div>
    </div>
  );
};

export default BrowseService;
