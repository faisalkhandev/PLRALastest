import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from 'js-cookie'

export const ProgressionApi = createApi({
  reducerPath: "ProgressionApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://127.0.0.1:8000/",
    prepareHeaders: (headers, { getState }) => {
      const authToken = Cookies.get("authToken");
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
    //Family
    getProgression: builder.query({
      query: () => ({
        url: "progression/generate_pending_progression/",
        method: "GET",
      }),
    }),
    updateProgression: builder.query({
      query: (id) => ({
        url: `progression/update_pending_progression/${id}`,
        method: "GET",
      }),
    }),
    ProgressionDoc: builder.query({
      query: (id) => ({
        url: `progression/getDocument/${id}`,
        method: "GET",
      }),
    }),
    getdocumentbyid: builder.query({
      query: (id) => ({
        url: `progression/getDocument/${id}`,
        method: "GET",
      }),
    }),
    getPendingProgression: builder.query({
      query: () => ({
        url: "progression/approvals-progression/?document__status__iexact=In%20Process",
        method: "GET",
      }),
    }),
    getHistoryProgression: builder.query({
      query: () => ({
        url: "progression/approvals-progression/?document__status__iexact=Close",
        method: "GET",
      }),
    }),
    getpositionProgression: builder.query({
      query: ({ id, positionid }) => ({
        url: `updatePosition/${id}/${positionid}/`,
        method: "GET",
      }),
    }),
    generateProgression: builder.query({
      query: () => ({
        url: "progression/generate-progression/",
        method: "GET",
      }),
    }),
    getProgressionbyid: builder.query({
      query: (id) => ({
        url: `progression/generate_pending_progression/${id}/`,
        method: "GET",
      }),
    }),
    postEmployeeStatus: builder.mutation({
      query: (formData) => ({
        url: "progression/updateEmployeeStatus/",
        method: "POST",
        body: formData,
      }),
    }),
    postEmployeeApprovalDate: builder.mutation({
      query: (formData) => ({
        url: "progression/updateEmployeeApprovalDate/",
        method: "POST",
        body: formData,
      }),
    }),
    postPromoteProgression: builder.mutation({
      query: (formData) => ({
        url: "progression/promote-progression/",
        method: "POST",
        body: formData,
      }),
    }),
    getElevation: builder.query({
      query: () => ({
        url: "elevation/generate_pending_elevation/",
        method: "GET",
      }),
    }),
    updateElevation: builder.query({
      query: (id) => ({
        url: `elevation/update_pending_elevation/${id}`,
        method: "GET",
      }),
    }),
    ElevationDoc: builder.query({
      query: (id) => ({
        url: `elevation/getDocument/${id}`,
        method: "GET",
      }),
    }),
  
  }),
});

export const {
  useGetProgressionQuery,useLazyGenerateProgressionQuery,usePostEmployeeApprovalDateMutation,
  usePostEmployeeStatusMutation,usePostPromoteProgressionMutation,useLazyUpdateProgressionQuery,
  useProgressionDocQuery,useGetProgressionbyidQuery,useGetpositionProgressionQuery,
  useGetPendingProgressionQuery,useGetHistoryProgressionQuery,useGetdocumentbyidQuery
} = ProgressionApi;
