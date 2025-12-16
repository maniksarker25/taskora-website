"use client"

import React, { useState } from "react";
import "../globals.css";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import Filter from "@/components/browseservice/Filter";
import AllServicePage from "@/components/browseservice/AllServicePage";
import { Toaster } from "sonner";
import FilterContext from "@/context/FilterContext";

const BrowseServiceLayout = ({ children }) => {
  const [filters, setFilters] = useState({});

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  return (
    <>
      <Navbar />
      <div className="mb-44">
        <div className="project_container p-4">
          <Filter onFilterChange={handleFilterChange} />
        </div>
        <div className="project_container flex flex-col md:flex-row gap-8 pr-2">
          <div>
            <AllServicePage filters={filters} />
          </div>
          <div className="w-full pl-2">
            <FilterContext.Provider value={filters}>
              {children}
            </FilterContext.Provider>
          </div>
          <Toaster
            position="top-right"
            expand={true}
            richColors
          />
        </div>
      </div>
      <Footer />
    </>
  );
};

export default BrowseServiceLayout;