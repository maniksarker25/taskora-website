"use client";

import Image from "next/image";
import popularcateIcon from "../../../public/popularcate.svg";
import { useState, useEffect } from "react";
import Link from "next/link";
import righArrowIcon from "../../../public/whitearrow.svg";
import { useGetAllCategoriesQuery, useGetDuplicateAllServicesQuery } from "@/lib/features/category/categoryApi";
import ServiceCard from "@/components/serviceprovider/ServiceCard";

const PopularService = () => {
  const [activeCategory, setActiveCategory] = useState("");

  // Fetch Categories
  const { data: categoryData, isLoading: isCategoryLoading } = useGetAllCategoriesQuery();
  const categories = categoryData?.data?.result || [];
  const topCategories = categories.slice(0, 5);

  // Set initial active category
  useEffect(() => {
    if (topCategories.length > 0 && !activeCategory) {
      setActiveCategory(topCategories[0]._id);
    }
  }, [topCategories, activeCategory]);

  // Fetch Services for Active Category
  const { data: serviceData, isLoading: isServiceLoading } = useGetDuplicateAllServicesQuery(
    {
      category: activeCategory,
      limit: 3,
      popular: true
    },
    { skip: !activeCategory }
  );

  const services = serviceData?.data?.result || [];

  return (
    <section className="max-w-[1240px] mx-auto px-4">
      <div className="flex flex-col gap-16">
        <div className="mt-16 md:mt-44 flex flex-col gap-5 md:flex-row justify-between md:items-center">
          {/* top header */}
          <div>
            <div className="flex items-center gap-4 ">
              <Image
                src={popularcateIcon}
                alt="Popular Category "
                height={24}
              />
              <p className="font-semibold text-md md:text-xl text-color pb-3">
                SERVICES
              </p>
            </div>
            <h3 className="font-semibold text-2xl md:text-4xl flex flex-col gap-6">
              Popular Service
            </h3>
          </div>

          {/* Cards */}
        </div>

        <div className="">
          {/* Tabs */}
          <div className="flex flex-wrap gap-3 mb-8">
            {isCategoryLoading
              ? [...Array(5)].map((_, i) => (
                <div key={i} className="h-10 w-24 bg-gray-200 rounded-md animate-pulse" />
              ))
              : topCategories.map((cat) => (
                <button
                  key={cat._id}
                  onClick={() => setActiveCategory(cat._id)}
                  className={`px-6 py-2 rounded-md text-sm font-medium transition cursor-pointer ${activeCategory === cat._id
                    ? "bg-[#115e59] text-white"
                    : "bg-[#e6f4f1]  hover:bg-brand_color"
                    }`}
                >
                  {cat.name}
                </button>
              ))}
          </div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {isServiceLoading ? (
              // Loading Skeletons
              [...Array(3)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl shadow-sm p-4 h-96 animate-pulse">
                  <div className="bg-gray-200 w-full h-48 rounded-lg mb-4" />
                  <div className="bg-gray-200 h-6 w-3/4 mb-2" />
                  <div className="bg-gray-200 h-4 w-1/2" />
                </div>
              ))
            ) : services.length > 0 ? (
              services.map((service) => (
                <Link key={service._id} href={`/service-listing/${service._id}`}>
                  <ServiceCard service={service} />
                </Link>
              ))
            ) : (
              <div className="col-span-full py-10 text-center text-gray-500">
                No services found in this category.
              </div>
            )}
          </div>
        </div>
        <div className="flex">
          <Link
            href="/service-listing"
            className="px-4 py-3 md:px-6 md:py-4 md:text-xl font-semibold bg-[#115e59] text-white rounded-sm hover:bg-teal-800 transition transform duration-300 hover:scale-105 flex items-center justify-center gap-3"
          >
            Explore More
            <Image
              src={righArrowIcon}
              alt="Popular Category"
              className="w-3 md:w-4"
            />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default PopularService;
