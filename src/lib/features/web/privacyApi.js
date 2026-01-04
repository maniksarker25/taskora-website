import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import baseUrl from "../../../../utils/baseUrl";

export const privacyApi = createApi({
    reducerPath: "privacyApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${baseUrl()}`,
    }),
    tagTypes: ["Privacy"],
    endpoints: (builder) => ({
        getPrivacyPolicy: builder.query({
            query: () => ({
                url: "/manage/get-privacy-policy",
                method: "GET",
            }),
            providesTags: ["Privacy"],
        }),
    }),
});

export const { useGetPrivacyPolicyQuery } = privacyApi;
export default privacyApi;
