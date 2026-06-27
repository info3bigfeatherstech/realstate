import { createApi } from "@reduxjs/toolkit/query/react";
import customerAxiosInstance from "../../../SERVICES/CustomerAxiosInstance";
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
      const response = await customerAxiosInstance(config);
      return { data: response.data };
    } catch (error) {
      return {
        error: { status: error.response?.status, data: error.response?.data },
      };
    }
  };
export const customerKeysApi = createApi({
  reducerPath: "customerKeysApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["Keys", "KeySummary", "KeyDetail", "KeyHistory"],
  endpoints: (builder) => ({
    getKeys: builder.query({
      query: (params) => ({ url: "/customer/keys", method: "GET", params }),
      transformResponse: (response) => response,
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ _id }) => ({ type: "Keys", id: _id })),
              { type: "Keys", id: "LIST" },
            ]
          : [{ type: "Keys", id: "LIST" }],
    }),
    getKeySummary: builder.query({
      query: () => ({ url: "/customer/keys/summary", method: "GET" }),
      transformResponse: (response) => response.data,
      providesTags: [{ type: "KeySummary", id: "STATS" }],
    }),
    getKeysByProperty: builder.query({
      query: (propertyId) => ({
        url: `/customer/keys/property/${propertyId}`,
        method: "GET",
      }),
      transformResponse: (response) => response.data,
      providesTags: (result, error, propertyId) => [
        { type: "Keys", id: `PROPERTY_${propertyId}` },
      ],
    }),
    getKeysByHolder: builder.query({
      query: (holderId) => ({
        url: `/customer/keys/holder/${holderId}`,
        method: "GET",
      }),
      transformResponse: (response) => response.data,
      providesTags: (result, error, holderId) => [
        { type: "Keys", id: `HOLDER_${holderId}` },
      ],
    }),
    getKeyById: builder.query({
      query: (id) => ({ url: `/customer/keys/${id}`, method: "GET" }),
      transformResponse: (response) => response.data,
      providesTags: (result, error, id) => [{ type: "KeyDetail", id }],
    }),
    getKeyHistory: builder.query({
      query: ({ id, params }) => ({
        url: `/customer/keys/${id}/history`,
        method: "GET",
        params,
      }),
      transformResponse: (response) => response,
      providesTags: (result, error, { id }) => [{ type: "KeyHistory", id }],
    }),
    createKey: builder.mutation({
      query: (data) => ({ url: "/customer/keys", method: "POST", body: data }),
      transformResponse: (response) => response.data,
      invalidatesTags: [
        { type: "Keys", id: "LIST" },
        { type: "KeySummary", id: "STATS" },
      ],
    }),
    moveKey: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/customer/keys/${id}/move`,
        method: "POST",
        body,
      }),
      transformResponse: (response) => response.data,
      invalidatesTags: (result, error, { id }) => [
        { type: "Keys", id: "LIST" },
        { type: "Keys", id: id },
        { type: "KeyDetail", id },
        { type: "KeyHistory", id },
        { type: "KeySummary", id: "STATS" },
      ],
    }),
    returnKey: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/customer/keys/${id}/return`,
        method: "POST",
        body,
      }),
      transformResponse: (response) => response.data,
      invalidatesTags: (result, error, { id }) => [
        { type: "Keys", id: "LIST" },
        { type: "Keys", id: id },
        { type: "KeyDetail", id },
        { type: "KeyHistory", id },
        { type: "KeySummary", id: "STATS" },
      ],
    }),
    updateKeyStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/customer/keys/${id}/status`,
        method: "PATCH",
        body: { status },
      }),
      transformResponse: (response) => response.data,
      invalidatesTags: (result, error, { id }) => [
        { type: "Keys", id: "LIST" },
        { type: "Keys", id: id },
        { type: "KeyDetail", id },
        { type: "KeyHistory", id },
        { type: "KeySummary", id: "STATS" },
      ],
    }),
    deleteKey: builder.mutation({
      query: (id) => ({ url: `/customer/keys/${id}`, method: "DELETE" }),
      transformResponse: (response) => response.data,
      invalidatesTags: (result, error, id) => [
        { type: "Keys", id: "LIST" },
        { type: "Keys", id: id },
        { type: "KeyDetail", id },
        { type: "KeyHistory", id },
        { type: "KeySummary", id: "STATS" },
      ],
    }),
  }),
});
export const {
  useGetKeysQuery,
  useGetKeySummaryQuery,
  useGetKeysByPropertyQuery,
  useGetKeysByHolderQuery,
  useGetKeyByIdQuery,
  useGetKeyHistoryQuery,
  useCreateKeyMutation,
  useMoveKeyMutation,
  useReturnKeyMutation,
  useUpdateKeyStatusMutation,
  useDeleteKeyMutation,
} = customerKeysApi;
