import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../REDUX_SLICES/auth/authSlice";
import { authApi } from "../REDUX_SLICES/auth/authApi";
import propertyReducer from "../../Components/Admin_Segment/Admin_Redux/PropertyApi/propertySlice";
import { propertyApi } from "../../Components/Admin_Segment/Admin_Redux/PropertyApi/propertyApi";
import userPropertyReducer from "../REDUX_SLICES/userPropertyApi/userPropertySlice";
import { userPropertyApi } from "../REDUX_SLICES/userPropertyApi/userPropertyApi";
import { eliteServiceApi } from "../../Components/Admin_Segment/Admin_Redux/EliteServiceApi/eliteServiceApi";
import eliteServiceReducer from "../../Components/Admin_Segment/Admin_Redux/EliteServiceApi/eliteServiceSlice";

import { userEliteServiceApi } from "../REDUX_SLICES/userEliteServiceApi/userEliteServiceApi";
import userEliteServiceReducer from "../REDUX_SLICES/userEliteServiceApi/userEliteServiceSlice";
import { constantsApi } from "../REDUX_SLICES/constantsApi/constantsApi";
import { userAccommodationInquiryApi } from "../REDUX_SLICES/userAccommodationInquiryApi/userAccommodationInquiryApi";
import { accommodationInquiryApi } from "../../Components/Admin_Segment/Admin_Redux/AccommodationInquiryApi/accommodationInquiryApi";
import accommodationInquiryReducer from "../../Components/Admin_Segment/Admin_Redux/AccommodationInquiryApi/accommodationInquirySlice";

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
        userEliteService: userEliteServiceReducer,
        [userEliteServiceApi.reducerPath]: userEliteServiceApi.reducer,
        [constantsApi.reducerPath]: constantsApi.reducer,
        [userAccommodationInquiryApi.reducerPath]: userAccommodationInquiryApi.reducer,
        accommodationInquiry: accommodationInquiryReducer,
        [accommodationInquiryApi.reducerPath]: accommodationInquiryApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(
            authApi.middleware,
            propertyApi.middleware,
            userPropertyApi.middleware,
            eliteServiceApi.middleware,
            userEliteServiceApi.middleware,
            constantsApi.middleware,
            userAccommodationInquiryApi.middleware,
            accommodationInquiryApi.middleware
        ),
});



export default store;