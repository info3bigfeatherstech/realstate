import { createApi } from "@reduxjs/toolkit/query/react";
import axiosInstance from "../../../../SERVICES/Axiosinstance";
const axiosBaseQuery =
  () =>
  async ({ url, method, body, params, headers }) => {
    try {
      const config = {
        url,
        method,
        data: body,
        params,
        headers: { ...headers },
      };
      const response = await axiosInstance(config);
      return { data: response.data };
    } catch (error) {
      return {
        error: { status: error.response?.status, data: error.response?.data },
      };
    }
  };
export const inventoryCategoryApi = createApi({
  reducerPath: "inventoryCategoryApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["InventoryCategory"],
  endpoints: (builder) => ({
    getInventoryCategories: builder.query({
      query: (params) => ({
        url: "/admin/inventory-categories",
        method: "GET",
        params,
      }),
      transformResponse: (response) => response,
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ _id }) => ({
                type: "InventoryCategory",
                id: _id,
              })),
              { type: "InventoryCategory", id: "LIST" },
            ]
          : [{ type: "InventoryCategory", id: "LIST" }],
    }),
    createInventoryCategory: builder.mutation({
      query: (data) => ({
        url: "/admin/inventory-categories",
        method: "POST",
        body: data,
      }),
      transformResponse: (response) => response.data,
      invalidatesTags: [{ type: "InventoryCategory", id: "LIST" }],
    }),
    updateInventoryCategory: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/admin/inventory-categories/${id}`,
        method: "PUT",
        body: data,
      }),
      transformResponse: (response) => response.data,
      invalidatesTags: (result, error, { id }) => [
        { type: "InventoryCategory", id: "LIST" },
        { type: "InventoryCategory", id },
      ],
    }),
    toggleInventoryCategoryStatus: builder.mutation({
      query: ({ id, isActive }) => ({
        url: `/admin/inventory-categories/${id}/status`,
        method: "PATCH",
        body: { isActive },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "InventoryCategory", id: "LIST" },
        { type: "InventoryCategory", id },
      ],
    }),
    deleteInventoryCategory: builder.mutation({
      query: (id) => ({
        url: `/admin/inventory-categories/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "InventoryCategory", id: "LIST" }],
    }),
  }),
});
export const {
  useGetInventoryCategoriesQuery,
  useCreateInventoryCategoryMutation,
  useUpdateInventoryCategoryMutation,
  useToggleInventoryCategoryStatusMutation,
  useDeleteInventoryCategoryMutation,
} = inventoryCategoryApi;
