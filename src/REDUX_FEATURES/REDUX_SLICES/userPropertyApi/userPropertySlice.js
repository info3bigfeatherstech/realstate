// src/User/api/userPropertySlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    page: 1,
    limit: 12,
    search: "",
    listingType: "",
    propertyType: "",
    city: "",
    minPrice: "",
    maxPrice: "",
    minBedrooms: "",
    sortBy: "publishedAt",
    sortOrder: "desc",
};

const userPropertySlice = createSlice({
    name: "userProperty",
    initialState,
    reducers: {
        setPage: (state, action) => { state.page = action.payload; },
        setLimit: (state, action) => { state.limit = action.payload; state.page = 1; },
        setSearch: (state, action) => { state.search = action.payload; state.page = 1; },
        setListingType: (state, action) => { state.listingType = action.payload; state.page = 1; },
        setPropertyType: (state, action) => { state.propertyType = action.payload; state.page = 1; },
        setCity: (state, action) => { state.city = action.payload; state.page = 1; },
        setMinPrice: (state, action) => { state.minPrice = action.payload; state.page = 1; },
        setMaxPrice: (state, action) => { state.maxPrice = action.payload; state.page = 1; },
        setMinBedrooms: (state, action) => { state.minBedrooms = action.payload; state.page = 1; },
        setSortBy: (state, action) => { state.sortBy = action.payload; },
        setSortOrder: (state, action) => { state.sortOrder = action.payload; },
        resetFilters: (state) => { Object.assign(state, initialState); },
    },
});

export const { setPage, setLimit, setSearch, setListingType, setPropertyType, setCity, setMinPrice, setMaxPrice, setMinBedrooms, setSortBy, setSortOrder, resetFilters } = userPropertySlice.actions;
export default userPropertySlice.reducer;