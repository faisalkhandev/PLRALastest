import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from 'js-cookie'

export const RoleManagement = createApi({
    reducerPath: "RoleManagement",
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
        GroupAPI: builder.query({
            query: () => ({
                url: "/basic-info/GroupAPI/",
                method: "GET",
            }),
        }),

        getModel: builder.query({
            query: ({ accessToken }) => ({
                url: "/basic-info/models/",
                method: "GET",
            }),
        }),

        getGroupByID: builder.query({
            query: ({ id, accessToken }) => ({
                url: `/basic-info/GroupAPI/${id}`,
                method: "GET",
            }),
        }),
        postRole: builder.mutation({
            query: ({ formData, csrfToken }) => ({
                url: "/basic-info/GroupAPI/",
                method: "POST",
                body: formData,
            }),
        }),

        UpdateRole: builder.mutation({
            query: ({ formData, id, csrfToken }) => ({
                url: `/basic-info/GroupAPI/${id}/`,
                method: "PUT",
                body: formData,
            }),
        }),

        deleteRole: builder.mutation({
            query: (id) => ({
                url: `/basic-info/GroupAPI/${id}/`,
                method: "Delete",
            }),
        }),

        getRoutes: builder.query({
            query: ({ accessToken }) => ({
                url: "/basic-info/routes/",
                method: "GET",
                headers: {
                    Authorization: `Token  ${accessToken}`,
                },
            }),
        }),
    })
});

export const {
    useGroupAPIQuery,
    useGetModelQuery,
    useGetGroupByIDQuery,
    usePostRoleMutation,
    useUpdateRoleMutation,
    useDeleteRoleMutation,
    useGetRoutesQuery,
} = RoleManagement;
