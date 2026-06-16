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
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(authApi.middleware, propertyApi.middleware, userPropertyApi.middleware, eliteServiceApi.middleware,userEliteServiceApi.middleware),
});



export default store;