import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";
 
export const TransferApi = createApi({
  reducerPath: "TransferApi",
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
    getDistance: builder.query({
      query: () => ({
        url: "E_transfer/distance-rating-formulas/",
        method: "GET",
      }),
    }),
    updateDistance: builder.mutation({
      query: ({ id, formData }) => ({
        url: `E_transfer/distance-rating-formulas/${id}/`,
        method: "PUT",
        body: formData,
      }),
    }),
    getTenure: builder.query({
      query: () => ({
        url: "E_transfer/tenure-rating-formulas/",
        method: "GET",
      }),
    }),
    updateTenure: builder.mutation({
      query: ({ id, formData }) => ({
        url: `E_transfer/tenure-rating-formulas/${id}/`,
        method: "PUT",
        body: formData,
      }),
    }),
    getWedlock: builder.query({
      query: () => ({
        url: "E_transfer/wedlock-rating-formulas/",
        method: "GET",
      }),
    }),
    updateWedlock: builder.mutation({
      query: ({ id, formData }) => ({
        url: `E_transfer/wedlock-rating-formulas/${id}/`,
        method: "PUT",
        body: formData,
      }),
    }),
    getDisability: builder.query({
      query: () => ({
        url: "E_transfer/disability-rating-formulas/",
        method: "GET",
      }),
    }),
    updateDisability: builder.mutation({
      query: ({ id, formData }) => ({
        url: `E_transfer/disability-rating-formulas/${id}/`,
        method: "PUT",
        body: formData,
      }),
    }),
    //ApplyFor Transfer
    getAllPosition: builder.query({
      query: (active) => ({
        url: `/basic-info/position/?open_position=${active}`,
        method: "GET",
      }),
    }),
    getEmployeeByID: builder.query({
      query: (id) => ({
        url: `/basic-info/User/${id}/`,
        method: "GET",
      }),
    }),
    postTransfer: builder.mutation({
      query: (formD) => ({
        url: `Administrative_transfer/transfer-process/`,
        method: "POST",
        body: formD,
      }),
    }),
    getAllTransfer: builder.query({
      query: () => ({
        url: `Administrative_transfer/transfer-process/`,
        method: "GET",
      }),
    }),
    getAllTransferPending: builder.query({
      query: (user_id) => ({
        url: `Administrative_transfer/transfer-approvals/?approving_authority__id=${user_id}&visible=true`,
        method: "GET",
      }),
    }),
    getAllTransferHistory: builder.query({
      query: (user_id) => ({
        url: `Administrative_transfer/transfer-approvals/?approving_authority__id=${user_id}&visible=false`,
        method: "GET",
      }),
    }),
    getAllTransferPendingbyId: builder.query({
      query: (id) => ({
        url: `Administrative_transfer/transfer-approvals/${id}/`,
        method: "GET",
      }),
    }),
    updatetransfer: builder.mutation({
      query: ({ id, formData }) => ({
        url: `Administrative_transfer/transfer-approvals/${id}/`,
        method: "PUT",
        body: formData,
      }),
    }),
 
    getHolidays: builder.query({
      query: () => ({
        url: `hr-celander/hr-add-holiday/`,
        method: 'GET'
      })
    }),
 
    posttransferwindow: builder.mutation({
      query: (formData ) => ({
        url: `E_transfer/E_Transfer_Window_PeriodViewSet/`,
        method: "POST",
        body: formData,
      }),
    }),
    puttransferwindow: builder.mutation({
      query: ({formData,id} ) => ({
        url: `E_transfer/E_Transfer_Window_PeriodViewSet/${id}/`,
        method: "PATCH",
        body: formData,
      }),
    }),
    getapplyposition: builder.query({
      query: () => ({
        url: `/E_transfer/ApplyPositionsViewSet/`,
        method: "GET",
      }),
    }),
    posttransferprocess: builder.mutation({
      query: (formData ) => ({
        url: `E_transfer/E_Transfer_ProcessViewSet/`,
        method: "POST",
        body: formData,
      }),
    }),
    getetransferprocess: builder.query({
      query: () => ({
        url: `/E_transfer/E_Transfer_ProcessViewSet/`,
        method: "GET",
      }),
    }),
    getetransferwindow: builder.query({
      query: () => ({
        url: `/E_transfer/E_Transfer_Window_PeriodViewSet/?status=true`,
        method: "GET",
      }),
    }),
    gethistoryetransferwindow: builder.query({
      query: () => ({
        url: `/E_transfer/E_Transfer_Window_PeriodViewSet/?status=false`,
        method: "GET",
      }),
    }),
    getetransferwindowbyid: builder.query({
      query: (id) => ({
        url: `/E_transfer/E_Transfer_Window_PeriodViewSet/?id=${id}`,
        method: "GET",
      }),
    }),
    posttransferratingmodel: builder.mutation({
      query: (formData ) => ({
        url: `E_transfer/transfer-rating-model/`,
        method: "POST",
        body: formData,
      }),
    }),
    gettransferratingmodel: builder.query({
      query: () => ({
        url: `E_transfer/transfer-rating-model/`,
        method: "GET",
      }),
    }),
    gettransferratingmodelbyid: builder.query({
      query: (id) => ({
        url: `E_transfer/transfer-rating-model/?rating_model_rec_id=${id}`,
        method: "GET",
      }),
    }),
    gettransferratingtypes: builder.query({
      query: () => ({
        url: `E_transfer/transfer-rating-types/`,
        method: "GET",
      }),
    }),
    gettransferratingtypesbyid: builder.query({
      query: (id) => ({
        url: `E_transfer/distance-rating-formulas-types/?model__rating_model_rec_id=${id}`,
        method: "GET",
      }),
    }),
    postratingformulastypes: builder.mutation({
      query: (formData ) => ({
        url: `E_transfer/distance-rating-formulas-types/`,
        method: "POST",
        body: formData,
      }),
    }),
    puttransferratingmodel: builder.mutation({
      query: ({formData,id} ) => ({
        url: `E_transfer/transfer-rating-model/${id}/`,
        method: "PUT",
        body: formData,
      }),
    }),
    putratingformulastypes: builder.mutation({
      query: ({formData,id }) => ({
        url: `E_transfer/distance-rating-formulas-types/${id}/`,
        method: "PUT",
        body: formData,
      }),
    }),
    getetransferprocessbyid: builder.query({
      query: (user_id) => ({
        url: `/E_transfer/E_Transfer_ProcessViewSet/?employee__id=${user_id}`,
        method: "GET",
      }),
    }),
    gethrdiretransferprocessbyid: builder.query({
      query: (user_id) => ({
        url: `/E_transfer/E_Transfer_ProcessViewSet`,
        method: "GET",
      }),
    }),
    getetransferwindowbystatus: builder.query({
      query: () => ({
        url: `/E_transfer/E_Transfer_Window_PeriodViewSet/`,
        method: "GET",
      }),
    }),
    gettransferpositions: builder.query({
      query: () => ({
        url: `/E_transfer/ConcernOfficerApprovalViewSet/`,
        method: "GET",
      }),
    }),
    getconcernofficerapprovalbyid: builder.query({
      query: (id) => ({
        url: `/E_transfer/getConcernOfficerApprovalViewSetById/${id}/`,
        method: "GET",
      }),
    }),
    gethrdirectorapproval: builder.query({
      query: () => ({
        url: `/E_transfer/HRDirectorETransferApprovalViewSet/`,
        method: "GET",
      }),
    }),
    gethrdirectorapprovalbyid: builder.query({
      query: (id) => ({
        url: `/E_transfer/HRDirectorETransferApprovalViewSet/${id}/`,
        method: "GET",
      }),
    }),
    putconcernofficermarks: builder.mutation({
      query: ({formData,id }) => ({
        url: `E_transfer/ratingmatrix/${id}/`,
        method: "PUT",
        body: formData,
      }),
    }),
    postSameDistrictRestriction: builder.mutation({
      query: (formData) => ({
        url: '/E_transfer/SameDistrictRule/',
        method: 'POST',
        body: formData,
      })
    }),
 
    getSameDistrictRestriction: builder.query({
      query: () => ({
        url: '/E_transfer/SameDistrictRule/',
        method: 'GET'
      })
    }),
    getwindowpositions: builder.query({
      query: () => ({
        url: '/E_transfer/positions_available_for_window/',
        method: 'GET'
      })
    }),
 
    deleteSameDistrictRestriction: builder.mutation({
      query: (id) => ({
        url: `/E_transfer/SameDistrictRule/${id}`,
        method: 'DELETE'
      })
    }),
  }),
});
 
