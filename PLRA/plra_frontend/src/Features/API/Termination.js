import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from 'js-cookie'

export const Termination = createApi({
    reducerPath: "Termination",
    baseQuery: fetchBaseQuery({
        baseUrl: "http://127.0.0.1:8000/",
        prepareHeaders: (headers, { getState }) => {
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
        //getUserByID
        getUserById: builder.query({
            query: (empId) => ({
                url: `basic-info/User/${empId}`,
                method: 'GET'
            }),
        }),

        // GetEmployee By ID For Termination
        getEmployeeByID: builder.query({
            query: (id) => ({
              url: `/basic-info/User/${id}/`,
              method: "GET",
            }),
          }),

        //postTermination
        postTermination: (builder).mutation({
            query: (formData) => ({
                url: '/termination/TerminationRequestAPI/',
                method: 'POST',
                body: formData
            }),
        }),

        //getTermination
        getTermination: (builder).query({
            query: () => ({
                url: '/termination/TerminationRequestListAPI/',
                method: 'GET',
            })
        }),

        //History&PendingTermination
        getHistoryTermination: (builder).query({
            query: (id) => ({
                url: `/termination/TerminationApprovalsAPI/?approving_authority__id=${id}&visible=false&status__contains=r`,
                method: 'GET'
            })
        }),
        getPendingTermination: (builder).query({
            query: (id) => ({
                url: `/termination/TerminationApprovalsAPI/?approving_authority__id=${id}&visible=true`,
                method: 'GET'
            })
        }),

        //TerminationApproval
        getTerminationApproval: (builder).query({
            query: (terminationId) => ({
                url: `termination/TerminationRequestListAPI/?id__iexact=${terminationId}`,
                method: 'GET'
            })
        }),
        approvalsPutTermination: builder.mutation({
            query: ({ formData, id }) => ({
                url: `termination/TerminationApprovalsAPI/${id}/`,
                method: 'PUT',
                body: formData
            })
        }),
        getUserById2: builder.query({
            query: (empId) => ({
                url: `basic-info/User/${empId}`,
                method: 'GET'
            }),
        }),

    })
});

export const {
    useGetUserByIdQuery,
    usePostTerminationMutation,
    useGetTerminationQuery,
    useGetHistoryTerminationQuery,
    useGetPendingTerminationQuery,
    useGetTerminationApprovalQuery,
    useApprovalsPutTerminationMutation,
    useGetEmployeeByIDQuery,
    useGetResigantionDataQuery,

} = Termination;
