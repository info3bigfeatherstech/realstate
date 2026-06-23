import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const CustomerProtectedRoute = ({ children }) => {
    const { isAuthenticated, authChecked } = useSelector((state) => state.customerAuth);

    if (!authChecked) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="w-10 h-10 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/customer/login" replace />;
    }

    return children;
};

export default CustomerProtectedRoute;
