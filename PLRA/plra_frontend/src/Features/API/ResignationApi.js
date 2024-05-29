import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from 'js-cookie'
 
export const ResignationApi = createApi({
    reducerPath: "ResignationApi",
    baseQuery: fetchBaseQuery({
        baseUrl: "http://127.0.0.1:8000/",
        prepareHeaders: (headers) => {
            const authToken = Cookies.get("authToken");
            const csrfToken = Cookies.get("csrftoken");
            if (authToken && csrfToken) {
                headers.set("Authorization", `Token ${authToken}`);
                headers.set("X-CSRFToken", csrfToken);
            }
            return headers;
        },
    }),
    endpoints: (builder) => ({
        AllResignation: builder.query({
            query: (user_id) => ({
                url: `resignation/ResignationRequestListAPI/?employee__id=${user_id}`,
                method: "GET",
            }),
        }),
        AllhrdirResignation: builder.query({
            query: (user_id) => ({
                url: `resignation/ResignationRequestListAPI`,
                method: "GET",
            }),
        }),
        AllResignationById: builder.query({
            query: (id) => ({
                url: `resignation/ResignationRequestListAPI/${id}`,
                method: "GET",
            }),
        }),
        createResignation: builder.mutation({
            query: (formData) => ({
                url: "resignation/ResignationRequestAPI/",
                method: "POST",
                body: formData
            }),
        }),
        ResignationPendingApproval: builder.query({
            query: (id) => ({
                url: `resignation/ResignationApprovalsAPI/?approving_authority__id=${id}&visible=true`,
                method: "GET",
            }),
        }),
        ResignationHistoryApproval: builder.query({
            query: (id) => ({
                url: `resignation/ResignationApprovalsAPI/?approving_authority__id=${id}&visible=false&status__contains=r`,
                method: "GET",
            }),
        }),
        ResignationApprovalsPut: builder.mutation({
            query: ({ formData, id }) => ({
                url: `resignation/ResignationApprovalsAPI/${id}/`,
                method: 'PUT',
                body: formData
            })
        }),
    })
})
 
 
export const {
    useCreateResignationMutation,
    useAllResignationQuery,
    useAllResignationByIdQuery,
    useResignationApprovalsPutMutation,
    useResignationPendingApprovalQuery,
    useResignationHistoryApprovalQuery,
    useAllhrdirResignationQuery
} = ResignationApi;
