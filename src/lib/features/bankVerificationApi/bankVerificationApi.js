// src/lib/features/bankVerification/bankVerificationApi.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getTokens } from "@/utils/auth";
import baseUrl from "../../../../utils/baseUrl";

const rawBaseQuery = fetchBaseQuery({
  baseUrl: `${baseUrl()}`,
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const state = getState();
    const accessToken = state?.auth?.accessToken || getTokens().accessToken;
    if (accessToken) {
      headers.set("Authorization", `${accessToken}`);
    }
    return headers;
  },
});

const baseQuery = async (args, api, extraOptions) => {
  let result = await rawBaseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    const cookieRefreshToken = document.cookie
      .split("; ")
      .find((row) => row.startsWith("refreshToken="))
      ?.split("=")[1];

    const { refreshToken: storedRefreshToken } = getTokens();
    const refreshToken = cookieRefreshToken || storedRefreshToken;

    if (!refreshToken) {
      return result;
    }

    try {
      const refreshResult = await rawBaseQuery(
        {
          url: "/auth/refresh-token",
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: { refreshToken },
        },
        api,
        extraOptions
      );

      if (
        refreshResult.data?.success &&
        refreshResult.data?.data?.accessToken
      ) {
        const newAccessToken = refreshResult.data.data.accessToken;

        if (typeof window !== "undefined") {
          localStorage.setItem("accessToken", newAccessToken);
        }

        result = await rawBaseQuery(args, api, extraOptions);
        return result;
      }
    } catch (error) {
      console.error("Token refresh failed:", error);
    }
  }

  return result;
};

const bankVerificationApi = createApi({
  reducerPath: "bankVerificationApi",
  baseQuery,
  tagTypes: ["BankVerification"],
  endpoints: (builder) => ({
    // BVN Verification Endpoint
    verifyBVN: builder.mutation({
      query: (bvnData) => ({
        url: "/provider/verify-bvn",
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: bvnData,
      }),
      invalidatesTags: ["BankVerification"],
      
      // Optional: Response handling
      transformResponse: (response) => {
        if (response.success) {
          return response.data;
        }
        throw new Error(response.message || "BVN verification failed");
      },
      
      // Optional: On successful verification
      async onQueryStarted(bvnData, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          console.log("BVN Verified Successfully:", data);
          
          // You can dispatch any action here if needed
          // For example, update user profile with bank verification status
        } catch (error) {
          console.error("BVN Verification Error:", error);
        }
      },
    }),
  
  }),
});

export const {
  useVerifyBVNMutation,
} = bankVerificationApi;

export default bankVerificationApi;