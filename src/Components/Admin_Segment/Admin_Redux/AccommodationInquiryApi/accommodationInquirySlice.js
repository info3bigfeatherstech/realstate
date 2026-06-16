import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  page: 1,
  limit: 10,
  search: "",
  status: "",
  requirementType: "",
  occupantType: "",
  city: "",
  monthlyBudget: "",
  moveInPriority: "",
  sortBy: "createdAt",
  sortOrder: "desc",
};

const accommodationInquirySlice = createSlice({
  name: "accommodationInquiry",
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
    setRequirementType: (state, action) => {
      state.requirementType = action.payload;
      state.page = 1;
    },
    setOccupantType: (state, action) => {
      state.occupantType = action.payload;
      state.page = 1;
    },
    setCity: (state, action) => {
      state.city = action.payload;
      state.page = 1;
    },
    setMonthlyBudget: (state, action) => {
      state.monthlyBudget = action.payload;
      state.page = 1;
    },
    setMoveInPriority: (state, action) => {
      state.moveInPriority = action.payload;
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
      state.requirementType = "";
      state.occupantType = "";
      state.city = "";
      state.monthlyBudget = "";
      state.moveInPriority = "";
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
  setRequirementType,
  setOccupantType,
  setCity,
  setMonthlyBudget,
  setMoveInPriority,
  setSortBy,
  setSortOrder,
  resetFilters,
} = accommodationInquirySlice.actions;

export default accommodationInquirySlice.reducer;
