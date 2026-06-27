import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  page: 1,
  limit: 10,
  search: "",
  status: "",
  sortBy: "createdAt",
  sortOrder: "desc",
};
const generalInquirySlice = createSlice({
  name: "generalInquiry",
  initialState,
  reducers: {
    setPage: (state, action) => {
      state.page = action.payload;
    },
    setLimit: (state, action) => {
      state.limit = action.payload;
      state.page = 1;
    },
    setSearch: (state, action) => {
      state.search = action.payload;
      state.page = 1;
    },
    setStatus: (state, action) => {
      state.status = action.payload;
      state.page = 1;
    },
    setSortBy: (state, action) => {
      state.sortBy = action.payload;
    },
    setSortOrder: (state, action) => {
      state.sortOrder = action.payload;
    },
    resetFilters: (state) => {
      state.search = "";
      state.status = "";
      state.page = 1;
      state.sortBy = "createdAt";
      state.sortOrder = "desc";
    },
  },
});
export const {
  setPage,
  setLimit,
  setSearch,
  setStatus,
  setSortBy,
  setSortOrder,
  resetFilters,
} = generalInquirySlice.actions;
export default generalInquirySlice.reducer;
