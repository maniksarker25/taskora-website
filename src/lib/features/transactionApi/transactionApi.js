// lib/features/transaction/transactionApi.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getTokens } from "@/utils/auth";
import baseUrl from "../../../../utils/baseUrl";

export const transactionApi = createApi({
  reducerPath: "transactionApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${baseUrl()}`,
    prepareHeaders: (headers, { getState }) => {
      const state = getState();
      const accessToken = state?.auth?.accessToken || getTokens().accessToken;
      if (accessToken) {
        headers.set("Authorization", `${accessToken}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Transaction"],
  endpoints: (builder) => ({
    getMyTransactions: builder.query({
      query: ({ filterType = "daily", date, week, year, month }) => ({
        url: "/transaction/my-transaction",
        method: "GET",
        params: {
          filterType,
          ...(date && { date }),
          ...(week && { week }),
          ...(year && { year }),
          ...(month && { month }),
        },
      }),
      providesTags: ["Transaction"],
    }),
    getProviderTransactions: builder.query({
      query: ({ type = "daily", date, week, year, month }) => ({
        url: "/payment/provider-earnings",
        method: "GET",
        params: {
          type,
          ...(date && { date }),
          ...(week && { week }),
          ...(year && { year }),
          ...(month && { month }),
        },
      }),
      providesTags: ["Transaction"],
    }),
  }),
});

export const { useGetMyTransactionsQuery, useGetProviderTransactionsQuery } = transactionApi;