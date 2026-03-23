"use client";

import AllServicePage from "@/components/browseservice/AllServicePage";
import Filter from "@/components/browseservice/Filter";
import Footer from "@/components/ui/Footer";
import Navbar from "@/components/ui/Navbar";
import FilterContext from "@/context/FilterContext";
import { useState } from "react";
import { Toaster } from "sonner";
import "../globals.css";

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
        <div className="project_container flex flex-col md:flex-row gap-8 pr-2 ">
          <div className="w-1/3 mr-12">
            <AllServicePage filters={filters} />
          </div>
          <div className="w-2/3 pl-2">
            <FilterContext.Provider value={filters}>{children}</FilterContext.Provider>
          </div>
          <Toaster position="top-right" expand={true} richColors />
        </div>
      </div>
      <Footer />
    </>
  );
};

export default BrowseServiceLayout;
