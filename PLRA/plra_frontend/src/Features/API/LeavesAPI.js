import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from 'js-cookie'

export const leaveApi = createApi({
  reducerPath: "leaveApi",
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
    //Leave Type
    getLeaveType: builder.query({
      query: () => ({
        url: "/leave/LeaveTypeAPI/",
        method: "GET",
      }),
    }),
    postLeaveType: builder.mutation({
      query: (formData) => ({
        url: "/leave/LeaveTypeAPI/",
        method: "POST",
        body: formData,
      }),
    }),
    updateLeaveType: builder.mutation({
      query: ({ selectRowID, updateLeaveType }) => ({
        url: `/leave/LeaveTypeAPI/${selectRowID}/`,
        method: "PUT",
        body: updateLeaveType,
      }),
    }),
    //Leave Request
    getLeaveRequest: builder.query({
      query: () => ({
        url: "/leave/LeaveApplyAPI/",
        method: "GET",
      }),
    }),
    postLeaveRequest: builder.mutation({
      query: (formData) => ({
        url: "/leave/LeaveApplyAPI/",
        method: "POST",
        body: formData,
      }),
    }),
    updateLeaveRequest: builder.mutation({
      query: ({ selectRowID, updateLeaveRequest }) => ({
        url: `/leave/LeaveApplyAPI/{selectRowID}/`,
        method: "PUT",
        body: updateLeaveRequest,
      }),
    }),
    deleteLeaveRequest: builder.mutation({
      query: ({ selectRowID }) => ({
        url: `/leave/LeaveApplyAPI/{selectRowID}/`,
        method: "DELETE",
      }),
    }),
    //Leave Dependency
    getLeaveDependency: builder.query({
      query: () => ({
        url: "/leave/LeaveDependencyAPI/",
        method: "GET",
      }),
    }),
    postLeaveDependency: builder.mutation({
      query: (formData) => ({
        url: "/leave/LeaveDependencyAPI/",
        method: "POST",
        body: formData,
      }),
    }),
    updateLeaveDependency: builder.mutation({
      query: ({ selectRowID, updateLeaveDependencyData }) => ({
        url: `/leave/LeaveDependencyAPI/{selectRowID}/`,
        method: "PUT",
        body: updateLeaveDependencyData,
      }),
    }),
    deleteLeaveDependency: builder.mutation({
      query: ({ selectRowID }) => ({
        url: `/leave/LeaveDependencyAPI/{selectRowID}/`,
        method: "DELETE",
      }),
    }),
    //Leave DependableDetail
    getLeaveDependableDetail: builder.query({
      query: () => ({
        url: "/leave/LeaveDependableDetailAPI/",
        method: "GET",
      }),
    }),
    postLeaveDependableDetail: builder.mutation({
      query: (formData) => ({
        url: "/leave/LeaveDependableDetailAPI//",
        method: "POST",
        body: formData,
      }),
    }),
    updateLeaveDependableDetail: builder.mutation({
      query: ({ selectRowID, updateLeaveDependencyData }) => ({
        url: `/leave/LeaveDependableDetailAPI/{selectRowID}/`,
        method: "PUT",
        body: updateLeaveDependencyData,
      }),
    }),
    deleteLeaveDependableDetail: builder.mutation({
      query: ({ selectRowID }) => ({
        url: `/leave/LeaveDependableDetailAPI/{selectRowID}/`,
        method: "DELETE",
      }),
    }),
    //Leave SalaryDeductible
    getLeaveSalaryDeductible: builder.query({
      query: () => ({
        url: "/leave/SalaryDeductibleAPI/",
        method: "GET",
      }),
    }),
    postLeaveSalaryDeductible: builder.mutation({
      query: (formData) => ({
        url: "/leave/SalaryDeductibleAPI/",
        method: "POST",
        body: formData,
      }),
    }),
    updateLeaveSalaryDeductible: builder.mutation({
      query: ({ selectRowID, updateLeaveDependencyData }) => ({
        url: `/leave/SalaryDeductibleAPI/{selectRowID}/`,
        method: "PUT",
        body: updateLeaveDependencyData,
      }),
    }),
    deleteLeaveSalaryDeductible: builder.mutation({
      query: ({ selectRowID }) => ({
        url: `/leave/SalaryDeductibleAPI/{selectRowID}/`,
        method: "DELETE",
      }),
    }),
    //Leave Dependable
    getLeaveDependable: builder.query({
      query: () => ({
        url: "/leave/LeaveDependableDetailAPI/",
        method: "GET",
      }),
    }),
    postLeaveDependable: builder.mutation({
      query: (formData) => ({
        url: "/leave/LeaveDependableDetailAPI/",
        method: "POST",
        body: formData,
      }),
    }),
    updateLeaveDependable: builder.mutation({
      query: ({ selectRowID, updateLeaveDependencyData }) => ({
        url: `/leave/LeaveDependableDetailAPI/{selectRowID}/`,
        method: "PUT",
        body: updateLeaveDependencyData,
      }),
    }),
    deleteLeaveDependable: builder.mutation({
      query: ({ selectRowID }) => ({
        url: `/leave/LeaveDependableDetailAPI/{selectRowID}/`,
        method: "DELETE",
      }),
    }),
    //Leave deduction Bucket
    getLeaveDeductionBucket: builder.query({
      query: () => ({
        url: "leave/LeaveDependableBucketAPI/",
        method: "GET",
      }),
    }),
    postLeaveDeductionBucket: builder.mutation({
      query: (formData) => ({
        url: "leave/LeaveDependableBucketAPI/",
        method: "POST",
        body: formData,
      }),
    }),
    updateLeaveDeductionBucket: builder.mutation({
      query: ({ selectRowID, updateLeaveDeductionBucket }) => ({
        url: `leave/LeaveDependableBucketAPI/${selectRowID}/`,
        method: "PUT",
        body: updateLeaveDeductionBucket,
      }),
    }),
    //LeaveType for Leave Apply Time
    getLeaveApplyTime: builder.query({
      query: () => ({
        url: "/leave/LeaveTypeAPI/?visible_at_leave_apply_time=true",
        method: "GET",
      }),
    }),

    //LeaveType  for Leave Salary Deductable
    getLeaveTypeSalaryDecductable: builder.query({
      query: () => ({
        url: "/leave/LeaveTypeAPI/?salary_deduction_eligibility_rule=true",
        method: "GET",
      }),
    }),


  }),
});

export const {
  useGetLeaveDependencyQuery,
  usePostLeaveDependencyMutation,
  useUpdateLeaveDependencyMutation,
  useDeleteLeaveDependencyMutation,
  useGetLeaveApplyTimeQuery,
  useGetLeaveTypeSalaryDecductableQuery,
  useGetLeaveSalaryDeductibleQuery,
  usePostLeaveSalaryDeductibleMutation,
  useUpdateLeaveSalaryDeductibleMutation,
  useDeleteLeaveSalaryDeductibleMutation,
  useGetLeaveDependableDetailQuery,
  usePostLeaveDependableDetailMutation,
  useUpdateLeaveDependableDetailMutation,
  useGetLeaveDeductionBucketQuery,
  usePostLeaveDeductionBucketMutation,
  useUpdateLeaveDeductionBucketMutation,
  useGetLeaveRequestQuery,
  usePostLeaveRequestMutation,
  useUpdateLeaveRequestMutation,
  useDeleteLeaveRequestMutation,
  useGetLeaveTypeQuery,
  usePostLeaveTypeMutation,
  useUpdateLeaveTypeMutation,

} = leaveApi;
