import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from 'js-cookie'

export const SetupApi = createApi({
    reducerPath: "SetupApi",
    baseQuery: fetchBaseQuery({
        baseUrl: "http://127.0.0.1:8000/",
        prepareHeaders: (headers, { getState }) => {
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
        // Get All Leave Types
        LeaveType: builder.query({
            query: () => ({
                url: "/leave/LeaveTypeAPI/",
                method: "GET",
            }),
        }),
        // Post Leave Types
        PostLeaveType: builder.mutation({
            query: (Leave_Type_Data) => ({
                url: "/leave/LeaveTypeAPI/",
                method: "POST",
                body: Leave_Type_Data
            }),
        }),

        // Delete LeaveTypes
        DeleteLeaveType: builder.mutation({
            query: (isRowSelectedID) => ({
                url: `/leave/LeaveTypeAPI/${isRowSelectedID}/`,
                method: 'DELETE',
            })
        }),

        // Update LeaveTypes
        updateLeaveType: builder.mutation({
            query: ({ isRowSelectedID, Leave_Type_Data }) => ({
                url: `/leave/LeaveTypeAPI/${isRowSelectedID}/`,
                method: 'PUT',
                body: Leave_Type_Data,
            }),
        }),


        // Salary Detactible  
        SalaryDeductible_LeaveType: builder.query({
            query: () => ({
                url: "/leave/LeaveTypeAPI/?salary_deduction_eligibility_rule=true",
                method: "GET",
            }),
        }),

        //GetLeaveDependableDetails
        getLeaveDependableDetailAPI: builder.query({
            query: () => ({
                url: "/leave/LeaveDependencyAPI/",
                method: 'GET',
            })
        }),

        //posGetLeaveDependable
        postLeaveDependableDetails: builder.mutation({
            query: (formData) => ({
                url: '/leave/LeaveDependencyAPI/',
                method: 'POST',
                body: formData,
            })
        }),

        deleteLeaveDependableDetails: builder.mutation({
            query: (isRowSelectedID) => ({
                url: `/leave/LeaveDependencyAPI/${isRowSelectedID}/`,
                method: 'DELETE',

            })
        }),
        updateLeaveDependableDetails: builder.mutation({
            query: ({ id, formData }) => ({
                url: `/leave/LeaveDependencyAPI/${id}/`,
                method: "PUT",
                body: formData
            }),
        }),




        GetSalaryDeductible: builder.query({
            query: () => ({
                url: "/leave/SalaryDeductibleAPI/",
                method: "GET",
            }),
        }),
        GetSalaryDeductiblee: builder.query({
            query: () => ({
                url: "basic-info/ppglevelsetup/",
                method: "GET",
            }),
        }),
        SalaryDeductibleType: builder.mutation({
            query: (formData) => ({
                url: "/leave/SalaryDeductibleAPI/",
                method: "POST",
                body: formData
            }),
        }),
        updateSalaryDeductibleType: builder.mutation({
            query: ({ ID, updatedata }) => ({
                url: `/leave/SalaryDeductibleAPI/${ID}/`,
                method: "PUT",
                body: updatedata
            }),
        }),
        deleteSalaryDeductibleType: builder.mutation({
            query: (ID) => ({
                url: `/leave/SalaryDeductibleAPI/${ID}/`,
                method: "DELETE",
            }),
        }),

        //Leave Adjustable Dependency
        adjustableDependecy_leaveDependency_true: builder.query({
            query: () => ({
                url: "/leave/LeaveTypeAPI/?leave_dependency=true",
                method: "GET",
            }),
        }),
        Approvals: builder.query({
            query: (user_id) => ({
                url: `/leave/approvals/?approving_authority__id=${user_id}&visible=true`,
                // url: `/leave/approvals/?approving_authority__id=7&visible=true`,
                method: "GET",
            }),
        }),

        ApprovalsHistory: builder.query({
            query: (user_id) => ({
                url: `/leave/approvals/?approving_authority__id=${user_id}&visible=false`,
                method: 'GET'
            })
        }),
        SuperApprovalsHistory: builder.query({
            query: (user_id) => ({
                url: `/leave/super-approvals/?approving_authority__id=${user_id}&visible=false`,
                method: 'GET'
            })
        }),


        leaveApplyData: builder.query({
            query: () => ({
                url: `leave/LeaveApplyAPI/`,
                method: "GET",
            }),
        }),
        approvalsById: builder.query({
            query: (leave_request_id) => ({
                // url: `/leave/LeaveListApi/?leave_request_id=${leave_request_id}`,
                url: `/leave/LeaveListApi/?leave_request_id=1`,
                method: "GET",
            }),
        }),

        //Leave Apply APi
        postLeaveApply: builder.mutation({
            query: (formData) => ({
                url: '/leave/LeaveApplyAPI/',
                method: 'POST',
                body: formData
            })
        }),

        //LeaveAPIList
        getLeaveListApi: builder.query({
            query: () => ({
                url: '/leave/LeaveListApi/',
                method: 'GET'
            })
        }),

        //Leave Apply APi
        approvalsPut: builder.mutation({
            query: ({ formData, id }) => ({
                url: `leave/super-approvals/${id}/`,
                method: 'PUT',
                body: formData
            })
        }),
        //superApproval
        getSuperApprovalApi: builder.query({
            query: (user_id) => ({
                url: `/leave/super-approvals/?approving_authority__id=${user_id}&visible=true`,
                // url: '/leave/super-approvals/?approving_authority__id=1&visible=true',
                method: 'GET'
            })
        }),

        //superApproval
        getSuperApprovalApi: builder.query({
            query: () => ({
                url: '/leave/super-approvals/',
                method: 'GET'
            })
        }),

        //superApprovalByID
        getSuperApprovalByID: builder.query({
            query: (leave_request_id) => ({
                url: `/leave/LeaveListApi/?leave_request_id=${leave_request_id}`,
                method: 'GET'
            })
        }),
        getAllEmployeeByCenterID: builder.query({
            query: (CenterID) => ({
                url: `basic-info/User?center__c_rec_id=${CenterID}`,
                method: "GET",
            }),
        }),

        //miniDashboard
        getEmployeeDataByID: builder.query({
            query: (id) => ({
                url: `/leave/leave-balances/${id}`,
                method: 'GET'
            })
        }),

        //Medical or Casual Data
        getCasualMedicalLeave: builder.query({
            query: (fillter) => ({
                url: `/leave/LeaveListApi/?leave_type__leave_type__iexact=${fillter}`,
                method: 'GET'
            })
        }),
        leave_count_post: builder.mutation({
            query: (leavecount_data) => ({
                url: `/leave/leave-count/`,
                method: 'POST',
                body: leavecount_data
            })
        }),
        leave_approvals_post: builder.mutation({
            query: (leave_approvals_data) => ({
                url: `/leave/leave-approvals/`,
                method: 'POST',
                body: leave_approvals_data
            })
        }),

        //get Leave Approval Setup
        getLeaveApprovalSetup: builder.query({
            query: () => ({
                url: '/leave/leave-count/',
                method: 'GET'
            })
        }),
        leave_approvals_delete: builder.mutation({
            query: (leave_approvals_id) => ({
                url: `/leave/leave-approvals/${leave_approvals_id}`,
                method: 'DELETE'
            })
        }),

        leave_approvals_view: builder.query({
            query: (id) => ({
                url: `/leave/leave-approvals/${id}`,
                method: 'GET'
            })
        }),

        GetEmpPosition: builder.query({
            query: () => ({
                url: '/basic-info/position/',
                method: 'GET'
            }),
        }),

        PostCompetentAuthority: builder.mutation({
            query: (formData) => ({
                url: '/competent_authority/CompetentAuthorityAPI/',
                method: 'POST',
                body: formData
            })
        }),

        getCompetentAuthority: builder.query({
            query: () => ({
                url: '/competent_authority/CompetentAuthorityAPI/',
                method: 'GET'
            })
        }),

        deleteCompetentAuthority: builder.mutation({
            query: (id) => ({
                url: `/competent_authority/CompetentAuthorityAPI/${id}`,
                method: 'DELETE'
            })
        }),



    })
});


export const {
    useLeaveTypeQuery,
    usePostLeaveTypeMutation,
    useDeleteLeaveTypeMutation,
    useUpdateLeaveTypeMutation,
    useUpdateLeaveDependableDetailsMutation,
    useGetLeaveDependableDetailAPIQuery,
    usePostLeaveDependableDetailsMutation,
    useDeleteLeaveDependableDetailsMutation,
    useGetSalaryDeductibleQuery,
    useGetSalaryDeductibleeQuery,
    useSalaryDeductibleTypeMutation,
    useSalaryDeductible_LeaveTypeQuery,
    useUpdateSalaryDeductibleTypeMutation,
    useDeleteSalaryDeductibleTypeMutation,
    useAdjustableDependecy_leaveDependency_trueQuery,
    useApprovalsQuery,
    useLeaveApplyDataQuery,
    useApprovalsByIdQuery,
    usePostLeaveApplyMutation,
    useGetLeaveListApiQuery,
    useApprovalsPutMutation,
    useGetAllEmployeeByCenterIDQuery,
    useGetSuperApprovalApiQuery,
    useGetSuperApprovalByIDQuery,
    useGetEmployeeDataByIDQuery,
    useGetCasualMedicalLeaveQuery,
    useApprovalsHistoryQuery,
    useSuperApprovalsHistoryQuery,
    useLeave_count_postMutation,
    useLeave_approvals_postMutation,
    useGetLeaveApprovalSetupQuery,
    useLeave_approvals_deleteMutation,
    useLeave_approvals_viewQuery,
    useGetEmpPositionQuery,
    usePostCompetentAuthorityMutation,
    useGetCompetentAuthorityQuery,
    useDeleteCompetentAuthorityMutation,
} = SetupApi;
