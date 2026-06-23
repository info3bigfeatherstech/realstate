import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

const CustomerProtectedRoute = ({ children, allowedAccountTypes }) => {
  const { isAuthenticated, authChecked, user } = useSelector((state) => state.customerAuth);
  const location = useLocation();

  if (!authChecked) {
    return (
      <div className="min-h-[40vh] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    const returnUrl = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`customer/login?returnUrl=${returnUrl}`} replace />;
  }

  if (allowedAccountTypes?.length && !allowedAccountTypes.includes(user?.accountType)) {
    return <Navigate to="/customer/dashboard" replace />;
  }

  return children;
};

export default CustomerProtectedRoute;
