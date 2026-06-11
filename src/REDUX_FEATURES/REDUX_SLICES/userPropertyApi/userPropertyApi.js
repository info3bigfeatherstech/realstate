// src/User/api/userPropertyApi.js
import { createApi } from "@reduxjs/toolkit/query/react";
import axiosInstance from "../../../SERVICES/Axiosinstance";

const axiosBaseQuery = () => async ({ url, method, params }) => {
    try {
        const response = await axiosInstance({ url, method, params });
        return { data: response.data };
    } catch (error) {
        return { error: { status: error.response?.status, data: error.response?.data } };
    }
};

export const userPropertyApi = createApi({
    reducerPath: "userPropertyApi",
    baseQuery: axiosBaseQuery(),
    endpoints: (builder) => ({
        getProperties: builder.query({
            query: (params) => ({ url: "/user/properties", method: "GET", params }),
            transformResponse: (response) => response,
        }),
        getPropertyById: builder.query({
            query: (id) => ({ url: `/user/properties/${id}`, method: "GET" }),
            transformResponse: (response) => response.data,
        }),
        getPropertyByListingId: builder.query({
            query: (listingId) => ({ url: `/user/properties/listing/${listingId}`, method: "GET" }),
            transformResponse: (response) => response.data,
        }),
    }),
});

export const { useGetPropertiesQuery, useGetPropertyByIdQuery, useGetPropertyByListingIdQuery } = userPropertyApi;