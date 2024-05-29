import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from 'js-cookie'


export const Authentication = createApi({
    reducerPath: "Authentication",
    baseQuery: fetchBaseQuery({
        baseUrl: "http://127.0.0.1:8000/",
        prepareHeaders: (headers, { getState }) => {
            const csrfToken = Cookies.get("csrftoken");
            const authToken = Cookies.get('authToken');
            if (authToken && csrfToken) {
                headers.set("Authorization", `Token ${authToken}`);
                headers.set("X-CSRFToken", csrfToken);
            }
            headers.set("Content-Type", "application/json");
            return headers;
        },
    }),
    endpoints: (builder) => ({
        login: builder.mutation({
            query: ({ data, csrftoken }) => ({
                url: "/loginApi/",
                method: "POST",
                body: data,
                headers: {
                    "X-CSRFToken": csrftoken,
                },
            }),
        }),
        otp: builder.mutation({
            query: ({ formdata, csrftoken }) => ({
                url: "/otpApi/",
                method: "POST",
                body: formdata,
                headers: {
                    "X-CSRFToken": csrftoken,
                },
            }),

        }),
        logOut: builder.mutation({
            query: (token) => ({
                url: "/loginoutApi/",
                method: "POST",
                headers: {
                    Authorization: `Token ${token}`,
                },
            }),
        }),
    })
});


export const {
    useLoginMutation,
    useOtpMutation,
    useLogOutMutation,
} = Authentication;