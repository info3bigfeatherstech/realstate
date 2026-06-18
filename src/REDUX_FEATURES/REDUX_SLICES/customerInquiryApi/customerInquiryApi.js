import { createApi } from "@reduxjs/toolkit/query/react";
import customerAxiosInstance from "../../../SERVICES/CustomerAxiosInstance";
import { buildInquirySubmitBody } from "../../../utils/inquiryForm";

const axiosBaseQuery = () => async ({ url, method, body, params, headers }) => {
  try {
    const config = { url, method, data: body, params, headers: { ...headers } };
    if (body instanceof FormData) {
      Object.keys(config.headers).forEach((key) => {
        if (key.toLowerCase() === "content-type") delete config.headers[key];
      });
    }
    const response = await customerAxiosInstance(config);
    return { data: response.data };
  } catch (error) {
    return { error: { status: error.response?.status, data: error.response?.data } };
  }
};

export const customerInquiryApi = createApi({
  reducerPath: "customerInquiryApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["MyInquiries"],
  endpoints: (builder) => ({
    submitInquiry: builder.mutation({
      query: ({ formType, form }) => ({
        url: `/customer/inquiries/${formType}`,
        method: "POST",
        body: buildInquirySubmitBody(formType, form),
      }),
      transformResponse: (response) => response.data,
      invalidatesTags: ["MyInquiries"],
    }),
    getMyInquiries: builder.query({
      query: (params) => ({ url: "/customer/inquiries", params }),
      transformResponse: (response) => ({ inquiries: response.data, meta: response.meta }),
      providesTags: ["MyInquiries"],
    }),
  }),
});

export const { useSubmitInquiryMutation, useGetMyInquiriesQuery } = customerInquiryApi;
