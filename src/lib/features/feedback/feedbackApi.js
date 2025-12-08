import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getTokens } from "@/utils/auth";
import baseUrl from "../../../../utils/baseUrl";

const feedbackApi = createApi({
  reducerPath: "feedbackApi",
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
  tagTypes: ["Feedback"],
  endpoints: (builder) => ({
    // Create feedback
    createFeedback: builder.mutation({
      query: (feedbackData) => ({
        url: "/feedback/create-feedback",
        method: "POST",
        body: feedbackData,
      }),
      invalidatesTags: ["Feedback"],
    }),

    // Get feedback by task ID
   getTaskFeedback: builder.mutation({
      query: (taskId) => ({
        url: "/feedback/task-feedback",
        method: "GET",
        body: { taskId }, // GET request এর সাথে body
      }),
    }),

      getMyFeedback: builder.query({
      query: () => ({
        url: "/feedback/my-feedback",
        method: "GET",
      }),
      providesTags: ["Feedback"],
    }),
  }),
});

export const { 
  useCreateFeedbackMutation,
  useGetTaskFeedbackMutation,
  useGetMyFeedbackQuery
} = feedbackApi;

export default feedbackApi;