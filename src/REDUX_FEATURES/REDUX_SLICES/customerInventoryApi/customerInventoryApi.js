import { createApi } from "@reduxjs/toolkit/query/react";
import customerAxiosInstance from "../../../SERVICES/CustomerAxiosInstance";

const axiosBaseQuery = () => async ({ url, method, body, params, headers }) => {
    try {
        const config = { url, method, data: body, params, headers: { ...headers } };
        const response = await customerAxiosInstance(config);
        return { data: response.data };
    } catch (error) {
        return { error: { status: error.response?.status, data: error.response?.data } };
    }
};

export const customerInventoryApi = createApi({
    reducerPath: "customerInventoryApi",
    baseQuery: axiosBaseQuery(),
    tagTypes: ["PropertyInventory", "InventorySummary", "MasterItems"],
    endpoints: (builder) => ({
        getInventorySummary: builder.query({
            query: () => ({ url: "/customer/inventory/summary", method: "GET" }),
            transformResponse: (response) => response.data,
            providesTags: [{ type: "InventorySummary", id: "STATS" }],
        }),
        getMasterItems: builder.query({
            query: () => ({ url: "/customer/inventory/master-items", method: "GET" }),
            transformResponse: (response) => response.data,
            providesTags: [{ type: "MasterItems", id: "LIST" }],
        }),
        getPropertyInventory: builder.query({
            query: (propertyId) => ({ url: `/customer/inventory/property/${propertyId}`, method: "GET" }),
            transformResponse: (response) => response.data,
            providesTags: (result, error, propertyId) => [
                { type: "PropertyInventory", id: propertyId },
                { type: "InventorySummary", id: "STATS" }
            ],
        }),
        getInventoryById: builder.query({
            query: (id) => ({ url: `/customer/inventory/${id}`, method: "GET" }),
            transformResponse: (response) => response.data,
        }),
        createOrUpdateInventory: builder.mutation({
            query: (data) => ({ url: "/customer/inventory", method: "POST", body: data }),
            transformResponse: (response) => response.data,
            invalidatesTags: (result, error, { propertyId }) => [
                { type: "PropertyInventory", id: propertyId },
                { type: "InventorySummary", id: "STATS" }
            ],
        }),
        updateInventoryItem: builder.mutation({
            query: ({ inventoryId, itemId, ...data }) => ({
                url: `/customer/inventory/${inventoryId}/items/${itemId}`,
                method: "PATCH",
                body: data,
            }),
            transformResponse: (response) => response.data,
            invalidatesTags: (result, error, { propertyId }) => [
                { type: "PropertyInventory", id: propertyId },
                { type: "InventorySummary", id: "STATS" }
            ],
        }),
        deleteInventoryItem: builder.mutation({
            query: ({ inventoryId, itemId }) => ({
                url: `/customer/inventory/${inventoryId}/items/${itemId}`,
                method: "DELETE",
            }),
            transformResponse: (response) => response.data,
            invalidatesTags: (result, error, { propertyId }) => [
                { type: "PropertyInventory", id: propertyId },
                { type: "InventorySummary", id: "STATS" }
            ],
        }),
        deleteEntireInventory: builder.mutation({
            query: (id) => ({ url: `/customer/inventory/${id}`, method: "DELETE" }),
            transformResponse: (response) => response.data,
            invalidatesTags: (result, error, { propertyId }) => [
                { type: "PropertyInventory", id: propertyId },
                { type: "InventorySummary", id: "STATS" }
            ],
        }),
    }),
});

export const {
    useGetInventorySummaryQuery,
    useGetMasterItemsQuery,
    useGetPropertyInventoryQuery,
    useGetInventoryByIdQuery,
    useCreateOrUpdateInventoryMutation,
    useUpdateInventoryItemMutation,
    useDeleteInventoryItemMutation,
    useDeleteEntireInventoryMutation,
} = customerInventoryApi;
