import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from 'js-cookie'

export const NocAPI = createApi({
    reducerPath: "NocAPI",
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
        }),
        getNOC: builder.query({
            query: (id) => ({
                url: `/noc/NocProcessListAPI/?employee__id=${id}`,
                method: "GET",
            }),
        }),
        gethrdirNOC: builder.query({
            query: (id) => ({
                url: `/noc/NocProcessListAPI`,
                method: "GET",
            }),
        }),

        getNOCTypes: builder.query({
            query: () => ({
                url: '/noc/NocTypeAPI/',
                method: 'GET'
            })
        }),

        postNOCApply: builder.mutation({
            query: (formData) => ({
                url: '/noc/NocProcessAPI/',
                method: 'POST',
                body: formData,
            })
        }),

        getNocDialogBox: builder.query({
            query: (nocId) => ({
                url: `/noc/NocProcessListAPI/?id__iexact=${nocId}`,
                method: 'GET'
            })
        }),

        getPendingNocApproval: builder.query({
            query: (id) => ({
                url: `/noc/NOCApprovalsAPI/?approving_authority__id=${id}&visible=true`,
                method: 'GET'
            })
        }),
        getHistoryNocApproval: builder.query({
            query: (id) => ({
                url: `/noc/NOCApprovalsAPI/?approving_authority__id=${id}&visible=false`,
                method: 'GET'
            })
        }),

        getNocApprovalById: builder.query({
            query: (id) => ({
                url: `/noc/NocProcessListAPI/?id__iexact=${id}`,
                method: 'GET'
            })
        }),

        putNocApproval: builder.mutation({
            query: ({ formData, id }) => ({
                url: `noc/NOCApprovalsAPI/${id}/`,
                method: 'PUT',
                body: formData,
            })
        }),
        getCurrentDate: builder.query({
            query: () => ({
              url: "/dashboards/current-date/",
              method: 'GET',
            })
          }),


    }),

});

export const {
    useNOCTypeQuery,
    useCreateNOCTypeMutation,
    useUpdateNOCTypeMutation,
    useDeleteNOCTypeMutation,
    useGetNOCQuery,
    useGetNOCTypesQuery,
    usePostNOCApplyMutation,
    useGetNocDialogBoxQuery,
    useGetPendingNocApprovalQuery,
    useGetNocApprovalByIdQuery,
    usePutNocApprovalMutation,
    useGetHistoryNocApprovalQuery,
    useGetCurrentDateQuery,
    useGethrdirNOCQuery
} = NocAPI;
