"use client";
import { useState } from "react";
import { Search, MapPin, Star, ChevronDown, ChevronUp } from "lucide-react";
import FilterSection from "@/components/serviceprovider/FilterSection";
import CheckboxFilter from "@/components/serviceprovider/CheckboxFilter";

import ai from "../../../../public/ai.png";
import ServiceCard from "@/components/serviceprovider/ServiceCard";
import Link from "next/link";

const ServiceListing = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState(["cleaning"]);
  const [selectedSortBy, setSelectedSortBy] = useState("relevance");
  const [categoryFilterOpen, setCategoryFilterOpen] = useState(true);
  const [sortByOpen, setSortByOpen] = useState(false);

  const serviceCategories = [
    { id: "cleaning", label: "Cleaning" },
    { id: "plumbing", label: "Plumbing" },
    { id: "electrical", label: "Electrical" },
    { id: "appliance-repair", label: "Appliance Repair" },
    { id: "furniture-assembly", label: "Furniture Assembly" },
    { id: "painting", label: "Painting" },
    { id: "moving-help", label: "Moving Help" },
    { id: "ac-installation", label: "AC Installation" },
  ];

  const sortOptions = [
    { id: "relevance", label: "Relevance" },
    { id: "price-low", label: "Price: Low to High" },
    { id: "price-high", label: "Price: High to Low" },
    { id: "rating", label: "Highest Rated" },
    { id: "newest", label: "Newest First" },
  ];

  const services = [
    {
      id: 1,
      title: "Office Cleaning Service",
      category: "Cleaning",
      location: "New York, USA",
      rating: 4.5,
      image: { ai },
      price: null,
    },
    {
      id: 2,
      title: "Office Cleaning Service",
      category: "Cleaning",
      location: "New York, USA",
      rating: 4.5,
      image: { ai },
      price: null,
    },
    {
      id: 3,
      title: "Window Washing (3 BHK)",
      category: "Cleaning",
      location: "New York, USA",
      rating: 4.5,
      image: { ai },
      price: null,
    },
    {
      id: 4,
      title: "Window Washing (3 BHK)",
      category: "Cleaning",
      location: "New York, USA",
      rating: 4.5,
      image: { ai },
      price: null,
    },
  ];

  const handleCategoryChange = (categoryId) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleSortChange = (sortId) => {
    setSelectedSortBy(sortId);
  };

  const filteredServices = services.filter((service) => {
    const matchesSearch =
      service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategories.length === 0 ||
      selectedCategories.includes(
        service.category.toLowerCase().replace(" ", "-")
      );
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="project_container mx-auto px-6 py-8">
        {/* Main Content */}
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <div className="col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 hidden lg:block">
              {/* Service Category Filter */}
              <div>
                <FilterSection
                  title="Select Service Category"
                  isOpen={categoryFilterOpen}
                  onToggle={() => setCategoryFilterOpen(!categoryFilterOpen)}
                >
                  <CheckboxFilter
                    options={serviceCategories}
                    selectedOptions={selectedCategories}
                    onChange={handleCategoryChange}
                  />
                </FilterSection>
              </div>
              {/* Sort By Filter */}
              <div>
                <FilterSection
                  title="Sort By"
                  isOpen={sortByOpen}
                  onToggle={() => setSortByOpen(!sortByOpen)}
                >
                  <div className="space-y-2">
                    {sortOptions.map((option) => (
                      <label
                        key={option.id}
                        className="flex items-center gap-3 cursor-pointer"
                      >
                        <input
                          type="radio"
                          name="sortBy"
                          value={option.id}
                          checked={selectedSortBy === option.id}
                          onChange={() => handleSortChange(option.id)}
                          className="w-4 h-4 text-green-600 border-gray-300 focus:ring-green-500"
                        />
                        <span className="text-gray-700">{option.label}</span>
                      </label>
                    ))}
                  </div>
                </FilterSection>
              </div>
            </div>
          </div>

          {/* Services Grid */}
          <div className="col-span-3">
            {/* Search Bar */}
            <div className="mb-8">
              <div className="relative mx-auto">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search your service"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>
            {/* Services Grid */}
            {filteredServices.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredServices.map((service) => (
                  <Link key={service.id} href='/servicedetails'><ServiceCard  service={service} /></Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <Search className="w-16 h-16 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No services found
                </h3>
                <p className="text-gray-500">
                  Try adjusting your search or filter criteria
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceListing;
