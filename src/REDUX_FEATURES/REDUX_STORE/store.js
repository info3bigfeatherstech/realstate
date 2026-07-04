import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../REDUX_SLICES/auth/authSlice";
import { authApi } from "../REDUX_SLICES/auth/authApi";
import propertyReducer from "../../Components/Admin_Segment/Admin_Redux/PropertyApi/propertySlice";
import { propertyApi } from "../../Components/Admin_Segment/Admin_Redux/PropertyApi/propertyApi";
import userPropertyReducer from "../REDUX_SLICES/userPropertyApi/userPropertySlice";
import { userPropertyApi } from "../REDUX_SLICES/userPropertyApi/userPropertyApi";
import { eliteServiceApi } from "../../Components/Admin_Segment/Admin_Redux/EliteServiceApi/eliteServiceApi";
import eliteServiceReducer from "../../Components/Admin_Segment/Admin_Redux/EliteServiceApi/eliteServiceSlice";
import { eliteConfigApi } from "../../Components/Admin_Segment/Admin_Redux/EliteConfigApi/eliteConfigApi";

import { userEliteServiceApi } from "../REDUX_SLICES/userEliteServiceApi/userEliteServiceApi";
import userEliteServiceReducer from "../REDUX_SLICES/userEliteServiceApi/userEliteServiceSlice";
import { constantsApi } from "../REDUX_SLICES/constantsApi/constantsApi";
import { userAccommodationInquiryApi } from "../REDUX_SLICES/userAccommodationInquiryApi/userAccommodationInquiryApi";
import { accommodationInquiryApi } from "../../Components/Admin_Segment/Admin_Redux/AccommodationInquiryApi/accommodationInquiryApi";
import accommodationInquiryReducer from "../../Components/Admin_Segment/Admin_Redux/AccommodationInquiryApi/accommodationInquirySlice";

import { buyPropertyInquiryApi } from "../../Components/Admin_Segment/Admin_Redux/BuyPropertyInquiryApi/buyPropertyInquiryApi";
import buyPropertyInquiryReducer from "../../Components/Admin_Segment/Admin_Redux/BuyPropertyInquiryApi/buyPropertyInquirySlice";

import { sellPropertyInquiryApi } from "../../Components/Admin_Segment/Admin_Redux/SellPropertyInquiryApi/sellPropertyInquiryApi";
import sellPropertyInquiryReducer from "../../Components/Admin_Segment/Admin_Redux/SellPropertyInquiryApi/sellPropertyInquirySlice";

import { accommodationListingInquiryApi } from "../../Components/Admin_Segment/Admin_Redux/AccommodationListingInquiryApi/accommodationListingInquiryApi";
import accommodationListingInquiryReducer from "../../Components/Admin_Segment/Admin_Redux/AccommodationListingInquiryApi/accommodationListingInquirySlice";

import { inquiryApi } from "../../Components/Admin_Segment/Admin_Redux/InquiryApi/inquiryApi";
import { customerAdminApi } from "../../Components/Admin_Segment/Admin_Redux/CustomerApi/customerAdminApi";

import customerAuthReducer from "../REDUX_SLICES/customerAuth/customerAuthSlice";
import { customerAuthApi } from "../REDUX_SLICES/customerAuth/customerAuthApi";
import { customerInquiryApi } from "../REDUX_SLICES/customerInquiryApi/customerInquiryApi";
import customerPropertyReducer from "../REDUX_SLICES/customerPropertyApi/customerPropertySlice";
import { customerPropertyApi } from "../REDUX_SLICES/customerPropertyApi/customerPropertyApi";

// New modules
import { inventoryItemApi } from "../../Components/Admin_Segment/Admin_Redux/InventoryItemApi/inventoryItemApi";
import { customerInventoryApi } from "../REDUX_SLICES/customerInventoryApi/customerInventoryApi";
import { tenantEntryApi } from "../REDUX_SLICES/tenantEntryApi/tenantEntryApi";
import { tenantExitApi } from "../REDUX_SLICES/tenantExitApi/tenantExitApi";

