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

export const inventoryItemApi = createApi({
    reducerPath: "inventoryItemApi",
    baseQuery: axiosBaseQuery(),
    tagTypes: ["InventoryItem", "InventoryItemDetail"],
    endpoints: (builder) => ({
        getInventoryItems: builder.query({
            query: (params) => ({ url: "/admin/inventory-items", method: "GET", params }),
            transformResponse: (response) => response,
            providesTags: (result) =>
                result?.data ? [...result.data.map(({ _id }) => ({ type: "InventoryItem", id: _id })), { type: "InventoryItem", id: "LIST" }] : [{ type: "InventoryItem", id: "LIST" }],
        }),
        getInventoryItemById: builder.query({
            query: (id) => ({ url: `/admin/inventory-items/${id}`, method: "GET" }),
            transformResponse: (response) => response.data,
            providesTags: (result, error, id) => [{ type: "InventoryItemDetail", id }],
        }),
        createInventoryItem: builder.mutation({
            query: (data) => ({ url: "/admin/inventory-items", method: "POST", body: data }),
            transformResponse: (response) => response.data,
            invalidatesTags: [{ type: "InventoryItem", id: "LIST" }],
        }),
        updateInventoryItem: builder.mutation({
            query: ({ id, ...data }) => ({ url: `/admin/inventory-items/${id}`, method: "PUT", body: data }),
            transformResponse: (response) => response.data,
            invalidatesTags: (result, error, { id }) => [{ type: "InventoryItem", id: "LIST" }, { type: "InventoryItemDetail", id }],
        }),
        toggleInventoryItemStatus: builder.mutation({
            query: ({ id, isActive }) => ({ url: `/admin/inventory-items/${id}/status`, method: "PATCH", body: { isActive } }),
            invalidatesTags: (result, error, { id }) => [{ type: "InventoryItem", id: "LIST" }, { type: "InventoryItemDetail", id }],
        }),
        deleteInventoryItem: builder.mutation({
            query: (id) => ({ url: `/admin/inventory-items/${id}`, method: "DELETE" }),
            invalidatesTags: [{ type: "InventoryItem", id: "LIST" }],
        }),
        seedDefaultInventoryItems: builder.mutation({
            query: () => ({ url: "/admin/inventory-items/seed", method: "POST" }),
            invalidatesTags: [{ type: "InventoryItem", id: "LIST" }],
        }),
    }),
});

export const {
    useGetInventoryItemsQuery,
    useGetInventoryItemByIdQuery,
    useCreateInventoryItemMutation,
    useUpdateInventoryItemMutation,
    useToggleInventoryItemStatusMutation,
    useDeleteInventoryItemMutation,
    useSeedDefaultInventoryItemsMutation,
} = inventoryItemApi;
