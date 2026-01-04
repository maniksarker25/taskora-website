
import { createApi, fetchBaseQuery, retry } from "@reduxjs/toolkit/query/react";
import baseUrl from "../../../../utils/baseUrl";

export const promoApi = createApi({
    reducerPath: "promoApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${baseUrl()}`,
        prepareHeaders: (headers, { getState }) => {
            const state = getState();
            const accessToken = state?.auth?.accessToken || getTokens().accessToken;
            if (accessToken) {
                headers.set("Authorization", `Bearer ${accessToken}`);
            } else {
                console.log("No access token found");
            }
            return headers;
        },
    }),
    tagTypes: ["Promo"],
    endpoints: (builder) => ({


        verifyPromo: builder.mutation({
            query: (data) => {
                console.log("data", data)
                return {
                    url: "/promo/verify-promo",
                    method: "POST",
                    body: data,
                }
            },
        }),
         getPlatformFee: builder.query({
            query: () => ({
                url: "/referralUse/referral-and-platform-charge",
                method: "GET",
            }),
            providesTags: ["Promo"],
        }),

    }),
});

export const {
    useVerifyPromoMutation,
    useGetPlatformFeeQuery,
} = promoApi;

export default promoApi;
