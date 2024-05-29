import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from 'js-cookie'

export const ElevationApi = createApi({
  reducerPath: "ElevationApi",
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
    //Family
    getElevation: builder.query({
      query: () => ({
        url: "elevation/generate_pending_elevation/",
        method: "GET",
      }),
    }),
    gethistoryElevation: builder.query({
      query: (id) => ({
        url: `elevation/getHistory/?document__elevtion_to_l2_doc_rec_id=${id}`,
        method: "GET",
      }),
    }),
    getpendingdocument: builder.query({
      query: () => ({
        url: "elevation/getDocumentHistory/?status__iexact=In+Process",
        method: "GET",
      }),
    }),
    getclosedocument: builder.query({
      query: () => ({
        url: "elevation/getHistory/?document__status__iexact=Close",
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
    generateElevation: builder.query({
      query: () => ({
        url: "elevation/generate-elevation-L2/",
        method: "GET",
      }),
    }),
    postEmployeeStatus: builder.mutation({
      query: (formData) => ({
        url: "elevation/updateEmployeeStatus/",
        method: "POST",
        body: formData,
      }),
    }),
    postEmployeeApprovalDate: builder.mutation({
      query: (formData) => ({
        url: "elevation/updateEmployeeApprovalDate/",
        method: "POST",
        body: formData,
      }),
    }),
    postPromoteElevation: builder.mutation({
      query: (formData) => ({
        url: "elevation/promote/",
        method: "POST",
        body: formData,
      }),
    }),
  }),
});

export const {
  useGetElevationQuery,
  useLazyGenerateElevationQuery,
  usePostEmployeeApprovalDateMutation,
  usePostEmployeeStatusMutation,
  usePostPromoteElevationMutation,
  useLazyUpdateElevationQuery,
  useElevationDocQuery,
  useGetpendingdocumentQuery,
  useGethistoryElevationQuery,
  useGetclosedocumentQuery
} = ElevationApi;