export const {
  useGetDistanceQuery,useUpdateDistanceMutation,useGetTenureQuery,useUpdateTenureMutation,useGetWedlockQuery,useUpdateWedlockMutation,useGetDisabilityQuery,useUpdateDisabilityMutation,useGetAllPositionQuery,useGetEmployeeByIDQuery,usePostTransferMutation,useGetAllTransferQuery,
  useGetAllTransferHistoryQuery,useGetAllTransferPendingQuery,useGetAllTransferPendingbyIdQuery,useUpdatetransferMutation,usePosttransferwindowMutation,
  useGetapplypositionQuery,usePosttransferprocessMutation,useGetetransferprocessQuery,useGetetransferwindowQuery,usePosttransferratingmodelMutation,
  useGettransferratingmodelQuery,useGettransferratingtypesQuery,usePostratingformulastypesMutation,useGettransferratingmodelbyidQuery,
  useGetHolidaysQuery,useGettransferratingtypesbyidQuery,usePuttransferratingmodelMutation,usePutratingformulastypesMutation,usePuttransferwindowMutation,
  useGetetransferwindowbystatusQuery,useGetetransferprocessbyidQuery,usePutconcernofficermarksMutation,usePostSameDistrictRestrictionMutation,
  useGetSameDistrictRestrictionQuery,useDeleteSameDistrictRestrictionMutation,useGetetransferwindowbyidQuery,useGethistoryetransferwindowQuery,
  useGetwindowpositionsQuery,useGettransferpositionsQuery,useGetconcernofficerapprovalbyidQuery,useGethrdirectorapprovalbyidQuery,useGethrdirectorapprovalQuery,
  useGethrdiretransferprocessbyidQuery
} = TransferApi;
 