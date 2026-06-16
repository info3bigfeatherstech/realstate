// src/REDUX_FEATURES/REDUX_SLICES/userEliteServiceApi/userEliteServiceSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  // Pagination
  page: 1,
  limit: 10,

  // Filters
  search: "",
  role: "",
  status: "",

  // Sorting
  sortBy: "createdAt",
  sortOrder: "desc",
};

const userEliteServiceSlice = createSlice({
  name: "userEliteService",
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
    setRole: (state, action) => {
      state.role = action.payload;
      state.page = 1;
    },
    setStatus: (state, action) => {
      state.status = action.payload;
      state.page = 1;
    },
    setSortBy: (state, action) => {
      state.sortBy = action.payload;
    },
    toggleSortOrder: (state) => {
      state.sortOrder = state.sortOrder === "asc" ? "desc" : "asc";
    },
    resetFilters: (state) => {
      state.search = "";
      state.role = "";
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
  setRole,
  setStatus,
  setSortBy,
  toggleSortOrder,
  resetFilters,
} = userEliteServiceSlice.actions;

export default userEliteServiceSlice.reducer;