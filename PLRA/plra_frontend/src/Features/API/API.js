import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from 'js-cookie'

export const api = createApi({
  reducerPath: "api",
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
    //Family
    getFamilyInformation: builder.query({
      query: (id) => ({
        url: `/master-data/familyinformation/?employee__id=${id}`,
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
      query: ({ selectRowID, updateFamilyInformation }) => ({
        url: `/master-data/familyinformation/${selectRowID}/`,
        method: "PUT",
        body: updateFamilyInformation,
      }),
    }),
    deleteFamilyInformation: builder.mutation({
      query: ({ selectRowID }) => ({
        url: `/master-data/familyinformation/${selectRowID}/`,
        method: "DELETE",
      }),
    }),
    // WING API's
    getWing: builder.query({
      query: () => ({
        url: "/basic-info/wing/",
        method: "GET",
      }),
    }),
    postWing: builder.mutation({
      query: (data) => ({
        url: "/basic-info/wing/",
        method: "POST",
        body: data,
      }),
    }),
    updateWing: builder.mutation({
      query: ({ selectRowID, updateWingData }) => ({
        url: `/basic-info/wing/${selectRowID}/`,
        method: "PUT",
        body: updateWingData,
      }),
    }),
    deleteWing: builder.mutation({
      query: ({ selectRowID }) => ({
        url: `/basic-info/wing/${selectRowID}/`,
        method: "DELETE",
      }),
    }),

    // SubWing API's
    getSubWing: builder.query({
      query: () => ({
        url: "/basic-info/subwing/",
        method: "GET",
      }),
    }),
    getSubWingID: builder.query({
      query: ({ selectedWing }) => ({
        url: `/basic-info/subwing/?wing__w_rec_id=${selectedWing}`,
        method: "GET",
      }),
    }),
    postSubWing: builder.mutation({
      query: (SWData) => ({
        url: "/basic-info/subwing/",
        method: "POST",
        body: SWData,
      }),
    }),
    updateSubWing: builder.mutation({
      query: ({ selectRowID, updateSubWingData }) => ({
        url: `/basic-info/subwing/${selectRowID}/`,
        method: "PUT",
        body: updateSubWingData,
      }),
    }),
    deleteSubWing: builder.mutation({
      query: ({ selectRowID }) => ({
        url: `/basic-info/subwing/${selectRowID}/`,
        method: "DELETE",
      }),
    }),

    // PPG_level API's
    getPpgLevel: builder.query({
      query: () => ({
        url: "/basic-info/ppglevelsetup/",
        method: "GET",
      }),
    }),
    postPpgLevel: builder.mutation({
      query: (formData) => ({
        url: "/basic-info/ppglevelsetup/",
        method: "POST",
        body: formData,
      }),
    }),
    updatePpgLevel: builder.mutation({
      query: ({ selectRowID, updatePpgData }) => ({
        url: `/basic-info/ppglevelsetup/${selectRowID}/`,
        method: "PUT",
        body: updatePpgData,
      }),
    }),
    deletePpgLevel: builder.mutation({
      query: ({ selectRowID }) => ({
        url: `/basic-info/ppglevelsetup/${selectRowID}/`,
        method: "DELETE",
      }),
    }),


    // Region Api's
    getRegion: builder.query({
      query: () => ({
        url: "/basic-info/region/",
        method: "GET",
      }),
    }),
    postRegion: builder.mutation({
      query: (formData) => ({
        url: "/basic-info/region/",
        method: "POST",
        body: formData,
      }),
    }),
    updateRegion: builder.mutation({
      query: ({ selectRowID, updateRegionData }) => ({
        url: `/basic-info/region/${selectRowID}/`,
        method: "PUT",
        body: updateRegionData,
      }),
    }),
    deleteRegion: builder.mutation({
      query: ({ selectRowID }) => ({
        url: `/basic-info/region/${selectRowID}/`,
        method: "DELETE",
      }),
    }),




    //Division's Api
    getDivision: builder.query({
      query: () => ({
        url: `/basic-info/Division/`,
        method: "GET",
      }),
    }),
    getDivisionID: builder.query({
      query: ({ selectRegion }) => ({
        url: `/basic-info/Division/?region__r_rec_id=${selectRegion}`,
        method: "GET",
      }),
    }),

    postDivision: builder.mutation({
      query: (formData) => ({
        url: "/basic-info/Division/",
        method: "POST",
        body: formData,
      }),
    }),
    updateDivision: builder.mutation({
      query: ({ selectRowID, updateDivisionData }) => ({
        url: `/basic-info/Division/${selectRowID}/`,
        method: "PUT",
        body: updateDivisionData,
      }),
    }),
    deleteDivision: builder.mutation({
      query: ({ selectRowID }) => ({
        url: `/basic-info/Division/${selectRowID}/`,
        method: "DELETE",
      }),
    }),



    // Tehsil Api's
    getTehsil: builder.query({
      query: () => ({
        url: "/basic-info/tehsil/",
        method: "GET",
      }),
    }),
    getTehsilID: builder.query({
      query: ({ selectDistrict }) => ({
        url: `/basic-info/tehsil/?district__district_rec_id=${selectDistrict}`,
        method: "GET",
      }),
    }),

    postTehsil: builder.mutation({
      query: (formData) => ({
        url: "/basic-info/tehsil/",
        method: "POST",
        body: formData,
      }),
    }),
    updateTehsil: builder.mutation({
      query: ({ selectRowID, updateTehsilData }) => ({
        url: `/basic-info/tehsil/${selectRowID}/`,
        method: "PUT",
        body: updateTehsilData,
      }),
    }),
    deleteTehsil: builder.mutation({
      query: ({ selectRowID }) => ({
        url: `/basic-info/tehsil/${selectRowID}/`,
        method: "DELETE",
      }),
    }),

    //Center's Api
    getCenter: builder.query({
      query: () => ({
        url: `/basic-info/center/`,
        method: "GET",
      }),
    }),
    postCenter: builder.mutation({
      query: (formData) => ({
        url: "/basic-info/center/",
        method: "POST",
        body: formData,
      }),
    }),
    updateCenter: builder.mutation({
      query: ({ selectRowID, updateCenterData }) => ({
        url: `/basic-info/center/${selectRowID}/`,
        method: "PUT",
        body: updateCenterData,
      }),
    }),
    deleteCenter: builder.mutation({
      query: ({ selectRowID }) => ({
        url: `/basic-info/center/${selectRowID}/`,
        method: "DELETE",
      }),
    }),



    // District API's
    getDistrict: builder.query({
      query: () => ({
        url: "/basic-info/District/",
        method: "GET",
      }),
    }),
    getDistrictID: builder.query({
      query: ({ selectDivision }) => ({
        url: `/basic-info/District/?division__d_rec_id=${selectDivision}`,
        method: "GET",
      }),
    }),
    postDistrict: builder.mutation({
      query: (formdata) => ({
        url: "/basic-info/District/",
        method: "POST",
        body: formdata,
      }),
    }),
    updateDistrict: builder.mutation({
      query: ({ selectRowID, updateDistrictData }) => ({
        url: `/basic-info/District/${selectRowID}/`,
        method: "PUT",
        body: updateDistrictData,
      }),
    }),
    deleteDistrict: builder.mutation({
      query: ({ selectRowID }) => ({
        url: `/basic-info/District/${selectRowID}/`,
        method: "DELETE",
      }),
    }),
    //EmployeeTitle
    getEmployeeTitle: builder.query({
      query: () => ({
        url: "/basic-info/employee_title/",
        method: "GET",
      }),
    }),
    postEmployeeTitle: builder.mutation({
      query: (formData) => ({
        url: "/basic-info/employee_title/",
        method: "POST",
        body: formData,
      }),
    }),
    updateEmployeeTitle: builder.mutation({
      query: ({ selectRowID, updateEmployeeData }) => ({
        url: `/basic-info/employee_title/${selectRowID}/`,
        method: "PUT",
        body: updateEmployeeData,
      }),
    }),
    deleteEmployeeTitle: builder.mutation({
      query: ({ selectRowID }) => ({
        url: `/basic-info/employee_title/${selectRowID}/`,
        method: "DELETE",
      }),
    }),

    //JobLevel Api's
    getJobLevel: builder.query({
      query: () => ({
        url: "/basic-info/JobLevelapi/",
        method: "GET",
      }),
    }),
    getJobLevelID: builder.query({
      query: ({ selectedJob }) => ({
        url: `/basic-info/JobLevelapi/?job__j_rec_id=${selectedJob}`,
        method: "GET",
      }),
    }),
    postJobLevel: builder.mutation({
      query: (formData) => ({
        url: "/basic-info/JobLevelapi/",
        method: "POST",
        body: formData,
      }),
    }),
    updateJobLevel: builder.mutation({
      query: ({ selectRowID, updateJobLevelData }) => ({
        url: `/basic-info/JobLevelapi/${selectRowID}/`,
        method: "PUT",
        body: updateJobLevelData,
      }),
    }),
    deleteJobLevel: builder.mutation({
      query: ({ selectRowID }) => ({
        url: `/basic-info/JobLevelapi/${selectRowID}/`,
        method: "DELETE",
      }),
    }),

    //personal information
    getPersonalInformation: builder.query({
      query: (id) => ({
        url: `/master-data/personalinformation/${id}/`,
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
      query: ({ selectRowID, updatePersonalData }) => ({
        url: `/master-data/personalinformation/${selectRowID}/`,
        method: "PUT",
        body: updatePersonalData,
      }),
    }),

    //Employee
    //Employee
    getEmployee: builder.query({
      query: (id) => ({
        url: `/basic-info/User/${id}`,
        method: "GET",
      }),
    }),
    getAllEmployee: builder.query({
      query: () => ({
        url: "basic-info/User/",
        method: "GET",
      }),
    }),
    postEmployee: builder.mutation({
      query: (formD) => ({
        url: "/basic-info/User/",
        method: "POST",
        body: formD,
      }),
    }),
    updateEmployee: builder.mutation({
      query: ({ id, formD }) => ({
        url: `/basic-info/User/${id}/`,
        method: "PUT",
        body: formD,
      }),
    }),
    deleteEmployee: builder.mutation({
      query: ({ id }) => ({
        url: `/basic-info/User/${id}/`,
        method: "DELETE",
      }),
    }),
    //PositionType
    getPositionType: builder.query({
      query: () => ({
        url: "/basic-info/positiontypes/",
        method: "GET",
      }),
    }),
    postPositionType: builder.mutation({
      query: (formData) => ({
        url: "/basic-info/positiontypes/",
        method: "POST",
        body: formData,
      }),
    }),
    updatePositionType: builder.mutation({
      query: ({ selectRowID, updatePositionTypeData }) => ({
        url: `/basic-info/positiontypes/${selectRowID}/`,
        method: "PUT",
        body: updatePositionTypeData,
      }),
    }),
    deletePositionType: builder.mutation({
      query: ({ selectRowID }) => ({
        url: `/basic-info/positiontypes/${selectRowID}/`,
        method: "DELETE",
      }),
    }),

    //Job
    getJob: builder.query({
      query: () => ({
        url: "/basic-info/job/",
        method: "GET",
      }),
    }),



    postJob: builder.mutation({
      query: (formData) => ({
        url: "/basic-info/job/",
        method: "POST",
        body: formData,
      }),
    }),
    updateJob: builder.mutation({
      query: ({ selectRowID, updateJobData }) => ({
        url: `/basic-info/job/${selectRowID}/`,
        method: "PUT",
        body: updateJobData,
      }),
    }),
    deleteJob: builder.mutation({
      query: ({ selectRowID }) => ({
        url: `/basic-info/job/${selectRowID}/`,
        method: "DELETE",
      }),
    }),

    //position
    getPosition: builder.query({
      query: () => ({
        url: "/basic-info/position/?position_id__contains=_unique",
        method: "GET",
      }),
    }),
    getAllPosition: builder.query({
      query: ({ jobid, active }) => ({
        url: `/basic-info/position/?job__j_rec_id=${jobid}&open_position=${active}`,
        method: "GET",
      }),
    }),

    postPosition: builder.mutation({
      query: (formData) => ({
        url: "/basic-info/position/",
        method: "POST",
        body: formData,
      }),
    }),
    updatePosition: builder.mutation({
      query: ({ selectRowID, updatePositionData }) => ({
        url: `/basic-info/position/${selectRowID}/`,
        method: "PUT",
        body: updatePositionData,
      }),
    }),
    deletePosition: builder.mutation({
      query: ({ selectRowID }) => ({
        url: `/basic-info/position/${selectRowID}/`,
        method: "DELETE",
      }),
    }),




    updatePpgLevel: builder.mutation({
      query: ({ selectRowID, updatePpgData }) => ({
        url: `/basic-info/ppglevelsetup/${selectRowID}/`,
        method: "PUT",
        body: updatePpgData,
      }),
    }),

    //Region API's
    getRegion: builder.query({
      query: () => ({
        url: "/basic-info/region/",
        method: "GET",
      }),
    }),
    postRegion: builder.mutation({
      query: (formData) => ({
        url: "/basic-info/region/",
        method: "POST",
        body: formData,
      }),
    }),
    updateRegion: builder.mutation({
      query: ({ selectRowID, updateRegionData }) => ({
        url: `/basic-info/region/${selectRowID}/`,
        method: "PUT",
        body: updateRegionData,
      }),
    }),

    //Division API's
    getDivision: builder.query({
      query: () => ({
        url: "/basic-info/Division/",
        method: "GET",
      }),
    }),
    postDivision: builder.mutation({
      query: (formData) => ({
        url: "/basic-info/Division/",
        method: "POST",
        body: formData,
      }),
    }),
    updateDivision: builder.mutation({
      query: ({ selectRowID, updateDivisionData }) => ({
        url: `/basic-info/Division/${selectRowID}/`,
        method: "PUT",
        body: updateDivisionData,
      }),
    }),

    //EmployeeTitle

    getEmployeeTitle: builder.query({
      query: () => ({
        url: "/basic-info/employee_title/",
        method: "GET",
      }),
    }),
    postEmployeeTitle: builder.mutation({
      query: (formData) => ({
        url: "/basic-info/employee_title/",
        method: "POST",
        body: formData,
      }),
    }),
    updateEmployeeTitle: builder.mutation({
      query: ({ selectRowID, updateEmployeeData }) => ({
        url: `/basic-info/employee_title/${selectRowID}/`,
        method: "PUT",
        body: updateEmployeeData,
      }),
    }),
    deleteEmployeeTitle: builder.mutation({
      query: ({ selectRowID }) => ({
        url: `/basic-info/employee_title/${selectRowID}/`,
        method: "DELETE",
      }),
    }),

    //PositionType
    getPositionType: builder.query({
      query: () => ({
        url: "/basic-info/positiontypes/",
        method: "GET",
      }),
    }),
    postPositionType: builder.mutation({
      query: (formData) => ({
        url: "/basic-info/positiontypes/",
        method: "POST",
        body: formData,
      }),
    }),
    updatePositionType: builder.mutation({
      query: ({ selectRowID, updatePositionTypeData }) => ({
        url: `/basic-info/positiontypes/${selectRowID}/`,
        method: "PUT",
        body: updatePositionTypeData,
      }),
    }),

    //JobLevelValidityAPI
    getJobLevelValidity: builder.query({
      query: () => ({
        url: "/basic-info/JobLevelValidityAPI/",
        method: "GET",
      }),
    }),
    postJobLevelValidity: builder.mutation({
      query: (formData) => ({
        url: "/basic-info/JobLevelValidityAPI/",
        method: "POST",
        body: formData,
      }),
    }),
    deleteJobLevelValidity: builder.mutation({
      query: ({ selectRowID }) => ({
        url: `/basic-info/JobLevelValidityAPI/${selectRowID}/`,
        method: "DELETE",
      }),
    }),
    updateJobLevelValidity: builder.mutation({
      query: ({ selectRowID, updateJobLevelValidityData }) => ({
        url: `/basic-info/JobLevelValidityAPI/${selectRowID}/`,
        method: "PUT",
        body: updateJobLevelValidityData,
      }),
    }),
    deleteJobLevelValidity: builder.mutation({
      query: ({ selectRowID }) => ({
        url: `/basic-info/JobLevelValidityAPI/${selectRowID}/`,
        method: "DELETE",
      }),
    }),



    //ApprovalMatrixAPI
    getApprovalMatrixAPI: builder.query({
      query: () => ({
        url: "/basic-info/ApprovalMatrixAPI/",
        method: "GET",
      }),
    }),
    postApprovalMatrixAPI: builder.mutation({
      query: (formData) => ({
        url: `/basic-info/ApprovalMatrixAPI/`,
        method: "POST",
        body: formData,
      }),
    }),
    updateApprovalMatrixAPI: builder.mutation({
      query: ({ selectRowID, updateApprovalMatrix }) => ({
        url: `/basic-info/ApprovalMatrixAPI/${selectRowID}/`,
        method: "PUT",
        body: updateApprovalMatrix,
      }),
    }),
    deleteApprovalMatrixAPI: builder.mutation({
      query: ({ selectRowID }) => ({
        url: `/basic-info/ApprovalMatrixAPI/${selectRowID}/`,
        method: "DELETE",
      }),
    }),
    deleteApprovalMatrixAPI: builder.mutation({
      query: ({ selectRowID }) => ({
        url: `/basic-info/ApprovalMatrixAPI/${selectRowID}/`,
        method: "DELETE",
      }),
    }),
    deleteApprovalMatrixAPI: builder.mutation({
      query: ({ selectRowID }) => ({
        url: `/basic-info/ApprovalMatrixAPI/${selectRowID}/`,
        method: "DELETE",
      }),
    }),

    //HolidaysAPI
    getHolidays: builder.query({
      query: () => ({
        url: "/basic-info/ApprovalMatrixAPI/",
        method: "GET",
      }),
    }),
    postHolidays: builder.mutation({
      query: (formData) => ({
        url: `/basic-info/ApprovalMatrixAPI/`,
        method: "POST",
        body: formData,
      }),
    }),
    updateHolidays: builder.mutation({
      query: ({ selectRowID, updatePositionAssignmentData }) => ({
        url: `/basic-info/ApprovalMatrixAPI/${selectRowID}/`,
        method: "PUT",
        body: updatePositionAssignmentData,
      }),
    }),




    //Job
    getJob: builder.query({
      query: () => ({
        url: "/basic-info/job/",
        method: "GET",
      }),
    }),
    postJob: builder.mutation({
      query: (formData) => ({
        url: "/basic-info/job/",
        method: "POST",
        body: formData,
      }),
    }),
    updateJob: builder.mutation({
      query: ({ selectRowID, updateJobData }) => ({
        url: `/basic-info/job/${selectRowID}/`,
        method: "PUT",
        body: updateJobData,
      }),
    }),

    // //position
    // getPosition: builder.query({
    //   query: () => ({
    //     url: "/basic-info/position/",
    //     method: "GET",
    //   }),
    // }),
    // postPosition: builder.mutation({
    //   query: (formData) => ({
    //     url: "/basic-info/position/",
    //     method: "POST",
    //     body: formData,
    //   }),
    // }),
    // updatePosition: builder.mutation({
    //   query: ({ selectRowID, updatePositionData }) => ({
    //     url: `/basic-info/position/${selectRowID}/`,
    //     method: "PUT",
    //     body: updatePositionData,
    //   }),
    // }),

    // _level API's                                  PPg is pending.
    getJobLevel: builder.query({
      query: () => ({
        url: "/basic-info/JobLevelapi/",
        method: "GET",
      }),
    }),
    postJobLevel: builder.mutation({
      query: (formData) => ({
        url: "/basic-info/JobLevelapi/",
        method: "POST",
        body: formData,
      }),
    }),
    updateJobLevel: builder.mutation({
      query: ({ selectRowID, updateJobData }) => ({
        url: `//basic-info/JobLevelapi/${selectRowID}/`,
        method: "PUT",
        body: updateJobData,
      }),
    }),
    deleteJobLevel: builder.mutation({
      query: ({ selectRowID }) => ({
        url: `//basic-info/JobLevelapi/${selectRowID}/`,
        method: "DELETE",
      }),
    }),

    //AAR prescribedForm
    getAaRprescribedForm: builder.query({
      query: () => ({
        url: "/annual-assessment/aar-prescribed-forms/",
        method: "GET",
      }),
    }),
    postAaRprescribedForm: builder.mutation({
      query: (formData) => ({
        url: "/annual-assessment/aar-prescribed-forms/",
        method: "POST",
        body: formData,
      }),
    }),
    updateAaRprescribedForm: builder.mutation({
      query: ({ selectRowID, updateAaRprescribedForm }) => ({
        url: `/annual-assessment/aar-prescribed-forms/${selectRowID}/`,
        method: "PUT",
        body: updateAaRprescribedForm,
      }),
    }),
    deleteAaRprescribedForm: builder.mutation({
      query: ({ selectRowID }) => ({
        url: `/annual-assessment/aar-prescribed-forms/${selectRowID}/`,
        method: "DELETE",
      }),
    }),

    //AAR Process
    getAarProcess: builder.query({
      query: () => ({
        url: "/annual-assessment/aar-processes/",
        method: "GET",
      }),
    }),
    postAarProcess: builder.mutation({
      query: (formData) => ({
        url: "/annual-assessment/aar-processes/",
        method: "POST",
        body: formData,
      }),
    }),
    updateAarProcess: builder.mutation({
      query: ({ selectRowID, updatetAarProcess }) => ({
        url: `/annual-assessment/aar-processes/${selectRowID}/`,
        method: "PUT",
        body: updatetAarProcess,
      }),
    }),
    deleteAarProcess: builder.mutation({
      query: ({ selectRowID }) => ({
        url: `/annual-assessment/aar-processes/${selectRowID}/`,
        method: "DELETE",
      }),
    }),

    //AAR Process Hos
    getAarProcessHos: builder.query({
      query: () => ({
        url: "/annual-assessment/aar-process-hos/",
        method: "GET",
      }),
    }),
    postAarProcessHos: builder.mutation({
      query: (formData) => ({
        url: "/annual-assessment/aar-process-hos/",
        method: "POST",
        body: formData,
      }),
    }),
    updateAarProcessHos: builder.mutation({
      query: ({ selectRowID, updatetAarProcessHos }) => ({
        url: `/annual-assessment/aar-process-hos/${selectRowID}/`,
        method: "PUT",
        body: updatetAarProcessHos,
      }),
    }),

    deleteAarProcessHos: builder.mutation({
      query: ({ selectRowID }) => ({
        url: `/annual-assessment/aar-process-hos/${selectRowID}/`,
        method: "DELETE",
      }),
    }),

    //PositionLevelAssignment


    getPositionAssignment: builder.query({
      query: (id) => ({
        url: `/basic-info/PositionAssignmentAPI/?employee__id=${id}`,
        method: "GET",
      }),
    }),
    getJobPositionAssignment: builder.query({
      query: ({ employeeId }) => ({
        url: `/basic-info/PositionAssignmentAPI/?employee__id=${employeeId}`,
        method: "GET",
      }),
    }),

    postPositionAssignment: builder.mutation({
      query: (formData) => ({
        url: "/basic-info/PositionAssignmentAPI/",
        method: "POST",
        body: formData,
      }),
    }),

    updatePositionAssignment: builder.mutation({
      query: ({ selectRowID, formPositionData }) => ({
        url: `/basic-info/PositionAssignmentAPI/${selectRowID}/`,
        method: "PUT",
        body: formPositionData,
      }),
    }),
    deletePositionAssignment: builder.mutation({
      query: ({ selectRowID }) => ({
        url: `/basic-info/PositionAssignmentAPI/${selectRowID}/`,
        method: "DELETE",
      }),
    }),
    //JobLevelAssignment

    getJobLevelAssignment: builder.query({
      query: (id) => ({
        url: `/basic-info/JobLevelAssignmentAPI/?employee__id=${id}`,
        method: "GET",
      }),
    }),

    postJobLevelAssignment: builder.mutation({
      query: ({ formData }) => ({
        url: "/basic-info/JobLevelAssignmentAPI/",
        method: "POST",
        body: formData,
      }),
    }),
    postJobLevelAssignmentforPosition: builder.mutation({
      query: (formJoblevelAssignmentData) => ({
        url: "/basic-info/JobLevelAssignmentAPI/",
        method: "POST",
        body: formJoblevelAssignmentData,
      }),
    }),
    updateJobLevelAssignment: builder.mutation({
      query: ({ selectedJobId, formJoblevelAssignmentData }) => ({
        url: `/basic-info/JobLevelAssignmentAPI/${selectedJobId}/`,

        method: "PUT",

        body: formJoblevelAssignmentData,
      }),
    }),
    deleteJobLevelAssignment: builder.mutation({
      query: ({ selectedJobId }) => ({
        url: `/basic-info/JobLevelAssignmentAPI/${selectedJobId}/`,
        method: "DELETE",
      }),
    }),
    //Rating Model Assignment
    getRatingModelAssignments: builder.query({
      query: () => ({
        url: "/annual-assessment/rating-model-assignments/",
        method: "GET",
      }),
    }),
    postRatingModelAssignments: builder.mutation({
      query: (formData) => ({
        url: "/annual-assessment/rating-model-assignments/",
        method: "POST",
        body: formData,
      }),
    }),
    updateRatingModelAssignments: builder.mutation({
      query: ({ selectRowID, updatetRatingModelAssignment }) => ({
        url: `/annual-assessment/rating-model-assignments/${selectRowID}/`,
        method: "PUT",
        body: updatetRatingModelAssignment,
      }),
    }),
    deleteRatingModelAssignments: builder.mutation({
      query: ({ selectRowID }) => ({
        url: `/annual-assessment/rating-model-assignments/${selectRowID}/`,
        method: "DELETE",
      }),
    }),


    //Rating Type Point
    getRatingTypePoints: builder.query({
      query: () => ({
        url: "/annual-assessment/rating-type-points/",
        method: 'GET'
      })
    }),
    postRatingTypePoints: builder.mutation({
      query: (formData) => ({
        url: "/annual-assessment/rating-type-points/",
        method: "POST",
        body: formData,
      }),
    }),
    updateRatingTypePoints: builder.mutation({
      query: ({ selectRowID, updatetRatingTypePointsData }) => ({
        url: `/annual-assessment/rating-type-points/${selectRowID}/`,
        method: "PUT",
        body: updatetRatingTypePointsData,
      }),
    }),

    //Rating Type Point Assignment
    getRatingTypePointAssignment: builder.query({
      query: () => ({
        url: "/annual-assessment/rating-type-points-assignments/",
        method: 'GET'
      })
    }),
    postRatingTypePointAssignment: builder.mutation({
      query: (formData) => ({
        url: "/annual-assessment/rating-type-points-assignments/",
        method: "POST",
        body: formData,
      }),
    }),
    updateRatingTypePointAssignment: builder.mutation({
      query: ({ selectRowID, updatetRatingTypePointAssignmentData }) => ({
        url: `/annual-assessment/rating-type-points-assignments/${selectRowID}/`,
        method: "PUT",
        body: updatetRatingTypePointAssignmentData,
      }),
    }),

    //Rating Model Type
    getRatingModelTypes: builder.query({
      query: () => ({
        url: "/annual-assessment/rating-model-types/",
        method: "GET",
      }),
    }),
    postRatingModelTypes: builder.mutation({
      query: (formData) => ({
        url: "/annual-assessment/rating-model-types/",
        method: "POST",
        body: formData,
      }),
    }),
    updateRatingModelTypes: builder.mutation({
      query: ({ selectRowID, updateRatingModelTypes }) => ({
        url: `/annual-assessment/rating-model-types/${selectRowID}/`,
        method: "PUT",
        body: updateRatingModelTypes,
      }),
    }),
    deleteRatingModelTypes: builder.mutation({
      query: ({ selectRowID }) => ({
        url: `/annual-assessment/rating-model-types/${selectRowID}/`,
        method: "DELETE",
      }),
    }),
    //Add HR Celander Year
    getHRCalendarYear: builder.query({
      query: () => ({
        url: "/hr-celander/hr-celander-year/",
        method: "GET",
      }),
    }),

    postHRCalendarYear: builder.mutation({
      query: (formData) => ({
        url: "/hr-celander/hr-celander-year/",
        method: "POST",
        body: formData,
      }),
    }),

    updateHRCalendarYear: builder.mutation({
      query: ({ selectRowID, updateHRCalendarYearData }) => ({
        url: `/hr-celander/hr-celander-year/${selectRowID}/`,
        method: "PUT",
        body: updateHRCalendarYearData,
      }),
    }),
    deleteHRCalendarYear: builder.mutation({
      query: ({ selectRowID }) => ({
        url: `/hr-celander/hr-celander-year/${selectRowID}/`,
        method: "DELETE",
      }),
    }),

    deleteHRCalendarYear: builder.mutation({
      query: ({ selectRowID }) => ({
        url: `/hr-celander/hr-celander-year/${selectRowID}/`,
        method: "DELETE",
      }),
    }),
    //Rating Model
    getRatingModel: builder.query({
      query: () => ({
        url: "/annual-assessment/rating-models/",
        method: "GET",
      }),
    }),

    postRatingModel: builder.mutation({
      query: (formData) => ({
        url: "/annual-assessment/rating-models/",
        method: "POST",
        body: formData,
      }),
    }),

    updateRatingModel: builder.mutation({
      query: ({ selectRowID, updateRatingModelData }) => ({
        url: `/annual-assessment/rating-models/${selectRowID}/`,
        method: "PUT",
        body: updateRatingModelData,
      }),
    }),
    //Rating Type Likert Scales

    getRatingTypeLikertScales: builder.query({
      query: () => ({
        url: "/annual-assessment/rating-type-likert-scales/",
        method: "GET",
      }),
    }),

    postRatingTypeLikertScales: builder.mutation({
      query: (formData) => ({
        url: "/annual-assessment/rating-type-likert-scales/",
        method: "POST",
        body: formData,
      }),
    }),

    updateRatingTypeLikertScales: builder.mutation({
      query: ({ selectRowID, updateRatingTypeLikertScalesData }) => ({
        url: `/annual-assessment/rating-type-likert-scales/${selectRowID}/`,
        method: "PUT",
        body: updateRatingTypeLikertScalesData,
      }),
    }),
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


    //Leave Apply
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

    //Employee Master Data
    //Level of Education Api
    getLevelOfEducation: builder.query({
      query: () => ({
        url: `/master-data/level_of_education/`,
        method: "GET",
      }),
    }),

    postLevelOfEducation: builder.mutation({
      query: (formData) => ({
        url: `/master-data/level_of_education/`,
        method: "POST",
        body: formData,
      }),
    }),

    updateLevelOfEducation: builder.mutation({
      query: ({ selectRowID, updateLevelOfEducationData }) => ({
        url: `/master-data/level_of_education/${selectRowID}/`,
        method: "PUT",
        body: updateLevelOfEducationData,
      }),
    }),

    //Education Api

    getEducation: builder.query({
      query: (id) => ({
        url: `/master-data/education/?employee__id=${id}`,
        method: "GET",
      }),
    }),
    postEducation: builder.mutation({
      query: (formData) => ({
        url: "/master-data/education/",
        method: "POST",
        body: formData,
      }),
    }),
    updateEducation: builder.mutation({
      query: ({ selectRowID, educationData }) => ({
        url: `/master-data/education/${selectRowID}/`,
        method: "PUT",
        body: educationData,
      }),
    }),

    deleteEducation: builder.mutation({
      query: ({ selectRowID }) => ({
        url: `/master-data/education/${selectRowID}/`,
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

    // Country  API
    getCountry: builder.query({
      query: () => ({
        url: `/master-data/countries/`,
        method: "GET",
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
    //Employement History
    getEmployementHistory: builder.query({
      query: (id) => ({
        url: `/master-data/employmenthistory/?employee__id=${id}`,
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
    deleteEmployementHistory: builder.mutation({
      query: ({ selectRowID }) => ({
        url: `/master-data/employmenthistory/${selectRowID}/`,
        method: "DELETE",
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
      query: (id) => ({
        url: `/master-data/EmployeeContactInformation/?employee__id=${id}`,
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
    deleteContactInformation: builder.mutation({
      query: ({ selectRowID }) => ({
        url: `/master-data/EmployeeContactInformation/${selectRowID}/`,
        method: "DELETE",
      }),
    }),

    //Personal Information
    getPersonalInformation: builder.query({
      query: (id) => ({
        url: `/master-data/personalinformation/?employee__id=${id}`,
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

    getJobLevelID: builder.query({
      query: ({ selectedJob }) => ({
        url: `/basic-info/JobLevelapi/?job__j_rec_id=${selectedJob}`,
        method: "GET",
      }),
    }),


    getDistrictID: builder.query({
      query: ({ selectDivision }) => ({
        url: `/basic-info/District/?division__d_rec_id=${selectDivision}`,
        method: "GET",
      }),
    }),
    getTehsilID: builder.query({
      query: ({ selectDistrict }) => ({
        url: `/basic-info/tehsil/?district__district_rec_id=${selectDistrict}`,
        method: "GET",
      }),
    }),
    getDivisionID: builder.query({
      query: ({ selectRegion }) => ({
        url: `/basic-info/Division/?region__r_rec_id=${selectRegion}`,
        method: "GET",
      }),
    }),

    //Employee Get APi for Position
    //Employee
    getEmployee: builder.query({
      query: (id) => ({
        url: `/basic-info/User/${id}`,
        method: "GET",
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
    getJobLevelID: builder.query({
      query: ({ JobID }) => ({
        url: `/basic-info/JobLevelapi/?job__j_rec_id=${JobID}`,
        method: "GET",
      }),
    }),
    getJobLevelAssignment: builder.query({
      query: (id) => ({
        url: `/basic-info/JobLevelAssignmentAPI/?employee__id=${id}`,
        method: "GET",
      }),
    }),
    getJob: builder.query({
      query: () => ({
        url: "/basic-info/job/",
        method: "GET",
      }),
    }),
    getJobPositionAssignment: builder.query({
      query: ({ employeeId }) => ({
        url: `/basic-info/PositionAssignmentAPI/?employee__id=${employeeId}`,
        method: "GET",
      }),
    }),
    postPositionAssignment: builder.mutation({
      query: (formPositionData) => ({
        url: "/basic-info/PositionAssignmentAPI/",
        method: "POST",
        body: formPositionData,
      }),
    }),

    updatePositionAssignment: builder.mutation({
      query: ({ selectRowID, formPositionData }) => ({
        url: `/basic-info/PositionAssignmentAPI/${selectRowID}/`,
        method: "PUT",
        body: formPositionData,
      }),
    }),
    deletePositionAssignment: builder.mutation({
      query: ({ selectRowID }) => ({
        url: `/basic-info/PositionAssignmentAPI/${selectRowID}/`,
        method: "DELETE",
      }),
    }),
    postJobLevelAssignmentforPosition: builder.mutation({
      query: (formJoblevelAssignmentData) => ({
        url: "/basic-info/JobLevelAssignmentAPI/",
        method: "POST",
        body: formJoblevelAssignmentData,
      }),
    }),
    updateJobLevelAssignment: builder.mutation({
      query: ({ selectedJobId, formJoblevelAssignmentData }) => ({
        url: `/basic-info/JobLevelAssignmentAPI/${selectedJobId}/`,

        method: "PUT",

        body: formJoblevelAssignmentData,
      }),
    }),
    deleteJobLevelAssignment: builder.mutation({
      query: ({ selectedJobId }) => ({
        url: `/basic-info/JobLevelAssignmentAPI/${selectedJobId}/`,
        method: "DELETE",
      }),
    }),


  }),
});

export const {
  useGetJobLevelIDQuery, useGetDistrictIDQuery, useGetDivisionIDQuery, useGetTehsilIDQuery,
  useGetWingQuery, usePostWingMutation, useUpdateWingMutation, useDeleteWingMutation,
  useGetLeaveTypeDependencyQuery, useGetLeaveTypeDependencyUponQuery,
  useGetJobLevelAssignmentQuery, usePostJobLevelAssignmentMutation, useUpdateJobLevelAssignmentMutation,
  useGetLeaveApplyTimeQuery,
  useGetLeaveTypeSalaryDecductableQuery,
  useGetEmployeeQuery, usePostEmployeeMutation, useUpdateEmployeeMutation,
  useGetSalaryDeductibleQuery, usePostSalaryDeductibleMutation, useUpdateSalaryDeductibleMutation, useDeleteSalaryDeductibleMutation,
  useGetLeaveDependencyQuery, usePostLeaveDependencyMutation, useUpdateLeaveDependencyMutation, useDeleteLeaveDependencyMutation,
  useGetLeaveDependableDetailQuery, usePostLeaveDependableDetailMutation, useUpdateLeaveDependableDetailMutation,
  useGetLeaveDeductionBucketQuery, usePostLeaveDeductionBucketMutation, useUpdateLeaveDeductionBucketMutation,
  useGetLeaveRequestQuery, usePostLeaveRequestMutation, useUpdateLeaveRequestMutation,
  useGetLeaveTypeQuery, usePostLeaveTypeMutation, useUpdateLeaveTypeMutation,
  useGetApprovalMatrixAPIQuery, usePostApprovalMatrixAPIMutation, useUpdateApprovalMatrixAPIMutation,
  useGetPositionAssignmentQuery,
  useGetJobLevelValidityQuery, usePostJobLevelValidityMutation, useUpdateJobLevelValidityMutation,
  useGetSubWingQuery, usePostSubWingMutation, useUpdateSubWingMutation,
  useDeleteSubWingMutation, useGetPpgLevelQuery, usePostPpgLevelMutation,
  useUpdatePpgLevelMutation, useGetRegionQuery, usePostRegionMutation,
  useUpdateRegionMutation, useGetTehsilQuery, usePostTehsilMutation, useDeletePositionAssignmentMutation,
  useUpdateTehsilMutation, useGetDivisionQuery, usePostDivisionMutation, useUpdateDivisionMutation,
  useGetCenterQuery, usePostCenterMutation, useUpdateCenterMutation, useDeleteEmployeeTitleMutation,
  useGetDistrictQuery, usePostDistrictMutation, useUpdateDistrictMutation,
  useGetEmployeeTitleQuery, usePostEmployeeTitleMutation, useUpdateEmployeeTitleMutation, useGetPositionTypeQuery,
  usePostPositionTypeMutation, useUpdatePositionTypeMutation, usePostJobMutation, useUpdateJobMutation, useDeleteJobMutation,
  useGetPositionQuery, usePostPositionMutation, useUpdatePositionMutation, useDeletePositionMutation,
  useGetJobLevelQuery, usePostJobLevelMutation, useUpdateJobLevelMutation, useDeleteJobLevelMutation,
  useGetAaRprescribedFormQuery, usePostAaRprescribedFormMutation, useUpdateAaRprescribedFormMutation, useDeleteAaRprescribedFormMutation,
  useGetAarProcessQuery, usePostAarProcessMutation, useUpdateAarProcessMutation,
  useDeleteAarProcessMutation, useGetAarProcessHosQuery, usePostAarProcessHosMutation, useUpdateAarProcessHosMutation,
  useDeleteAarProcessHosMutation, useGetRatingModelAssignmentsQuery, usePostRatingModelAssignmentsMutation,
  useUpdateRatingModelAssignmentsMutation, useDeleteRatingModelAssignmentsMutation,
  useGetRatingModelQuery, usePostRatingModelMutation, useUpdateRatingModelMutation,
  useDeleteRatingModelMutation, useGetRatingTypePointsQuery, usePostRatingTypePointsMutation, useUpdateRatingTypePointsMutation,
  useDeleteRatingTypePointsMutation, useGetRatingTypeLikertScalesQuery,
  usePostRatingTypeLikertScalesMutation, useUpdateRatingTypeLikertScalesMutation,
  useDeleteRatingTypeLikertScalesMutation, useGetSubWingIDQuery,
  useGetRatingModelTypesQuery, usePostRatingModelTypesMutation, useUpdateRatingModelTypesMutation,
  useDeleteRatingModelTypesMutation, useGetRatingTypePointAssignmentQuery, usePostRatingTypePointAssignmentMutation,
  useUpdateRatingTypePointAssignmentMutation, useDeleteRatingTypePointAssignmentMutation,
  useGetHRCalendarYearQuery, usePostHRCalendarYearMutation, useUpdateHRCalendarYearMutation,
  useGetEducationQuery, usePostEducationMutation, useUpdateEducationMutation,
  useGetLevelOfEducationQuery, usePostLevelOfEducationMutation, useUpdateLevelOfEducationMutation,
  useGetEmployeeReferenceQuery, usePostEmployeeReferenceMutation, useUpdateEmployeeReferenceMutation,
  useGetCityQuery, usePostCityMutation, useUpdateCityMutation, useGetCountryQuery,
  usePostCountryMutation, useUpdateCountryMutation, useGetEmployementHistoryQuery, usePostEmployementHistoryMutation,
  useUpdateEmployementHistoryMutation, useDeleteEmployementHistoryMutation, useGetJobDistrictQuery, usePostJobDistrictMutation,
  useGetContactInformationQuery, usePostContactInformationMutation, useUpdateContactInformationMutation, useDeleteContactInformationMutation, useGetAllEmployeeQuery,
  useGetPersonalInformationQuery, usePostPersonalInformationMutation, useUpdatePersonalInformationMutation, useGetFamilyInformationQuery,
  usePostFamilyInformationMutation, useUpdateFamilyInformationMutation, useDeleteFamilyInformationMutation, useDeletePositionTypeMutation,
  useDeleteApprovalMatrixAPIMutation, useGetJobLevelAssignmentJobLevelQuery, useGetAllPositionQuery, useDeleteCenterMutation, useDeleteJobLevelValidityMutation,
  useGetJobQuery, useGetJobPositionAssignmentQuery, useGetPositionbyJobCenterFilterQuery, useGetWingSubWingQuery, useDeleteRegionMutation, useDeleteDivisionMutation,
  useUpdatePositionAssignmentMutation, usePostJobLevelAssignmentforPositionMutation, usePostPositionAssignmentMutation, useDeleteEducationMutation, useDeleteJobLevelAssignmentMutation, useDeletePpgLevelMutation, useDeleteDistrictMutation, useDeleteTehsilMutation, useDeleteHRCalendarYearMutation

} = api;
