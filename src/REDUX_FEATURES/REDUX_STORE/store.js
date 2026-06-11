import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../REDUX_SLICES/auth/authSlice";
import { authApi } from "../REDUX_SLICES/auth/authApi";
import propertyReducer from "../../Components/Admin_Segment/Admin_Redux/PropertyApi/propertySlice";
import { propertyApi } from "../../Components/Admin_Segment/Admin_Redux/PropertyApi/propertyApi";
import userPropertyReducer from "../REDUX_SLICES/userPropertyApi/userPropertySlice";
import { userPropertyApi } from "../REDUX_SLICES/userPropertyApi/userPropertyApi";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        [authApi.reducerPath]: authApi.reducer,
        property: propertyReducer,
        [propertyApi.reducerPath]: propertyApi.reducer,
        userProperty: userPropertyReducer,
        [userPropertyApi.reducerPath]: userPropertyApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(authApi.middleware, propertyApi.middleware, userPropertyApi.middleware),
});



export default store;