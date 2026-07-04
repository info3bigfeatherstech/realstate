import { createApi } from "@reduxjs/toolkit/query/react";
import axiosInstance from "../../../../SERVICES/Axiosinstance";
import { eliteServiceApi } from "../EliteServiceApi/eliteServiceApi";

const axiosBaseQuery = () => async ({ url, method, body, params, headers }) => {
  try {
    const config = { url, method, data: body, params, headers: { ...headers } };
    const response = await axiosInstance(config);
    return { data: response.data };
  } catch (error) {
    return { error: { status: error.response?.status, data: error.response?.data } };
  }
};

export const eliteConfigApi = createApi({
  reducerPath: "eliteConfigApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["EliteServiceRole"],
  endpoints: (builder) => ({
    getEliteRoles: builder.query({
      query: () => ({ url: "/admin/elite/roles", method: "GET" }),
      transformResponse: (response) => response.data?.roles || [],
      providesTags: [{ type: "EliteServiceRole", id: "LIST" }],
    }),

    addEliteRole: builder.mutation({
      query: (role) => ({
        url: "/admin/elite/roles",
        method: "POST",
        body: { role },
      }),
      transformResponse: (response) => response.data?.roles || [],
      invalidatesTags: [{ type: "EliteServiceRole", id: "LIST" }],
    }),

    updateEliteRole: builder.mutation({
      query: ({ oldRole, newRole }) => ({
        url: "/admin/elite/roles",
        method: "PUT",
        body: { oldRole, newRole },
      }),
      transformResponse: (response) => response.data?.roles || [],
      invalidatesTags: [{ type: "EliteServiceRole", id: "LIST" }],
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        await queryFulfilled;
        dispatch(eliteServiceApi.util.invalidateTags([{ type: "EliteService", id: "LIST" }]));
      },
    }),

    deleteEliteRole: builder.mutation({
      query: (roleName) => ({
        url: `/admin/elite/roles/${encodeURIComponent(roleName)}`,
        method: "DELETE",
      }),
      transformResponse: (response) => response.data?.roles || [],
      invalidatesTags: [{ type: "EliteServiceRole", id: "LIST" }],
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        await queryFulfilled;
        dispatch(eliteServiceApi.util.invalidateTags([{ type: "EliteService", id: "LIST" }]));
      },
    }),
  }),
});

export const {
  useGetEliteRolesQuery,
  useAddEliteRoleMutation,
  useUpdateEliteRoleMutation,
  useDeleteEliteRoleMutation,
} = eliteConfigApi;
