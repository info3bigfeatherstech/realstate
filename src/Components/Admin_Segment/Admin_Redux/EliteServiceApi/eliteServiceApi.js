// src/Admin_Redux/EliteServiceApi/eliteServiceApi.js
import { createApi } from "@reduxjs/toolkit/query/react";
import axiosInstance from "../../../../SERVICES/Axiosinstance";

const axiosBaseQuery = () => async ({ url, method, body, params, headers }) => {
  try {
    const config = { url, method, data: body, params, headers: { ...headers } };
    const response = await axiosInstance(config);
    return { data: response.data };
  } catch (error) {
    return { error: { status: error.response?.status, data: error.response?.data } };
  }
};

export const eliteServiceApi = createApi({
  reducerPath: "eliteServiceApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["EliteService", "EliteServiceDetail"],
  endpoints: (builder) => ({

    // GET /admin/elite-services  (paginated + filtered)
    getEliteServices: builder.query({
      query: (params) => ({ url: "/admin/elite-services", method: "GET", params }),
      transformResponse: (response) => response,
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ _id }) => ({ type: "EliteService", id: _id })),
              { type: "EliteService", id: "LIST" },
            ]
          : [{ type: "EliteService", id: "LIST" }],
    }),

    // GET /admin/elite-services/:id
    getEliteServiceById: builder.query({
      query: (id) => ({ url: `/admin/elite-services/${id}`, method: "GET" }),
      transformResponse: (response) => response.data,
      providesTags: (result, error, id) => [{ type: "EliteServiceDetail", id }],
    }),

    // POST /admin/elite-services
    createEliteService: builder.mutation({
      query: (data) => ({ url: "/admin/elite-services", method: "POST", body: data }),
      transformResponse: (response) => response.data,
      invalidatesTags: [{ type: "EliteService", id: "LIST" }],
    }),

    // PUT /admin/elite-services/:id
    updateEliteService: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/admin/elite-services/${id}`,
        method: "PUT",
        body: data,
      }),
      transformResponse: (response) => response.data,
      invalidatesTags: (result, error, { id }) => [
        { type: "EliteService", id: "LIST" },
        { type: "EliteServiceDetail", id },
      ],
    }),

    // PATCH /admin/elite-services/:id/status
    updateEliteServiceStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/admin/elite-services/${id}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "EliteService", id: "LIST" },
        { type: "EliteServiceDetail", id },
      ],
    }),

    // DELETE /admin/elite-services/:id
    deleteEliteService: builder.mutation({
      query: (id) => ({ url: `/admin/elite-services/${id}`, method: "DELETE" }),
      invalidatesTags: [{ type: "EliteService", id: "LIST" }],
    }),

  }),
});

export const {
  useGetEliteServicesQuery,
  useGetEliteServiceByIdQuery,
  useCreateEliteServiceMutation,
  useUpdateEliteServiceMutation,
  useUpdateEliteServiceStatusMutation,
  useDeleteEliteServiceMutation,
} = eliteServiceApi;