"use client"
import GoogleMap from "@/components/browseservice/GoogleMap";
import React, { useContext } from "react";
import FilterContext from "@/context/FilterContext";

const BrowseService = () => {
  const filters = useContext(FilterContext);

  return (
    <div className="w-full h-96 md:h-[800px] ">
      <GoogleMap filters={filters || {}} />
    </div>
  );
};

export default BrowseService;
