"use client";

import ServiceCard from "@/components/serviceprovider/ServiceCard";
import {
  useGetAllCategoriesQuery,
  useGetDuplicateAllServicesQuery,
} from "@/lib/features/category/categoryApi";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

// Assets
import popularcateIcon from "../../../public/popularcate.svg";
import righArrowIcon from "../../../public/whitearrow.svg";

const PopularService = () => {
  const { data: categoryData, isLoading: isCategoryLoading } = useGetAllCategoriesQuery();

  // State is empty by default, representing "All Categories"
  const [activeCategory, setActiveCategory] = useState("");

  const categories = useMemo(() => categoryData?.data?.result || [], [categoryData]);
  const topCategories = categories.slice(0, 5);

  const queryParams = useMemo(() => {
    const params = {
      limit: 3,
      popular: true,
    };
    if (activeCategory) {
      params.category = activeCategory;
    }
    return params;
  }, [activeCategory]);

  const { data: serviceData, isFetching: isServiceLoading } =
    useGetDuplicateAllServicesQuery(queryParams);

  const services = serviceData?.data?.result || [];

  return (
    <section className="max-w-[1240px] mx-auto px-6 py-20">
      <div className="flex flex-col gap-12">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-teal-50 rounded-lg">
                <Image src={popularcateIcon} alt="" width={22} height={22} />
              </div>
              <span className="text-[#115E59] font-bold tracking-widest text-sm uppercase">
                Services
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Discover Popular Services
            </h2>
          </div>

          <Link
            href="/service-listing"
            className="hidden md:flex items-center gap-3 px-6 py-3 bg-[#115E59] text-white rounded-xl font-medium transition-all hover:bg-[#0d4a46] hover:shadow-lg active:scale-95"
          >
            Explore More
            <Image src={righArrowIcon} alt="" className="w-4" />
          </Link>
        </div>

        {/* Categories Tabs */}
        <div className="flex flex-wrap gap-3">
          {isCategoryLoading ? (
            [...Array(6)].map((_, i) => (
              <div key={i} className="h-10 w-28 bg-gray-100 animate-pulse rounded-full" />
            ))
          ) : (
            <>
              {/* "All" Tab - This is the default state */}
              <button
                onClick={() => setActiveCategory("")}
                className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 border-2 cursor-pointer ${
                  activeCategory === ""
                    ? "bg-[#115E59] border-[#115E59] text-white shadow-md scale-105"
                    : "bg-white border-gray-100 text-gray-600 hover:border-[#115E59] hover:text-[#115E59]"
                }`}
              >
                All Services
              </button>

              {topCategories.map((cat) => (
                <button
                  key={cat._id}
                  onClick={() => setActiveCategory(cat._id)}
                  className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 border-2 cursor-pointer ${
                    activeCategory === cat._id
                      ? "bg-[#115E59] border-[#115E59] text-white shadow-md scale-105"
                      : "bg-white border-gray-100 text-gray-600 hover:border-[#115E59] hover:text-[#115E59]"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </>
          )}
        </div>

        {/* Services Grid */}
        <div className="min-h-[450px]">
          {isServiceLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-gray-50 rounded-2xl p-4 h-[400px] animate-pulse">
                  <div className="bg-gray-200 w-full h-52 rounded-xl mb-6" />
                  <div className="space-y-3">
                    <div className="bg-gray-200 h-6 w-3/4 rounded" />
                    <div className="bg-gray-200 h-4 w-1/2 rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : services.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 animate-in fade-in duration-500">
              {services.map((service) => (
                <Link
                  key={service._id}
                  href={`/service-listing/${service._id}`}
                  className="group transition-transform duration-300 hover:-translate-y-2"
                >
                  <ServiceCard service={service} />
                </Link>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
              <p className="text-gray-500 font-medium">
                No services currently listed in this category.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default PopularService;
