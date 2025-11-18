import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getTokens } from "@/utils/auth";
import baseUrl from "../../../../utils/baseUrl";


const providerServiceApi = createApi({
  reducerPath: "serviceApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${baseUrl()}`,
    prepareHeaders: (headers, { getState }) => {
      const state = getState();
      const accessToken = state?.auth?.accessToken || getTokens().accessToken;
      if (accessToken) {
        headers.set("Authorization", `${accessToken}`);
      } else {
        console.log(" No access token found");
      }
      return headers;
    },
  }),
  tagTypes: ["Servicee"],
  endpoints: (builder) => ({
  createService: builder.mutation({
  query: (formData) => {
    console.log("Form Data From API Layer:", formData); // ✅ এখানে লগ করবে

    return {
      url: "/service/create-service",
      method: "POST",
      body: formData
    };
  },
  invalidatesTags: ["Servicee"],
}),

  }),
});

export const { 
  useCreateServiceMutation
} = providerServiceApi;

export default providerServiceApi;