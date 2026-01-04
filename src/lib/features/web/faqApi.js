import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import baseUrl from "../../../../utils/baseUrl";

export const faqApi = createApi({
    reducerPath: "faqApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${baseUrl()}`,
    }),
    tagTypes: ["FAQ"],
    endpoints: (builder) => ({
        getFaq: builder.query({
            query: () => ({
                url: "/manage/get-faq",
                method: "GET",
            }),
            providesTags: ["FAQ"],
        }),
    }),
});

export const { useGetFaqQuery } = faqApi;
export default faqApi;
