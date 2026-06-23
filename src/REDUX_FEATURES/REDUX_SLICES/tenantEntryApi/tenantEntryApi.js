import { createApi } from "@reduxjs/toolkit/query/react";
import customerAxiosInstance from "../../../SERVICES/CustomerAxiosInstance";

const axiosBaseQuery = () => async ({ url, method, body, params, headers }) => {
    try {
        const config = { url, method, data: body, params, headers: { ...headers } };
        if (body instanceof FormData) {
            for (const key in config.headers) {
                if (key.toLowerCase() === "content-type") {
                    delete config.headers[key];
                }
            }
            config.headers["Content-Type"] = undefined;
        }
        const response = await customerAxiosInstance(config);
        return { data: response.data };
    } catch (error) {
        return { error: { status: error.response?.status, data: error.response?.data } };
    }
};

export const tenantEntryApi = createApi({
    reducerPath: "tenantEntryApi",
    baseQuery: axiosBaseQuery(),
    tagTypes: ["TenantEntry", "TenantEntryDetail", "TenantSummary"],
    endpoints: (builder) => ({
        getTenantEntries: builder.query({
            query: (params) => ({ url: "/customer/tenants", method: "GET", params }),
            transformResponse: (response) => response,
            providesTags: (result) =>
                result?.data ? [...result.data.map(({ _id }) => ({ type: "TenantEntry", id: _id })), { type: "TenantEntry", id: "LIST" }] : [{ type: "TenantEntry", id: "LIST" }],
        }),
        getTenantEntryById: builder.query({
            query: (id) => ({ url: `/customer/tenants/${id}`, method: "GET" }),
            transformResponse: (response) => response.data,
            providesTags: (result, error, id) => [{ type: "TenantEntryDetail", id }],
        }),
        getTenantsByProperty: builder.query({
            query: (propertyId) => ({ url: `/customer/tenants/property/${propertyId}`, method: "GET" }),
            transformResponse: (response) => response.data,
        }),
        createTenantEntry: builder.mutation({
            query: (data) => ({ url: "/customer/tenants", method: "POST", body: data }),
            transformResponse: (response) => response.data,
            invalidatesTags: [
                { type: "TenantEntry", id: "LIST" },
                { type: "TenantSummary", id: "STATS" }
            ],
        }),
        updateTenantEntry: builder.mutation({
            query: ({ id, ...data }) => ({ url: `/customer/tenants/${id}`, method: "PUT", body: data }),
            transformResponse: (response) => response.data,
            invalidatesTags: (result, error, { id }) => [
                { type: "TenantEntry", id: "LIST" },
                { type: "TenantEntryDetail", id },
                { type: "TenantSummary", id: "STATS" }
            ],
        }),
        deleteTenantEntry: builder.mutation({
            query: (id) => ({ url: `/customer/tenants/${id}`, method: "DELETE" }),
            transformResponse: (response) => response.data,
            invalidatesTags: [
                { type: "TenantEntry", id: "LIST" },
                { type: "TenantSummary", id: "STATS" }
            ],
        }),
        getTenantSummary: builder.query({
            query: () => ({ url: "/customer/tenants/summary", method: "GET" }),
            transformResponse: (response) => response.data,
            providesTags: [{ type: "TenantSummary", id: "STATS" }],
        }),
    }),
});

export const {
    useGetTenantEntriesQuery,
    useGetTenantEntryByIdQuery,
    useLazyGetTenantEntryByIdQuery,
    useGetTenantsByPropertyQuery,
    useCreateTenantEntryMutation,
    useUpdateTenantEntryMutation,
    useDeleteTenantEntryMutation,
    useGetTenantSummaryQuery,
} = tenantEntryApi;
