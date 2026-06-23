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

export const tenantExitApi = createApi({
    reducerPath: "tenantExitApi",
    baseQuery: axiosBaseQuery(),
    tagTypes: ["TenantExit", "TenantExitDetail", "TenantExitSummary"],
    endpoints: (builder) => ({
        getTenantExits: builder.query({
            query: (params) => ({ url: "/customer/exits", method: "GET", params }),
            transformResponse: (response) => response,
            providesTags: (result) =>
                result?.data ? [...result.data.map(({ _id }) => ({ type: "TenantExit", id: _id })), { type: "TenantExit", id: "LIST" }] : [{ type: "TenantExit", id: "LIST" }],
        }),
        getTenantExitById: builder.query({
            query: (id) => ({ url: `/customer/exits/${id}`, method: "GET" }),
            transformResponse: (response) => response.data,
            providesTags: (result, error, id) => [{ type: "TenantExitDetail", id }],
        }),
        getEntryForAutoFill: builder.query({
            query: (entryId) => ({ url: `/customer/exits/entry/${entryId}`, method: "GET" }),
            transformResponse: (response) => response.data,
        }),
        getExitByEntry: builder.query({
            query: (entryId) => ({ url: `/customer/exits/entry/${entryId}/exit`, method: "GET" }),
            transformResponse: (response) => response.data,
        }),
        createTenantExit: builder.mutation({
            query: (data) => ({ url: "/customer/exits", method: "POST", body: data }),
            transformResponse: (response) => response.data,
            invalidatesTags: [
                { type: "TenantExit", id: "LIST" },
                { type: "TenantExitSummary", id: "STATS" }
            ],
        }),
        updateTenantExit: builder.mutation({
            query: ({ id, ...data }) => ({ url: `/customer/exits/${id}`, method: "PUT", body: data }),
            transformResponse: (response) => response.data,
            invalidatesTags: (result, error, { id }) => [
                { type: "TenantExit", id: "LIST" },
                { type: "TenantExitDetail", id },
                { type: "TenantExitSummary", id: "STATS" }
            ],
        }),
        deleteTenantExit: builder.mutation({
            query: (id) => ({ url: `/customer/exits/${id}`, method: "DELETE" }),
            transformResponse: (response) => response.data,
            invalidatesTags: [
                { type: "TenantExit", id: "LIST" },
                { type: "TenantExitSummary", id: "STATS" }
            ],
        }),
        getTenantExitSummary: builder.query({
            query: () => ({ url: "/customer/exits/summary", method: "GET" }),
            transformResponse: (response) => response.data,
            providesTags: [{ type: "TenantExitSummary", id: "STATS" }],
        }),
    }),
});

export const {
    useGetTenantExitsQuery,
    useGetTenantExitByIdQuery,
    useGetEntryForAutoFillQuery,
    useGetExitByEntryQuery,
    useCreateTenantExitMutation,
    useUpdateTenantExitMutation,
    useDeleteTenantExitMutation,
    useGetTenantExitSummaryQuery,
} = tenantExitApi;
