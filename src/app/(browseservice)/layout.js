import React from "react";
import "../globals.css";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import Filter from "@/components/browseservice/Filter";
import AllServicePage from "@/components/browseservice/AllServicePage";

const BrowseServiceLayout = ({ children }) => {
  return (
    <>
      <Navbar />
      <div className="mb-44">
        <div className="project_container p-4">
          <Filter />
        </div>
        <div className="project_container flex flex-col md:flex-row gap-8 pr-2">
          <div>
            <AllServicePage />
          </div>
          <div className="w-full pl-2">{children}</div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default BrowseServiceLayout;