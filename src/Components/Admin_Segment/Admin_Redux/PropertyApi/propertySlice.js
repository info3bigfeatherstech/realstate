// src/REDUX_FEATURES/REDUX_SLICES/property/propertySlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    // Pagination
    page: 1,
    limit: 10,

    // Filters
    search: "",
    listingType: "",
    propertyType: "",
    status: "",
    city: "",

    // Sorting
    sortBy: "createdAt",
    sortOrder: "desc", // asc or desc

    // UI State
    selectedIds: [],
    isFilterOpen: false,
};

const propertySlice = createSlice({
    name: "property",
    initialState,
    reducers: {
        setPage: (state, action) => {
            state.page = action.payload;
        },
        setLimit: (state, action) => {
            state.limit = action.payload;
            state.page = 1; // Reset to first page
        },
        setSearch: (state, action) => {
            state.search = action.payload;
            state.page = 1;
        },
        setListingType: (state, action) => {
            state.listingType = action.payload;
            state.page = 1;
        },
        setPropertyType: (state, action) => {
            state.propertyType = action.payload;
            state.page = 1;
        },
        setStatus: (state, action) => {
            state.status = action.payload;
            state.page = 1;
        },
        setCity: (state, action) => {
            state.city = action.payload;
            state.page = 1;
        },
        setSortBy: (state, action) => {
            state.sortBy = action.payload;
        },
        setSortOrder: (state, action) => {
            state.sortOrder = action.payload;
        },
        toggleSortOrder: (state) => {
            state.sortOrder = state.sortOrder === "asc" ? "desc" : "asc";
        },
        toggleSelectId: (state, action) => {
            const id = action.payload;
            if (state.selectedIds.includes(id)) {
                state.selectedIds = state.selectedIds.filter((selectedId) => selectedId !== id);
            } else {
                state.selectedIds.push(id);
            }
        },
        selectAllIds: (state, action) => {
            state.selectedIds = action.payload;
        },
        clearSelectedIds: (state) => {
            state.selectedIds = [];
        },
        toggleFilterOpen: (state) => {
            state.isFilterOpen = !state.isFilterOpen;
        },
        resetFilters: (state) => {
            state.search = "";
            state.listingType = "";
            state.propertyType = "";
            state.status = "";
            state.city = "";
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
    setListingType,
    setPropertyType,
    setStatus,
    setCity,
    setSortBy,
    setSortOrder,
    toggleSortOrder,
    toggleSelectId,
    selectAllIds,
    clearSelectedIds,
    toggleFilterOpen,
    resetFilters,
} = propertySlice.actions;

export default propertySlice.reducer;