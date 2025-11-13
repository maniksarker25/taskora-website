import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getTokens } from "@/utils/auth";
import baseUrl from "../../../../utils/baseUrl";

const questionApi = createApi({
  reducerPath: "questionApi",
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
  tagTypes: ["Question"],
  endpoints: (builder) => ({
    createQuestion: builder.mutation({
      query: (formData) => ({
        url: "/question/create",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Question"],
    }),

    getQuestionsByTaskId: builder.query({
      query: (taskId) => ({
        url: `/question/by-taskID/${taskId}`,
        method: "GET",
      }),
      providesTags: ["Question"],
    }),
  }),
});

export const { 
  useCreateQuestionMutation, 
  useGetQuestionsByTaskIdQuery 
} = questionApi;

export default questionApi;

