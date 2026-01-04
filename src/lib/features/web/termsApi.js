import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import baseUrl from "../../../../utils/baseUrl";

export const termsApi = createApi({
    reducerPath: "termsApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${baseUrl()}`,
    }),
    tagTypes: ["Terms"],
    endpoints: (builder) => ({
        getTermsConditions: builder.query({
            query: () => ({
                url: "/manage/get-terms-conditions",
                method: "GET",
            }),
            providesTags: ["Terms"],
        }),
    }),
});

export const { useGetTermsConditionsQuery } = termsApi;
export default termsApi;
