import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from 'js-cookie'

export const RoleManagement = createApi({
    reducerPath: "RoleManagement",
    baseQuery: fetchBaseQuery({
        baseUrl: "http://127.0.0.1:8000/",
        prepareHeaders: (headers, { getState }) => {
            const authToken = sessionStorage.getItem("authToken");
            const csrfToken = Cookies.get("csrftoken"); 
            if (authToken) {
                headers.set("Authorization", `Token ${authToken}`);
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
                headers: {
                    Authorization: `Token  ${accessToken}`,
                },
            }),
        }),

        getGroupByID: builder.query({
            query: ({ id, accessToken }) => ({
                url: `/basic-info/GroupAPI/${id}`,
                method: "GET",
                headers: {
                    Authorization: `Token  ${accessToken}`,
                },
            }),
        }),
        postRole: builder.mutation({
            query: ({ formData, csrfToken }) => ({
                url: "/basic-info/GroupAPI/",
                method: "POST",
                body: formData,
                headers: {
                    "X-CSRFToken": csrfToken,
                },
            }),
        }),

        UpdateRole: builder.mutation({
            query: ({ formData, id, csrfToken }) => ({
                url: `/basic-info/GroupAPI/${id}/`,
                method: "PUT",
                body: formData,
                headers: {
                    "X-CSRFToken": csrfToken,
                },
            }),
        }),

        deleteRole: builder.mutation({
            query: ({ RoleID, csrfToken }) => ({
                url: `/basic-info/GroupAPI/${RoleID}`,
                method: "Delete",
                headers: {
                    "X-CSRFToken": csrfToken,
                },
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
