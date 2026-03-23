import {
  useGetAllCategoriesQuery,
  useGetDuplicateAllServicesQuery,
} from "@/lib/features/category/categoryApi";
import { useEffect, useMemo, useState } from "react";

export const useServiceListing = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  // Debounce Logic
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1);
    }, 400);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  const { data: servicesData, isLoading: sLoading } = useGetDuplicateAllServicesQuery({
    page: currentPage,
    searchTerm: debouncedSearch,
    category: selectedCategory !== "all" ? selectedCategory : "",
  });

  const { data: categoriesData, isLoading: cLoading } = useGetAllCategoriesQuery();

  const services = useMemo(
    () => (servicesData?.data?.result || []).filter((s) => s.isActive),
    [servicesData]
  );

  const categories = useMemo(() => {
    const base = [{ id: "all", label: "All Services" }];
    if (!categoriesData?.data?.result) return base;
    return [...base, ...categoriesData.data.result.map((c) => ({ id: c._id, label: c.name }))];
  }, [categoriesData]);

  return {
    states: {
      searchQuery,
      selectedCategory,
      currentPage,
      services,
      meta: servicesData?.data?.meta || {},
      isLoading: sLoading || cLoading,
      categories,
    },
    handlers: {
      setSearchQuery,
      handleCategoryChange: (id) => {
        setSelectedCategory(id);
        setCurrentPage(1);
      },
      handlePageChange: (page) => setCurrentPage(page),
    },
  };
};
