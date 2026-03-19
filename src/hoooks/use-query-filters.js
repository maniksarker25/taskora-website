// hooks/use-query-filters.js
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

export const useQueryFilters = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const setFilters = useCallback(
    (newFilters) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(newFilters).forEach(([key, value]) => {
        if (value) params.set(key, value);
        else params.delete(key);
      });
      router.push(`?${params.toString()}`, { scroll: false });
    },
    [searchParams, router]
  );

  const filters = {
    search: searchParams.get("search") || "",
    category: searchParams.get("category") || "",
    location: searchParams.get("location") || "",
    minPrice: searchParams.get("minPrice") || "",
    maxPrice: searchParams.get("maxPrice") || "",
    sort: searchParams.get("sort") || "",
  };

  return { filters, setFilters };
};
