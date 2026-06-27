import { createApi } from "@reduxjs/toolkit/query/react";
import axiosInstance from "../../../SERVICES/Axiosinstance";
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
      const response = await axiosInstance(config);
      return { data: response.data };
    } catch (error) {
      return {
        error: { status: error.response?.status, data: error.response?.data },
      };
    }
  };
export const userGeneralInquiryApi = createApi({
  reducerPath: "userGeneralInquiryApi",
  baseQuery: axiosBaseQuery(),
  endpoints: (builder) => ({
    submitGeneralInquiry: builder.mutation({
      query: (payload) => ({
        url: "/user/general-inquiries",
        method: "POST",
        body: payload,
      }),
      transformResponse: (response) => response,
    }),
  }),
});
export const { useSubmitGeneralInquiryMutation } = userGeneralInquiryApi;
