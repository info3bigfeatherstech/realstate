import { createApi } from "@reduxjs/toolkit/query/react";
import axiosInstance from "../../../../SERVICES/Axiosinstance";

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
            // Explicitly override the default application/json header from axiosInstance
            config.headers["Content-Type"] = undefined;
        }
        const response = await axiosInstance(config);
        return { data: response.data };
    } catch (error) {
        return { error: { status: error.response?.status, data: error.response?.data } };
    }
};

export const propertyApi = createApi({
    reducerPath: "propertyApi",
    baseQuery: axiosBaseQuery(),
    tagTypes: ["Property", "PropertyDetail"],
    endpoints: (builder) => ({
        getProperties: builder.query({
            query: (params) => ({ url: "/admin/properties", method: "GET", params }),
            transformResponse: (response) => response,  // ✅ Fixed
            providesTags: (result) =>
                result?.data ? [...result.data.map(({ _id }) => ({ type: "Property", id: _id })), { type: "Property", id: "LIST" }] : [{ type: "Property", id: "LIST" }],
        }),
        getPropertyById: builder.query({
            query: (id) => ({ url: `/admin/properties/${id}`, method: "GET" }),
            transformResponse: (response) => response.data,
            providesTags: (result, error, id) => [{ type: "PropertyDetail", id }],
        }),
        createProperty: builder.mutation({
            query: (data) => ({ url: "/admin/properties", method: "POST", body: data }),
            transformResponse: (response) => response.data,
            invalidatesTags: [{ type: "Property", id: "LIST" }],
        }),
        updateProperty: builder.mutation({
            query: ({ id, ...data }) => ({ url: `/admin/properties/${id}`, method: "PUT", body: data }),
            transformResponse: (response) => response.data,
            invalidatesTags: (result, error, { id }) => [{ type: "Property", id: "LIST" }, { type: "PropertyDetail", id }],
        }),
        updatePropertyStatus: builder.mutation({
            query: ({ id, status }) => ({ url: `/admin/properties/${id}/status`, method: "PATCH", body: { status } }),
            invalidatesTags: (result, error, { id }) => [{ type: "Property", id: "LIST" }, { type: "PropertyDetail", id }],
        }),
        deleteProperty: builder.mutation({
            query: (id) => ({ url: `/admin/properties/${id}`, method: "DELETE" }),
            invalidatesTags: [{ type: "Property", id: "LIST" }],
        }),
        uploadMedia: builder.mutation({
            query: ({ id, formData }) => ({
                url: `/admin/properties/${id}/media`,
                method: "POST",
                body: formData,
            }),
            invalidatesTags: (result, error, { id }) => [{ type: "PropertyDetail", id }],
        }),
        deleteMedia: builder.mutation({
            query: ({ propertyId, mediaId }) => ({ url: `/admin/properties/${propertyId}/media/${mediaId}`, method: "DELETE" }),
            invalidatesTags: (result, error, { propertyId }) => [{ type: "PropertyDetail", propertyId }],
        }),
        uploadDocument: builder.mutation({
            query: ({ id, formData }) => ({
                url: `/admin/properties/${id}/documents`,
                method: "POST",
                body: formData,
            }),
            invalidatesTags: (result, error, { id }) => [{ type: "PropertyDetail", id }],
        }),
        deleteDocument: builder.mutation({
            query: ({ propertyId, documentId }) => ({ url: `/admin/properties/${propertyId}/documents/${documentId}`, method: "DELETE" }),
            invalidatesTags: (result, error, { propertyId }) => [{ type: "PropertyDetail", propertyId }],
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
} = propertyApi;