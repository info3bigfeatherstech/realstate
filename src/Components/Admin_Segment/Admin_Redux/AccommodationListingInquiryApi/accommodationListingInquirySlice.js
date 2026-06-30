// src/admin/redux/AccommodationListingInquiryApi/accommodationListingInquirySlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    page: 1,
    limit: 10,
    search: "",
    status: "",
    listingType: "",
    propertyType: "",
    listingUrgency: "",
    city: "",
    sortBy: "createdAt",
    sortOrder: "desc",
};

const accommodationListingInquirySlice = createSlice({
    name: "accommodationListingInquiry",
    initialState,
    reducers: {
        setPage: (state, action) => { state.page = action.payload; },
        setLimit: (state, action) => { state.limit = action.payload; state.page = 1; },
        setSearch: (state, action) => { state.search = action.payload; state.page = 1; },
        setStatus: (state, action) => { state.status = action.payload; state.page = 1; },
        setListingType: (state, action) => { state.listingType = action.payload; state.page = 1; },
        setPropertyType: (state, action) => { state.propertyType = action.payload; state.page = 1; },
        setListingUrgency: (state, action) => { state.listingUrgency = action.payload; state.page = 1; },
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
    setListingType,
    setPropertyType,
    setListingUrgency,
    setCity,
    setSortBy,
    setSortOrder,
    resetFilters,
} = accommodationListingInquirySlice.actions;

export default accommodationListingInquirySlice.reducer;
