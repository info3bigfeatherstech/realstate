// src/admin/redux/SellPropertyInquiryApi/sellPropertyInquirySlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    page: 1,
    limit: 10,
    search: "",
    status: "",
    propertyType: "",
    priority: "",
    city: "",
    sortBy: "createdAt",
    sortOrder: "desc",
};

const sellPropertyInquirySlice = createSlice({
    name: "sellPropertyInquiry",
    initialState,
    reducers: {
        setPage: (state, action) => { state.page = action.payload; },
        setLimit: (state, action) => { state.limit = action.payload; state.page = 1; },
        setSearch: (state, action) => { state.search = action.payload; state.page = 1; },
        setStatus: (state, action) => { state.status = action.payload; state.page = 1; },
        setPropertyType: (state, action) => { state.propertyType = action.payload; state.page = 1; },
        setPriority: (state, action) => { state.priority = action.payload; state.page = 1; },
        setCity: (state, action) => { state.city = action.payload; state.page = 1; },
        setSortBy: (state, action) => { state.sortBy = action.payload; },
        setSortOrder: (state, action) => { state.sortOrder = action.payload; },
        resetFilters: (state) => { Object.assign(state, initialState); },
    },
});

export const {
    setPage,
    setLimit,
    setSearch,
    setStatus,
    setPropertyType,
    setPriority,
    setCity,
    setSortBy,
    setSortOrder,
    resetFilters,
} = sellPropertyInquirySlice.actions;

export default sellPropertyInquirySlice.reducer;
