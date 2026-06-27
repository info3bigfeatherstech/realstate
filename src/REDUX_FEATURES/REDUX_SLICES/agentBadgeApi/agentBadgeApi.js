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
export const agentBadgeApi = createApi({
  reducerPath: "agentBadgeApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["AgentBadge", "AgentBadgeHistory", "AgentLeaderboard"],
  endpoints: (builder) => ({
    getMyBadge: builder.query({
      query: () => ({ url: "/customer/agent/my-badge", method: "GET" }),
      transformResponse: (response) => response.data,
      providesTags: ["AgentBadge"],
    }),
    getBadgeHistory: builder.query({
      query: () => ({ url: "/customer/agent/my-badge/history", method: "GET" }),
      transformResponse: (response) => response.data,
      providesTags: ["AgentBadgeHistory"],
    }),
    getLeaderboard: builder.query({
      query: () => ({ url: "/customer/agent/leaderboard", method: "GET" }),
      transformResponse: (response) => response.data,
      providesTags: ["AgentLeaderboard"],
    }),
  }),
});
export const {
  useGetMyBadgeQuery,
  useGetBadgeHistoryQuery,
  useGetLeaderboardQuery,
} = agentBadgeApi;
