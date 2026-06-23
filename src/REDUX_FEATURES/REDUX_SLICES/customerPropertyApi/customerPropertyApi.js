import { createApi } from "@reduxjs/toolkit/query/react";
import customerAxiosInstance from "../../../SERVICES/CustomerAxiosInstance";

const axiosBaseQuery = () => async ({ url, method, body, params, headers }) => {
    try {
        const config = { url, method, data: body, params, headers: { ...headers } };
        if (body instanceof FormData) {
            // Remove any user-defined content-type to let the browser set boundary correctly
            for (const key in config.headers) {
                if (key.toLowerCase() === "content-type") {
                    delete config.headers[key];
                }
            }
            // Explicitly override the default application/json header from customerAxiosInstance
            config.headers["Content-Type"] = undefined;
        }
        const response = await customerAxiosInstance(config);
        return { data: response.data };
    } catch (error) {
        return { error: { status: error.response?.status, data: error.response?.data } };
    }
};

export const customerPropertyApi = createApi({
    reducerPath: "customerPropertyApi",
    baseQuery: axiosBaseQuery(),
    tagTypes: ["CustomerProperty", "CustomerPropertyDetail"],
    endpoints: (builder) => ({
        getProperties: builder.query({
            query: (params) => ({ url: "/customer/properties", method: "GET", params }),
            transformResponse: (response) => response,
            providesTags: (result) =>
                result?.data ? [...result.data.map(({ _id }) => ({ type: "CustomerProperty", id: _id })), { type: "CustomerProperty", id: "LIST" }] : [{ type: "CustomerProperty", id: "LIST" }],
        }),
        getPropertyById: builder.query({
            query: (id) => ({ url: `/customer/properties/${id}`, method: "GET" }),
            transformResponse: (response) => response.data,
            providesTags: (result, error, id) => [{ type: "CustomerPropertyDetail", id }],
        }),
        createProperty: builder.mutation({
            query: (data) => ({ url: "/customer/properties", method: "POST", body: data }),
            transformResponse: (response) => response.data,
            invalidatesTags: [{ type: "CustomerProperty", id: "LIST" }],
        }),
        updateProperty: builder.mutation({
            query: ({ id, ...data }) => ({ url: `/customer/properties/${id}`, method: "PUT", body: data }),
            transformResponse: (response) => response.data,
            invalidatesTags: (result, error, { id }) => [{ type: "CustomerProperty", id: "LIST" }, { type: "CustomerPropertyDetail", id }],
        }),
        updatePropertyStatus: builder.mutation({
            query: ({ id, status }) => ({ url: `/customer/properties/${id}/status`, method: "PATCH", body: { status } }),
            invalidatesTags: (result, error, { id }) => [{ type: "CustomerProperty", id: "LIST" }, { type: "CustomerPropertyDetail", id }],
        }),
        deleteProperty: builder.mutation({
            query: (id) => ({ url: `/customer/properties/${id}`, method: "DELETE" }),
            invalidatesTags: [{ type: "CustomerProperty", id: "LIST" }],
        }),
        uploadMedia: builder.mutation({
            query: ({ id, formData }) => ({
                url: `/customer/properties/${id}/media`,
                method: "POST",
                body: formData,
            }),
            invalidatesTags: (result, error, { id }) => [{ type: "CustomerPropertyDetail", id }],
        }),
        deleteMedia: builder.mutation({
            query: ({ propertyId, mediaId }) => ({ url: `/customer/properties/${propertyId}/media/${mediaId}`, method: "DELETE" }),
            invalidatesTags: (result, error, { propertyId }) => [{ type: "CustomerPropertyDetail", id: propertyId }],
        }),
        uploadDocument: builder.mutation({
            query: ({ id, formData }) => ({
                url: `/customer/properties/${id}/documents`,
                method: "POST",
                body: formData,
            }),
            invalidatesTags: (result, error, { id }) => [{ type: "CustomerPropertyDetail", id }],
        }),
        deleteDocument: builder.mutation({
            query: ({ propertyId, documentId }) => ({ url: `/customer/properties/${propertyId}/documents/${documentId}`, method: "DELETE" }),
            invalidatesTags: (result, error, { propertyId }) => [{ type: "CustomerPropertyDetail", id: propertyId }],
        }),
    }),
});

export const {
    useGetPropertiesQuery,
    useGetPropertyByIdQuery,
    useCreatePropertyMutation,
    useUpdatePropertyMutation,
    useUpdatePropertyStatusMutation,
    useDeletePropertyMutation,
    useUploadMediaMutation,
    useDeleteMediaMutation,
    useUploadDocumentMutation,
    useDeleteDocumentMutation,
} = customerPropertyApi;
