import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getTokens } from "@/utils/auth";
import baseUrl from "../../../../utils/baseUrl";

const notificationApi = createApi({
  reducerPath: "notificationApi",
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
  tagTypes: ["Notification"],
  endpoints: (builder) => ({
    getNotifications: builder.query({
      query: ({ page = 1, limit = 10 } = {}) => ({
        url: "/notification/get-notifications",
        method: "GET",
        params: { page, limit },
      }),
      providesTags: ["Notification"],
    }),

    markNotificationAsSeen: builder.mutation({
      query: (notificationId) => ({
        url: "/notification/see-notifications",
        method: "PATCH",
        body: { notificationId }, 
      }),
      invalidatesTags: ["Notification"],
    }),
  }),
});

export const { 
  useGetNotificationsQuery,
  useMarkNotificationAsSeenMutation
} = notificationApi;

export default notificationApi;