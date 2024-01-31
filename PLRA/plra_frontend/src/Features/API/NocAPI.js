import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from 'js-cookie'

export const NocAPI = createApi({
    reducerPath: "NocAPI",
    baseQuery: fetchBaseQuery({
        baseUrl: "http://127.0.0.1:8000/",
        prepareHeaders: (headers) => {
            const authToken = sessionStorage.getItem("authToken");
            const csrfToken = Cookies.get("csrftoken");
            if (authToken && csrfToken) {
                headers.set("Authorization", `Token ${authToken}`);
                headers.set("X-CSRFToken", csrfToken);
            }
            headers.set("Content-Type", "application/json");
            return headers;
        },
    }),
    endpoints: (builder) => ({
        NOCType: builder.query({
            query: () => ({
                url: "/noc/NocTypeAPI/",
                method: "GET",
            }),
        }),
        createNOCType: builder.mutation({
            query: (formData) => ({
                url: "/noc/NocTypeAPI/",
                method: "POST",
                body: formData
            }),
        }),
        updateNOCType: builder.mutation({
            query: ({ ID, NOC_Data }) => ({
                url: `/noc/NocTypeAPI/${ID}/`,
                method: "PUT",
                body: NOC_Data
            }),
        }),
        deleteNOCType: builder.mutation({
            query: (selectRowID) => ({
                url: `/noc/NocTypeAPI/${selectRowID}/`,
                method: "DELETE",
            }),
        })
    })
})


export const {
    useNOCTypeQuery,
    useCreateNOCTypeMutation,
    useUpdateNOCTypeMutation,
    useDeleteNOCTypeMutation,
} = NocAPI;
