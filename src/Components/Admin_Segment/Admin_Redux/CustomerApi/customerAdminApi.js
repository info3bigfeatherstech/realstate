import { createApi } from "@reduxjs/toolkit/query/react";
import axiosInstance from "../../../../SERVICES/Axiosinstance";

const axiosBaseQuery = () => async ({ url, method, body, params, headers }) => {
  try {
    const response = await axiosInstance({ url, method, data: body, params, headers: { ...headers } });
    return { data: response.data };
  } catch (error) {
    return { error: { status: error.response?.status, data: error.response?.data } };
  }
};

export const customerAdminApi = createApi({
  reducerPath: "customerAdminApi",
  tagTypes: ["Customers", "CustomerStats"],
  baseQuery: axiosBaseQuery(),
  endpoints: (builder) => ({
    getCustomerStats: builder.query({
      query: () => ({ url: "/admin/customers/stats" }),
      transformResponse: (r) => r.data,
      providesTags: ["CustomerStats"],
    }),
    getCustomers: builder.query({
      query: (params) => ({ url: "/admin/customers", params }),
      transformResponse: (r) => ({ customers: r.data, meta: r.meta }),
      providesTags: ["Customers"],
    }),
    updateCustomerStatus: builder.mutation({
      query: ({ id, isActive }) => ({
        url: `/admin/customers/${id}/status`,
        method: "PATCH",
        body: { isActive },
      }),
      invalidatesTags: ["Customers", "CustomerStats"],
    }),
  }),
});

export const {
  useGetCustomerStatsQuery,
  useGetCustomersQuery,
  useUpdateCustomerStatusMutation,
} = customerAdminApi;
