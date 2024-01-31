import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from 'js-cookie'

export const EmployeeMasterDataAPI = createApi({
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

        //User Get Api
        getUser: builder.query({
            query: () => ({
                url: "/basic-info/User/",
                method: 'GET',
            }),
        }),

        // Employee Reference  API
        getEmployeeReference: builder.query({
            query: (id) => ({
                url: `/master-data/employeereferance/?employee__id=${id}`,
                method: 'GET',
            }),
        }),
        postEmployeeReference: builder.mutation({
            query: (formData) => ({
                url: "/master-data/employeereferance/",
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

        deleteEmployeeReference: builder.mutation({
            query: ({ selectRowID }) => ({
                url: `/master-data/employeereferance/${selectRowID}/`,
                method: "DELETE",
            }),
        }),


        //Employee Level of Skill Get Api

        getEmployeeLevelofSkill: builder.query({
            query: (id) => ({
                url: `/master-data/level_of_skill/?employee__id=${id}`,
                method: 'GET',
            }),
        }),


        //Employee Skills API
        getEmployeeSkill: builder.query({
            query: (id) => ({
                url: `/master-data/skill/?employee__id=${id}`,
                method: 'GET',
            }),
        }),
        postEmployeeSkill: builder.mutation({
            query: (formData) => ({
                url: "/master-data/skill/",
                method: "POST",
                body: formData,
            }),
        }),
        updateEmployeeSkill: builder.mutation({
            query: ({ selectRowID, updateEmployeeSkillData }) => ({
                url: `/master-data/skill/${selectRowID}/`,
                method: "PUT",
                body: updateEmployeeSkillData,
            }),
        }),
        deleteEmployeeSkill: builder.mutation({
            query: ({ selectRowID }) => ({
                url: `/master-data/skill/${selectRowID}/`,
                method: "DELETE",
            }),
        }),
        //Employee Training API
        getEmployeeTraining: builder.query({
            query: (id) => ({
                url: `/master-data/training/?employee__id=${id}`,
                method: 'GET',
            }),
        }),
        postEmployeeTraining: builder.mutation({
            query: (formData) => ({
                url: "/master-data/training/",
                method: "POST",
                body: formData,
            }),
        }),
        updateEmployeeTraining: builder.mutation({
            query: ({ selectRowID, updateEmployeeTrainingData }) => ({
                url: `/master-data/training/${selectRowID}/`,
                method: "PUT",
                body: updateEmployeeTrainingData,
            }),
        }),
        deleteEmployeeTraining: builder.mutation({
            query: ({ selectRowID }) => ({
                url: `/master-data/training/${selectRowID}/`,
                method: "DELETE",
            }),
        }),
        //Employee Contact Info API
        getEmployeeContactInfo: builder.query({
            query: () => ({
                url: "/master-data/EmployeeContactInformation/",
                method: 'GET',
            }),
        }),
        postEmployeeContactInfo: builder.mutation({
            query: (formData) => ({
                url: "/master-data/EmployeeContactInformation/",
                method: "POST",
                body: formData,
            }),
        }),
        updateEmployeeContactInfo: builder.mutation({
            query: ({ selectRowID, updateEmployeeContactInfoData }) => ({
                url: `/master-data/EmployeeContactInformation/${selectRowID}/`,
                method: "PUT",
                body: updateEmployeeContactInfoData,
            }),
        }),

        //Employee Personal Documents API
        getPersonalDocuments: builder.query({
            query: () => ({
                url: "/master-data/personal_document/",
                headers: { 'Content-Type': 'multipart/form-data' },
                method: 'GET',
            }),
        }),

        postPersonalDocuments: builder.mutation({
            query: (formD) => ({
                url: "/master-data/personal_document/",
                method: "POST",
                body: formD,
            }),
        }),
        updatePersonalDocuments: builder.mutation({
            query: ({ selectRowID, formD }) => ({
                url: `/master-data/personal_document/${selectRowID}/`,
                method: "PUT",
                body: formD,
                invalidatesTags: ['PersonalDocuments'],
            }),
        }),
        deletePersonalDocuments: builder.mutation({
            query: ({ selectRowID }) => ({
                url: `/master-data/personal_document/${selectRowID}/`,
                method: "DELETE",
            }),
        }),

        //Employee Address API
        getAddress: builder.query({
            query: (id) => ({
                url: `/master-data/EmployeeAddress/?employee__id=${id}`,
                method: 'GET',
            }),
        }),
        postAddress: builder.mutation({
            query: (formData) => ({
                url: "/master-data/EmployeeAddress/",
                method: "POST",
                body: formData,
            }),
        }),
        updateAddress: builder.mutation({
            query: ({ selectRowID, updateAddressData }) => ({
                url: `/master-data/EmployeeAddress/${selectRowID}/`,
                method: "PUT",
                body: updateAddressData,
            }),
        }),

        deleteAddress: builder.mutation({
            query: ({ selectRowID }) => ({
                url: `/master-data/EmployeeAddress/${selectRowID}/`,
                method: "DELETE",
            }),
        }),

        //Address District Api for Get
        getEmployeDistrict: builder.query({
            query: () => ({
                url: "/master-data/District/",
                method: 'GET',
            }),
        }),

        //Address Tehsil Api for Get
        getEmployeeTehsil: builder.query({
            query: () => ({
                url: "/master-data/Tehsil/",
                method: 'GET',
            }),
        }),

        //Address City Api for Get
        getEmployeeCity: builder.query({
            query: () => ({
                url: "/master-data/cities/",
                method: 'GET',
            }),
        }),
        //Position for Employee Api
        getPositionbyJobCenterFilter: builder.query({
            query: ({ JobID, CenterID }) => ({
                url: `/basic-info/position/?job__j_rec_id=${JobID}&location__c_rec_id=${CenterID}&open_position=true`,
                method: 'GET',
            }),
        }),

        //Job level get api for position form
        getJobLevel: builder.query({
            query: ({ JobID }) => ({
                url: `/basic-info/JobLevelapi/?job__j_rec_id=${JobID}`,
                method: "GET",
            }),
        }),




    }),
});

export const {
    useGetUserQuery,
    useGetEmployeeReferenceQuery, useDeleteEmployeeReferenceMutation, usePostEmployeeReferenceMutation, useUpdateEmployeeReferenceMutation,
    useGetEmployeeLevelofSkillQuery,
    useGetEmployeeSkillQuery, usePostEmployeeSkillMutation, useUpdateEmployeeSkillMutation,
    useGetEmployeeTrainingQuery, usePostEmployeeTrainingMutation, useDeleteEmployeeSkillMutation, useUpdateEmployeeTrainingMutation, useDeleteEmployeeTrainingMutation,
    useGetEmployeeContactInfoQuery, usePostEmployeeContactInfoMutation, useUpdateEmployeeContactInfoMutation,
    useGetPersonalDocumentsQuery, usePostPersonalDocumentsMutation, useUpdatePersonalDocumentsMutation,
    useGetAddressQuery, usePostAddressMutation, useUpdateAddressMutation, useDeleteAddressMutation, useDeletePersonalDocumentsMutation,
    useGetEmployeDistrictQuery,
    useGetEmployeeTehsilQuery,
    useGetEmployeeCityQuery, useGetPositionbyJobCenterFilterQuery, useGetJobLevelQuery
} = EmployeeMasterDataAPI;
