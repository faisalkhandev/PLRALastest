import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";

export const AnnualAssessment = createApi({
  reducerPath: "AnnualAssessment",
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
    ccoApprovalByID: builder.query({
      query: (apprvalID) => ({
        url: `/annual-assessment/aar-processesList/?id=${apprvalID}`,
        method: "GET",
      }),
    }),
    //horo api's
    horoAllApprovals: builder.query({
      // CneterCounterOfficer = cco
      query: (user_id) => ({
        url: `/annual-assessment/aarho_reporting_officer_approval/?reporting_officer__id=${user_id}&visible=true`,
        method: "GET",
      }),
    }),
    horohistoryAllApprovals: builder.query({
      // CneterCounterOfficer = cco
      query: (user_id) => ({
        url: `/annual-assessment/aarho_reporting_officer_approval/?reporting_officer__id=${user_id}&visible=false&status__startswith=Approved`,
        method: "GET",
      }),
    }),

    hocoAllApprovals: builder.query({
      // CneterCounterOfficer = cco
      query: (user_id) => ({
        url: `/annual-assessment/aarho_counter_assigning_officer_approval/?counter_assigning_officer__id=${user_id}&visible=True`,
        method: "GET",
      }),
    }),
    hocohistoryAllApprovals: builder.query({
      // CneterCounterOfficer = cco
      query: (user_id) => ({
        url: `/annual-assessment/aarho_counter_assigning_officer_approval/?counter_assigning_officer__id=${user_id}&visible=false`,
        method: "GET",
      }),
    }),

    coroAllApprovals: builder.query({
      // CneterCounterOfficer = cco
      query: (user_id) => ({
        url: `/annual-assessment/aar_reporting_officer_approval/?reporting_officer__id=${user_id}&visible=True`,
        method: "GET",
      }),
    }),
    corohistoryAllApprovals: builder.query({
      // CneterCounterOfficer = cco
      query: (user_id) => ({
        url: `/annual-assessment/aar_reporting_officer_approval/?reporting_officer__id=${user_id}&visible=false&status__startswith=Approved`,
        method: "GET",
      }),
    }),

    cocoAllApprovals: builder.query({
      // CneterCounterOfficer = cco
      query: (user_id) => ({
        url: `/annual-assessment/aar_counter_assigning_officer_approval/?counter_assigning_officer__id=${user_id}&visible=True`,
        method: "GET",
      }),
    }),
    cocohistoryAllApprovals: builder.query({
      // CneterCounterOfficer = cco
      query: (user_id) => ({
        url: `/annual-assessment/aar_counter_assigning_officer_approval/?counter_assigning_officer__id=${user_id}&visible=false`,
        method: "GET",
      }),
    }),

    cocaAllApprovals: builder.query({
      // CneterCounterOfficer = cco
      query: (user_id) => ({
        url: `/annual-assessment/AARCompetentAuthorityApprovalViewSet/?competent_authority_id=${user_id}&visible=true`,
        method: "GET",
      }),
    }),
    cocahistoryAllApprovals: builder.query({
      // CneterCounterOfficer = cco
      query: (user_id) => ({
        url: `/annual-assessment/AARCompetentAuthorityApprovalViewSet/?competent_authority_id=${user_id}&visible=false`,
        method: "GET",
      }),
    }),

    hocApprovalsPut: builder.mutation({
      query: ({ formData, id }) => ({
        url: `/annual-assessment/aarho_counter_assigning_officer_approval/${id}/`,
        method: "PUT",
        body: formData,
      }),
    }),
    horApprovalsPut: builder.mutation({
      query: ({ formData, id }) => ({
        url: `/annual-assessment/aarho_reporting_officer_approval/${id}/`,
        method: "PUT",
        body: formData,
      }),
    }),
    cocApprovalsPut: builder.mutation({
      query: ({ formData, id }) => ({
        url: `/annual-assessment/aar_counter_assigning_officer_approval/${id}/`,
        method: "PUT",
        body: formData,
      }),
    }),
    corApprovalsPut: builder.mutation({
      query: ({ formData, id }) => ({
        url: `/annual-assessment/aar_reporting_officer_approval/${id}/`,
        method: "PUT",
        body: formData,
      }),
    }),
    ratingPut: builder.mutation({
      query: ({ formData, id }) => ({
        url: `/annual-assessment/rating-type-points-assignments/${id}/`,
        method: "PUT",
        body: formData,
      }),
    }),
    coroAllRating: builder.query({
      // CneterCounterOfficer = cco
      query: (id) => ({
        url: `/annual-assessment/rating-type-points-assignments/?aar_request_id__id=${id}`,
        method: "GET",
      }),
    }),
    AllRatingType: builder.query({
      // CneterCounterOfficer = cco
      query: (id) => ({
        url: `/annual-assessment/rating-type-likert-scales/`,
        method: "GET",
      }),
    }),
    // Get All DG data
    DG_Pending_Data: builder.query({
      query: (id) => ({
        url: `annual-assessment/AARCompetentAuthorityApprovalViewSet/?competent_authority__id=${id}&visible=True`,
        method: "GET",
      }),
    }),

    DG_History_Data: builder.query({
      query: (id) => ({
        url: `annual-assessment/AARCompetentAuthorityApprovalViewSet/?competent_authority__id=${id}&visible=False`,
        method: "GET",
      }),
    }),

    approvalsannualassessmentPut: builder.mutation({
      query: ({ formData, id }) => ({
        url: `annual-assessment/AARCompetentAuthorityApprovalViewSet/${id}/`,
        method: "PUT",
        body: formData,
      }),
    }),

    //Annual Assessment Process List Api
    getAnnualAssessmentProcessList: builder.query({
      query: (user_id) => ({
        url: `/annual-assessment/aar-processesList/?employee__id=${user_id}`,
        method: "GET",
      }),
    }),
    getHRDirAnnualAssessmentProcessList: builder.query({
      query: (user_id) => ({
        url: `/annual-assessment/aar-processesList`,
        method: "GET",
      }),
    }),

    //Post Annual Assesment Process List
    postAnnualAssessmentProocessList: builder.mutation({
      query: (AapData) => ({
        url: "/annual-assessment/aar-processes/",
        method: "POST",
        body: AapData,
      }),
    }),

    //Add HR Celander Year
    getHRCalendarYear: builder.query({
      query: () => ({
        url: "/hr-celander/hr-celander-year/",
        method: "GET",
      }),
    }),

    //User Get Api by ID
    getUserById: builder.query({
      query: (id) => ({
        url: `/basic-info/User/${id}`,
        method: "GET",
      }),
    }),
    getAllRatingModel: builder.query({
      query: () => ({
        url: `/annual-assessment/rating-models/`,
        method: "GET",
      }),
    }),
    postRatingPoints: builder.mutation({
      query: (rowData) => ({
        url: `annual-assessment/rating-type-points/`,
        method: "POST",
        body: rowData,
      }),
    }),
    getRatingPoints: builder.query({
      query: (Id) => ({
        url: `annual-assessment/rating-type-points/?rating_model__id=${Id}`,
        method: "GET",
      }),
    }),
    postRatingModel: builder.mutation({
      query: (formData) => ({
        url: `/annual-assessment/rating-models/`,
        method: "POST",
        body: formData,
      }),
    }),
    //User Get Api by ID
    getUserById: builder.query({
      query: (id) => ({
        url: `/basic-info/User/${id}`,
        method: "GET",
      }),
    }),
    //Get User Job Toggle  by Id
    getUserJobById: builder.query({
      query: (userID) => ({
        url: `/annual-assessment/check-job/${userID}/`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useApprovalsannualassessmentPutMutation,
  useDG_Pending_DataQuery,
  useDG_History_DataQuery,
  useCcoApprovalByIDQuery,
  useHoroAllApprovalsQuery,
  useHorApprovalsPutMutation,
  useGetAnnualAssessmentProcessListQuery,
  usePostAnnualAssessmentProocessListMutation,
  useGetHRCalendarYearQuery,
  useGetUserByIdQuery,
  useHorohistoryAllApprovalsQuery,
  useHocoAllApprovalsQuery,
  useHocohistoryAllApprovalsQuery,
  useHocApprovalsPutMutation,
  useCoroAllApprovalsQuery,
  useCorohistoryAllApprovalsQuery,
  useCorApprovalsPutMutation,
  useCoroAllRatingQuery,
  useRatingPutMutation,
  useCocoAllApprovalsQuery,
  useCocohistoryAllApprovalsQuery,
  useCocApprovalsPutMutation,
  useAllRatingTypeQuery,
  useCocaAllApprovalsQuery,
  useCocahistoryAllApprovalsQuery,
  useGetAllRatingModelQuery,
  usePostRatingPointsMutation,useGetRatingPointsQuery,
  usePostRatingModelMutation,
  useGetUserJobByIdQuery,
  useGetHRDirAnnualAssessmentProcessListQuery
} = AnnualAssessment;