// Recovered modules (estate commit)
import { propertyViewsApi } from "../../Components/Admin_Segment/Admin_Redux/PropertyViewsApi/propertyViewsApi";
import { adminBadgeApi } from "../../Components/Admin_Segment/Admin_Redux/AdminBadgeApi/adminBadgeApi";
import { adminSocialApi } from "../../Components/Admin_Segment/Admin_Redux/AdminSocialApi/adminSocialApi";
import { generalInquiryApi } from "../../Components/Admin_Segment/Admin_Redux/GeneralInquiryApi/generalInquiryApi";
import generalInquiryReducer from "../../Components/Admin_Segment/Admin_Redux/GeneralInquiryApi/generalInquirySlice";
import { inventoryCategoryApi } from "../../Components/Admin_Segment/Admin_Redux/InventoryCategoryApi/inventoryCategoryApi";
import { adminReportsApi } from "../../Components/Admin_Segment/Admin_Redux/AdminReportsApi/adminReportsApi";
import { agentBadgeApi } from "../REDUX_SLICES/agentBadgeApi/agentBadgeApi";
import { customerKeysApi } from "../REDUX_SLICES/customerKeysApi/customerKeysApi";
import { userGeneralInquiryApi } from "../REDUX_SLICES/userGeneralInquiryApi/userGeneralInquiryApi";
import { userSocialApi } from "../REDUX_SLICES/userSocialApi/userSocialApi";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        [authApi.reducerPath]: authApi.reducer,
        property: propertyReducer,
        [propertyApi.reducerPath]: propertyApi.reducer,
        userProperty: userPropertyReducer,
        [userPropertyApi.reducerPath]: userPropertyApi.reducer,
        eliteService: eliteServiceReducer,
        [eliteServiceApi.reducerPath]: eliteServiceApi.reducer,
        [eliteConfigApi.reducerPath]: eliteConfigApi.reducer,
        userEliteService: userEliteServiceReducer,
        [userEliteServiceApi.reducerPath]: userEliteServiceApi.reducer,
        [constantsApi.reducerPath]: constantsApi.reducer,
        [userAccommodationInquiryApi.reducerPath]: userAccommodationInquiryApi.reducer,
        accommodationInquiry: accommodationInquiryReducer,
        [accommodationInquiryApi.reducerPath]: accommodationInquiryApi.reducer,

        buyPropertyInquiry: buyPropertyInquiryReducer,
        [buyPropertyInquiryApi.reducerPath]: buyPropertyInquiryApi.reducer,

        sellPropertyInquiry: sellPropertyInquiryReducer,
        [sellPropertyInquiryApi.reducerPath]: sellPropertyInquiryApi.reducer,

        accommodationListingInquiry: accommodationListingInquiryReducer,
        [accommodationListingInquiryApi.reducerPath]: accommodationListingInquiryApi.reducer,

        [inquiryApi.reducerPath]: inquiryApi.reducer,
        [customerAdminApi.reducerPath]: customerAdminApi.reducer,

        customerAuth: customerAuthReducer,
        [customerAuthApi.reducerPath]: customerAuthApi.reducer,
        [customerInquiryApi.reducerPath]: customerInquiryApi.reducer,
        customerProperty: customerPropertyReducer,
        [customerPropertyApi.reducerPath]: customerPropertyApi.reducer,

        // New Reducers
        [inventoryItemApi.reducerPath]: inventoryItemApi.reducer,
        [customerInventoryApi.reducerPath]: customerInventoryApi.reducer,
        [tenantEntryApi.reducerPath]: tenantEntryApi.reducer,
        [tenantExitApi.reducerPath]: tenantExitApi.reducer,

        // Recovered Reducers (estate commit)
        [propertyViewsApi.reducerPath]: propertyViewsApi.reducer,
        [adminBadgeApi.reducerPath]: adminBadgeApi.reducer,
        [adminSocialApi.reducerPath]: adminSocialApi.reducer,
        generalInquiry: generalInquiryReducer,
        [generalInquiryApi.reducerPath]: generalInquiryApi.reducer,
        [inventoryCategoryApi.reducerPath]: inventoryCategoryApi.reducer,
        [adminReportsApi.reducerPath]: adminReportsApi.reducer,
        [agentBadgeApi.reducerPath]: agentBadgeApi.reducer,
        [customerKeysApi.reducerPath]: customerKeysApi.reducer,
        [userGeneralInquiryApi.reducerPath]: userGeneralInquiryApi.reducer,
        [userSocialApi.reducerPath]: userSocialApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(
            authApi.middleware,
            propertyApi.middleware,
            userPropertyApi.middleware,
            eliteServiceApi.middleware,
            eliteConfigApi.middleware,
            userEliteServiceApi.middleware,
            constantsApi.middleware,
            userAccommodationInquiryApi.middleware,
            accommodationInquiryApi.middleware,
            buyPropertyInquiryApi.middleware,
            sellPropertyInquiryApi.middleware,
            accommodationListingInquiryApi.middleware,
            inquiryApi.middleware,
            customerAdminApi.middleware,
            customerAuthApi.middleware,
            customerInquiryApi.middleware,
            customerPropertyApi.middleware,
            
            // New Middlewares
            inventoryItemApi.middleware,
            customerInventoryApi.middleware,
            tenantEntryApi.middleware,
            tenantExitApi.middleware,

            // Recovered Middlewares (estate commit)
            propertyViewsApi.middleware,
            adminBadgeApi.middleware,
            adminSocialApi.middleware,
            generalInquiryApi.middleware,
            inventoryCategoryApi.middleware,
            adminReportsApi.middleware,
            agentBadgeApi.middleware,
            customerKeysApi.middleware,
            userGeneralInquiryApi.middleware,
            userSocialApi.middleware
        ),
});

export default store;
