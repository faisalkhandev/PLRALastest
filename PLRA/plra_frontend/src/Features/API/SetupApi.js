import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from 'js-cookie'

export const SetupApi = createApi({
    reducerPath: "SetupApi",
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
        // Get All Leave Types
        LeaveType: builder.query({
            query: () => ({
                url: "/leave/leave-types-at-apply/",
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


        //GetHRCalenderYear
        getHrCalenderYear: builder.query({
            query: () => ({
                url: "/hr-celander/hr-celander-year/",
                method: 'GET',
            })
        }),

        //postHRCalenderYear
        postHRCalenderYear: builder.mutation({
            query: (formData) => ({
                url: '/hr-celander/hr-celander-year/',
                method: 'POST',
                body: formData,
            })
        }),

        //updateHRCalenderYear
        updateHRCalenderYear: builder.mutation({
            query: ({ id, updateData }) => ({
                url: `/hr-celander/hr-celander-year/${id}/`,
                method: "PUT",
                body: updateData
            }),
        }),

        //deleteHRCalenderYear
        deleteHRCalenderYear: builder.mutation({
            query: ({ selectRowID }) => ({
                url: `/hr-celander/hr-celander-year/${selectRowID}/`,
                method: 'DELETE',
            })
        }),



        //Hr Add Holiday
        getHrAddHoliday: builder.query({
            query: () => ({
                url: "/hr-celander/hr-add-holiday/",
                method: 'GET',
            })
        }),

        //postHRCalenderYear
        postHrAddHoliday: builder.mutation({
            query: (updateAddHoliday) => ({
                url: '/hr-celander/hr-add-holiday/',
                method: 'POST',
                body: updateAddHoliday,
            })
        }),

        //updateHRCalenderYear
        updateHrAddHoliday: builder.mutation({
            query: ({ id, updateData }) => ({
                url: `/hr-celander/hr-add-holiday/${id}/`,
                method: "PUT",
                body: updateData
            }),
        }),

        //deleteHRCalenderYear
        deleteHrAddHoliday: builder.mutation({
            query: ({ selectRowID }) => ({
                url: `/hr-celander/hr-add-holiday/${selectRowID}/`,
                method: 'DELETE',
            })
        }),


        //AAR Prescribed Form API
        //Get AarPrescribedForm 
        getAarPrescribedForm: builder.query({
            query: () => ({
                url: "/annual-assessment/aar-prescribed-forms/",
                method: 'GET',
            })
        }),

        postAarPrescribedForm: builder.mutation({
            query: (updateAarPrescribedForm) => ({
                url: '/annual-assessment/aar-prescribed-forms/',
                method: 'POST',
                body: updateAarPrescribedForm,
            })
        }),

        updateAarPrescribedForm: builder.mutation({
            query: ({ id, updateData }) => ({
                url: `/annual-assessment/aar-prescribed-forms/${id}/`,
                method: "PUT",
                body: updateData
            }),
        }),

        deleteAarPrescribedForm: builder.mutation({
            query: ({ selectRowID }) => ({
                url: `/annual-assessment/aar-prescribed-forms/${selectRowID}/`,
                method: 'DELETE',
            })
        }),


        //SalaryDeductible 
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
                url: `/leave/LeaveListApi/?leave_request_id=${leave_request_id}`,
                // url: `/leave/LeaveListApi/?leave_request_id=1`,
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
            query: (user_id) => ({
                url: `/leave/LeaveListApi/?employee__id=${user_id}`,
                method: 'GET'
            })
        }),
        gethrdirLeaveListApi: builder.query({
            query: (user_id) => ({
                url: `/leave/LeaveListApi`,
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
        approvalsleavePut: builder.mutation({
            query: ({ formData, id }) => ({
                url: `/leave/approvals/${id}/`,
                method: 'PUT',
                body: formData
            })
        }),
        //superApprovalPending
        getSuperApprovalApi: builder.query({
            query: (user_id) => ({
                url: `/leave/super-approvals/?approving_authority__id=${user_id}&visible=true`,
                // url: '/leave/super-approvals/?approving_authority__id=1&visible=true',
                method: 'GET'
            })
        }),
        getSuperApprovalHistoryApi: builder.query({
            query: (user_id) => ({
                url: `/leave/super-approvals/?approving_authority__id=${user_id}&visible=false`,
                method: 'GET'
            })
        }),

        getSuperApprovalAdditionalPositionApi: builder.query({
            query: (user_id) => ({
                url: `/leave/super-approvals/?approving_authority__id=${user_id}&visible=false&ready_for_position_assignment=true`,
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
        // getCasualMedicalLeave: builder.query({
        //     query: (fillter) => ({
        //         url: `/leave/LeaveListApi/?leave_type__leave_type__iexact=${fillter}`,
        //         method: 'GET'
        //     })
        // }),

        getCasualMedicalLeave: builder.query({
            query: ({fillter, userID}) => ({
                url: `/leave/LeaveListApi/?leave_type__leave_type__iexact=${fillter}&employee__id=${userID}`,
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
                url: `/leave/leave-count/${leave_approvals_id}`,
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
    useApprovalsleavePutMutation,
    useGetAllEmployeeByCenterIDQuery,
    useGetSuperApprovalApiQuery,
    useGetSuperApprovalHistoryApiQuery,
    useGetSuperApprovalAdditionalPositionApiQuery,
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
    useGetHrCalenderYearQuery,
    usePostHRCalenderYearMutation,
    useUpdateHRCalenderYearMutation,
    useDeleteHRCalenderYearMutation,
    useGetHrAddHolidayQuery,
    usePostHrAddHolidayMutation,
    useUpdateHrAddHolidayMutation,
    useDeleteHrAddHolidayMutation,
    useGetAarPrescribedFormQuery,
    usePostAarPrescribedFormMutation,
    useUpdateAarPrescribedFormMutation,
    useDeleteAarPrescribedFormMutation,
    useGethrdirLeaveListApiQuery
} = SetupApi;
