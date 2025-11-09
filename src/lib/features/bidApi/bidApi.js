import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getTokens } from "@/utils/auth";
import baseUrl from "../../../../utils/baseUrl";

const bidApi = createApi({
  reducerPath: "bidApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${baseUrl()}`,
    prepareHeaders: (headers, { getState }) => {
      const state = getState();
      const accessToken = state?.auth?.accessToken || getTokens().accessToken;
      if (accessToken) {
        headers.set("Authorization", `${accessToken}`);
      }else {
        console.log(" No access token found");
      }
      return headers;
    },
  }),
  tagTypes: ["Bid"],
  endpoints: (builder) => ({
    createBid: builder.mutation({
      query: (bidData) => ({
        url: "/bid/create-bid",
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: bidData,
      }),
      invalidatesTags: ["Bid"],
    }),

    getTaskBids: builder.query({
      query: (taskId) => ({
        url: `/bid/task-bids/${taskId}`,
        method: "GET",
      }),
      providesTags: ["Bid"],
    }),

    acceptBid: builder.mutation({
      query: (bidId) => ({
        url: `/bid/accept-bid/${bidId}`,
        method: "PATCH",
      }),
      invalidatesTags: ["Bid"],
    }),
  }),
});

export const { 
  useCreateBidMutation, 
  useGetTaskBidsQuery, 
  useAcceptBidMutation 
} = bidApi;

export default bidApi;