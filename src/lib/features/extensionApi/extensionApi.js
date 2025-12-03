// extensionApi.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import baseUrl from "../../../../utils/baseUrl";
import { getTokens } from "@/utils/auth";

const extensionApi = createApi({
  reducerPath: "extensionApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${baseUrl()}`,
    prepareHeaders: (headers, { getState }) => {
      const state = getState();
      const accessToken = state?.auth?.accessToken || getTokens().accessToken;
      if (accessToken) {
        headers.set("Authorization", `${accessToken}`);
      } else {
        console.log("No access token found");
      }
      return headers;
    },
  }),
  tagTypes: ["Extension"],
  endpoints: (builder) => ({
    createExtensionRequest: builder.mutation({
      query: (extensionData) => ({
        url: "/extension-request/create",
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: extensionData,
      }),
      invalidatesTags: ["Extension"],
    }),

    getExtensionRequestsByTaskId: builder.query({
      query: (taskId) => ({
        url: `/extension-request/byTask/${taskId}`,
        method: "GET",
      }),
      providesTags: ["Extension"],
    }),

    rejectExtensionRequest: builder.mutation({
      query: ({ requestId, rejectDetails, reject_evidence }) => {
        const formData = new FormData();
        formData.append("status", "REJECTED");
        formData.append("rejectDetails", rejectDetails);

        if (reject_evidence) {
          formData.append("reject_evidence", reject_evidence);
        }

        return {
          url: `/extension-request/accept-reject/${requestId}`,
          method: "PATCH",
          body: formData,
        };
      },
      invalidatesTags: ["Extension"],
    }),

    getExtensionRequestsByTaskId: builder.query({
      query: (taskId) => ({
        url: `/extension-request/byTask/${taskId}`,
        method: "GET",
      }),
      providesTags: ["Extension"],
    }),

    // Accept extension request
    acceptExtensionRequest: builder.mutation({
      query: (requestId) => ({
        url: `/extension-request/accept-reject/${requestId}`,
        method: "PATCH",
        body: {
          status: "ACCEPTED",
        },
      }),
      invalidatesTags: ["Extension"],
    }),
  }),
});

export const {
  useCreateExtensionRequestMutation,
  useGetExtensionRequestsByTaskIdQuery,
  useRejectExtensionRequestMutation,
  useAcceptExtensionRequestMutation
} = extensionApi;

export default extensionApi;
