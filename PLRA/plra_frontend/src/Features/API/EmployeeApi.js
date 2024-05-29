import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from 'js-cookie'

export const api = createApi({
  reducerPath: "api",
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
    getFamilyInformation: builder.query({
      query: () => ({
        url: "/master-data/familyinformation/",
        method: "GET",
      }),
    }),
    postFamilyInformation: builder.mutation({
      query: (formData) => ({
        url: "/master-data/familyinformation/",
        method: "POST",
        body: formData,
      }),
    }),
    updateFamilyInformation: builder.mutation({
      query: ({ selectRowID, updateFamilyData }) => ({
        url: `/master-data/familyinformation/${selectRowID}/`,
        method: "PUT",
        body: updateFamilyData,
      }),
    }),
    //Employee Title
    //Employement History
    getEmployementHistory: builder.query({
      query: () => ({
        url: "/master-data/employmenthistory/",
        method: "GET",
      }),
    }),
    postEmployementHistory: builder.mutation({
      query: (formData) => ({
        url: "/master-data/employmenthistory/",
        method: "POST",
        body: formData,
      }),
    }),
    updateEmployementHistory: builder.mutation({
      query: ({ selectRowID, updateEmployeeHistory }) => ({
        url: `/master-data/employmenthistory/${selectRowID}/`,
        method: "PUT",
        body: updateEmployeeHistory,
      }),
    }),

    //Personal Information
    getPersonalInformation: builder.query({
      query: (id) => ({
        url: `/master-data/personalinformation/${id}`,
        method: "GET",
      }),
    }),
    postPersonalInformation: builder.mutation({
      query: (formData) => ({
        url: "/master-data/personalinformation/",
        method: "POST",
        body: formData,
      }),
    }),
    updatePersonalInformation: builder.mutation({
      query: ({ selectRowID, updateEmployeeData }) => ({
        url: `/master-data/personalinformation/${selectRowID}/`,
        method: "PUT",
        body: updateEmployeeData,
      }),
    }),

    //City
    getCity: builder.query({
      query: () => ({
        url: "/master-data/cities/",
        method: "GET",
      }),
    }),
    postCity: builder.mutation({
      query: (formData) => ({
        url: "/master-data/cities/",
        method: "POST",
        body: formData,
      }),
    }),
    updateCity: builder.mutation({
      query: ({ selectRowID, updateCity }) => ({
        url: `/master-data/cities/${selectRowID}/`,
        method: "PUT",
        body: updateCity,
      }),
    }),
    //Country
    getCountry: builder.query({
      query: () => ({
        url: "/master-data/countries/",
        method: "GET",
      }),
    }),
    postCountry: builder.mutation({
      query: (formData) => ({
        url: "/master-data/countries/",
        method: "POST",
        body: formData,
      }),
    }),
    updateCountry: builder.mutation({
      query: ({ selectRowID, updateCity }) => ({
        url: `/master-data/countries/${selectRowID}/`,
        method: "PUT",
        body: updateCity,
      }),
    }),

    //Education Api
    getEducation: builder.query({
      query: () => ({
        url: `/master-data/education/`,
        method: "GET",
      }),
    }),

    postEducation: builder.mutation({
      query: (formData) => ({
        url: `/master-data/education/`,
        method: "POST",
        body: formData,
      }),
    }),

    updateEducation: builder.mutation({
      query: ({ selectRowID, updateEducationData }) => ({
        url: `/master-data/education/${selectRowID}/`,
        method: "PUT",
        body: updateEducationData,
      }),
    }),

    deleteEducation: builder.mutation({
      query: ({ selectRowID }) => ({
        url: "/master-data/education/${selectRowID}/",
        method: "DELETE",
      }),
    }),

    // Employee Reference  API
    getEmployeeReference: builder.query({
      query: () => ({
        url: `/master-data/employeereferance/`,
        method: "GET",
      }),
    }),
    postEmployeeReference: builder.mutation({
      query: (formData) => ({
        url: `/master-data/employeereferance/`,
        method: "POST",
        body: formData,
      }),
    }),
    updateEmployeeReference: builder.mutation({
      query: ({ selectRowID, updateEmployeeReferenceData }) => ({
        url: `/master-data/employeereferance/${selectRowID}/`,
        method: "PUT",
        body: updateEmployeeReferenceData,
      }),
    }),

    //Employement History
    getEmployementHistory: builder.query({
      query: () => ({
        url: "/master-data/employmenthistory/",
        method: "GET",
      }),
    }),
    postEmployementHistory: builder.mutation({
      query: (formData) => ({
        url: "/master-data/employmenthistory/",
        method: "POST",
        body: formData,
      }),
    }),
    updateEmployementHistory: builder.mutation({
      query: ({ selectRowID, updateEmployeeHistory }) => ({
        url: `/master-data/employmenthistory/${selectRowID}/`,
        method: "PUT",
        body: updateEmployeeHistory,
      }),
    }),
    //Employement History
    getJobDistrict: builder.query({
      query: () => ({
        url: "/master-data/District/",
        method: "GET",
      }),
    }),
    postJobDistrict: builder.mutation({
      query: (formData) => ({
        url: "/master-data/District/",
        method: "POST",
        body: formData,
      }),
    }),
    updateJobDistrict: builder.mutation({
      query: ({ selectRowID, updateJobdistrict }) => ({
        url: `/master-data/District/${selectRowID}/`,
        method: "PUT",
        body: updateJobdistrict,
      }),
    }),
    //Contact Information
    getContactInformation: builder.query({
      query: () => ({
        url: "/master-data/EmployeeContactInformation/",
        method: "GET",
      }),
    }),
    postContactInformation: builder.mutation({
      query: (formData) => ({
        url: "/master-data/EmployeeContactInformation/",
        method: "POST",
        body: formData,
      }),
    }),
    updateContactInformation: builder.mutation({
      query: ({ selectRowID, updateContactInformation }) => ({
        url: `/master-data/EmployeeContactInformation/${selectRowID}/`,
        method: "PUT",
        body: updateContactInformation,
      }),
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
  useGetFamilyInformationQuery,
  usePostFamilyInformationMutation,
  useUpdateFamilyInformationMutation,
  useGetContactInformationQuery,
  usePostContactInformationMutation,
  useUpdateContactInformationMutation,
  useGetPersonalInformationQuery,
  usePostPersonalInformationMutation,
  useUpdatePersonalInformationMutation,
  useGetEmployementHistoryQuery,
  usePostEmployementHistoryMutation,
  useUpdateEmployementHistoryMutation,
  useGetJobDistrictQuery,
  usePostJobDistrictMutation,
  useUpdateJobDistrictMutation,
  useGetCurrentDateQuery,
} = api;
