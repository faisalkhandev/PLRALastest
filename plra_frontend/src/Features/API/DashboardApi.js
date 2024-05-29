import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from 'js-cookie'

export const DashboardApi = createApi({
    reducerPath: "DashboardApi",
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

        DashboardProcessCount: builder.query({
            query: () => ({
                url: `/dashboards/process-counts/`,
                method: "GET",
            }),
        }),


        DashboardApprovalCount: builder.query({
            query: () => ({
                url: `/dashboards/approval-counts/`,
                method: "GET",
            }),
        }),
        //  http://127.0.0.1:8000/dashboards/get_dashboard_count/?center=1
        DashboardCard: builder.query({
            query: ({ name, id }) => ({
                url: `/dashboards/get_dashboard_count/?${name}=${id}`,
                method: "GET",
            }),
        }),

    })
})


export const {
    useDashboardProcessCountQuery, useDashboardApprovalCountQuery, useDashboardCardQuery
} = DashboardApi;