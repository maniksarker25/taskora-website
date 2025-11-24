import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import baseUrl from "../../../../utils/baseUrl";

const categoryApi = createApi({
  reducerPath: "categoryApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${baseUrl()}`,
  }),
  tagTypes: ["Category"],
  endpoints: (builder) => ({
    getAllCategories: builder.query({
      query: () => ({
        url: "/category/all-categories",
        method: "GET",
      }),
      providesTags: ["Category"],
    }),

    getDuplicateAllServices: builder.query({
      query: (params = {}) => {
        const {
          page = 1,
          limit = 10,
          searchTerm = "",
          category = "",
          sortBy = "",
        } = params;

        const queryParams = new URLSearchParams();
        queryParams.append("page", page);
        queryParams.append("limit", limit);
        if (searchTerm) queryParams.append("searchTerm", searchTerm);
        if (category) queryParams.append("category", category);
        if (sortBy) queryParams.append("sortBy", sortBy);

        return {
          url: `/service/all-service?${queryParams.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["Service"],
      // Fix cache behavior
      serializeQueryArgs: ({ endpointName }) => {
        return endpointName;
      },
      // Always refetch when arguments change
      forceRefetch: ({ currentArg, previousArg }) => {
        return JSON.stringify(currentArg) !== JSON.stringify(previousArg);
      },
    }),
  }),
});

export const { useGetAllCategoriesQuery, useGetDuplicateAllServicesQuery } =
  categoryApi;

export default categoryApi;
