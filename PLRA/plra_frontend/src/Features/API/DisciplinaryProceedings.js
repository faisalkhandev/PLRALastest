import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from 'js-cookie'
 
export const DisciplinaryProceedingApi = createApi({
    reducerPath: "DisciplinaryProceedingApi",
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
        DisciplinaryProceedingApi: builder.query({
            query: (id) => ({
                url: `desiplinary-preceeding/DisciplinaryProceedingInquiryAPI/${id}`,
                method: "GET",
            }),
        }),
        InquiryOutcomesApi: builder.query({
            query: () => ({
                url: `desiplinary-preceeding/InquiryOutcomesAPI`,
                method: "GET",
            }),
        }),
        InquiryTypeApi: builder.query({
            query: (inquiry_id) => ({
                url: `desiplinary-preceeding/InquiryTypeAPI/?inquiryoutcomes__id=${inquiry_id}`,
                method: "GET",
            }),
        }),
        InquiryTypeApiById: builder.query({
            query: (type_id) => ({
                url: `desiplinary-preceeding/InquiryTypeAPI/?id=${type_id}`,
                method: "GET",
            }),
        }),

        AllProbeOfficerPendingApproval: builder.query({
            query: (user_id) => ({
                url: `desiplinary-preceeding/probeofficerapproval/?approving_authority__id=${user_id}&visible=true`,
                method: "GET",
            }),
        }),
        AllProbeOfficerHistoryApproval: builder.query({
            query: (user_id) => ({
                url: `desiplinary-preceeding/probeofficerapproval/?approving_authority__id=${user_id}&visible=false`,
                method: "GET",
            }),
        }),
        ProbeOfficerApprovalsPut: builder.mutation({
            query: ({ formData, id }) => ({
                url: `desiplinary-preceeding/probeofficerapproval/${id}/`,
                method: 'PUT',
                body: formData
            })
        }),

        AllDGFirstPendingApproval: builder.query({
            query: (user_id) => ({
                url: `desiplinary-preceeding/dgfirstapproval/?approving_authority__id=${user_id}&visible=true`,
                method: "GET",
            }),
        }),
        AllDGFirstHistoryApproval: builder.query({
            query: (user_id) => ({
                url: `desiplinary-preceeding/dgfirstapproval/?approving_authority__id=${user_id}&visible=false`,
                method: "GET",
            }),
        }),
        DGFirstApprovalsPut: builder.mutation({
            query: ({ formData, id }) => ({
                url: `desiplinary-preceeding/dgfirstapproval/${id}/`,
                method: 'PUT',
                body: formData
            })
        }),

        AllHRUserPendingApproval: builder.query({
            query: (user_id) => ({
                url: `desiplinary-preceeding/hruserapproval/?approving_authority__id=${user_id}&visible=true`,
                method: "GET",
            }),
        }),
        AllHRUserHistoryApproval: builder.query({
            query: (user_id) => ({
                url: `desiplinary-preceeding/hruserapproval/?approving_authority__id=${user_id}&visible=false`,
                method: "GET",
            }),
        }),
        HRUserApprovalsPut: builder.mutation({
            query: ({ formData, id }) => ({
                url: `desiplinary-preceeding/hruserapproval/${id}/`,
                method: 'PUT',
                body: formData
            })
        }),

        AllRegularInquiryOfficerPendingApproval: builder.query({
            query: (user_id) => ({
                url: `desiplinary-preceeding/regularinquiryofficerapproval/?approving_authority__id=${user_id}&visible=true`,
                method: "GET",
            }),
        }),
        AllRegularInquiryOfficerHistoryApproval: builder.query({
            query: (user_id) => ({
                url: `desiplinary-preceeding/regularinquiryofficerapproval/?approving_authority__id=${user_id}&visible=false`,
                method: "GET",
            }),
        }),
        RegularInquiryOfficerApprovalsPut: builder.mutation({
            query: ({ formData, id }) => ({
                url: `desiplinary-preceeding/regularinquiryofficerapproval/${id}/`,
                method: 'PUT',
                body: formData
            })
        }),

        AllDirHRPendingApproval: builder.query({
            query: (user_id) => ({
                url: `desiplinary-preceeding/directorhrapproval/?approving_authority__id=${user_id}&visible=true`,
                method: "GET",
            }),
        }),
        AllDirHRrHistoryApproval: builder.query({
            query: (user_id) => ({
                url: `desiplinary-preceeding/directorhrapproval/?approving_authority__id=${user_id}&visible=false`,
                method: "GET",
            }),
        }),
        DirHRApprovalsPut: builder.mutation({
            query: ({ formData, id }) => ({
                url: `desiplinary-preceeding/directorhrapproval/${id}/`,
                method: 'PUT',
                body: formData
            })
        }),

        AllDGFinalPendingApproval: builder.query({
            query: (user_id) => ({
                url: `desiplinary-preceeding/dgfinalapproval/?approving_authority__id=${user_id}&visible=true`,
                method: "GET",
            }),
        }),
        AllDGFinalrHistoryApproval: builder.query({
            query: (user_id) => ({
                url: `desiplinary-preceeding/dgfinalapproval/?approving_authority__id=${user_id}&visible=false`,
                method: "GET",
            }),
        }),
        DGFinalApprovalsPut: builder.mutation({
            query: ({ formData, id }) => ({
                url: `desiplinary-preceeding/dgfinalapproval/${id}/`,
                method: 'PUT',
                body: formData
            })
        }),
        postDisciplinaryProceedingInquiry :builder.mutation({
            query: (selectedEmployee) => ({
                url: "desiplinary-preceeding/DisciplinaryProceedingInquiryAPI/",
                method: "POST",
                body: selectedEmployee,
              }),
            }),
        getDisciplinaryProceedingInquiry :builder.query({
            query: () => ({
                url: "desiplinary-preceeding/DisciplinaryProceedingInquiryAPI/",
                method: "GET",
            }),
        })
    })
})
 
 
export const {
    useAllProbeOfficerHistoryApprovalQuery,
    useAllProbeOfficerPendingApprovalQuery,
    useDisciplinaryProceedingApiQuery,
    useProbeOfficerApprovalsPutMutation,
    useAllDGFirstHistoryApprovalQuery,
    useAllDGFirstPendingApprovalQuery,
    useDGFirstApprovalsPutMutation,
    useAllHRUserHistoryApprovalQuery,
    useAllHRUserPendingApprovalQuery,
    useHRUserApprovalsPutMutation,
    useAllRegularInquiryOfficerHistoryApprovalQuery,
    useAllRegularInquiryOfficerPendingApprovalQuery,
    useRegularInquiryOfficerApprovalsPutMutation,
    useAllDirHRPendingApprovalQuery,
    useAllDirHRrHistoryApprovalQuery,
    useDirHRApprovalsPutMutation,
    useInquiryOutcomesApiQuery,
    useInquiryTypeApiQuery,
    useInquiryTypeApiByIdQuery,
    useAllDGFinalPendingApprovalQuery,
    useAllDGFinalrHistoryApprovalQuery,
    useDGFinalApprovalsPutMutation,usePostDisciplinaryProceedingInquiryMutation,useGetDisciplinaryProceedingInquiryQuery
} = DisciplinaryProceedingApi;
