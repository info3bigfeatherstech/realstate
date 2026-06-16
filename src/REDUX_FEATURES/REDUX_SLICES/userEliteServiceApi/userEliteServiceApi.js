// src/REDUX_FEATURES/REDUX_SLICES/userEliteServiceApi/userEliteServiceApi.js
import { createApi } from "@reduxjs/toolkit/query/react";
import axiosInstance from "../../../SERVICES/Axiosinstance";

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

export const userEliteServiceApi = createApi({
    reducerPath: "userEliteServiceApi",
    baseQuery: axiosBaseQuery(),
    tagTypes: ["UserEliteService"],
    endpoints: (builder) => ({
        getUserEliteServices: builder.query({
            query: (params) => ({ url: "/user/elite-services", method: "GET", params }),
            transformResponse: (response) => response, // { data, meta }
            providesTags: (result) =>
                result?.data
                    ? [...result.data.map(({ _id }) => ({ type: "UserEliteService", id: _id })), { type: "UserEliteService", id: "LIST" }]
                    : [{ type: "UserEliteService", id: "LIST" }],
        }),
        getUserEliteServiceById: builder.query({
            query: (id) => ({ url: `/user/elite-services/${id}`, method: "GET" }),
            transformResponse: (response) => response.data,
            providesTags: (result, error, id) => [{ type: "UserEliteService", id }],
        }),
        getUserEliteServiceRoles: builder.query({
            query: () => ({ url: "/user/elite-services/roles", method: "GET" }),
            transformResponse: (response) => response.data, // string[]
        }),
    }),
});

export const {
    useGetUserEliteServicesQuery,
    useGetUserEliteServiceByIdQuery,
    useGetUserEliteServiceRolesQuery,
} = userEliteServiceApi;