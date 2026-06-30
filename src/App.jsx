import { useEffect, useRef } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import AdminDashboard from "./Components/Admin_Segment/AdminDashboard";
import LoginPage from "./Components/Admin_Segment/LoginPage/LoginPage";
import ProtectedRoute from "./Components/Admin_Segment/LoginPage/ProtectedRoute";
import { useRefreshTokenMutation, useLazyGetMeQuery, } from "./REDUX_FEATURES/REDUX_SLICES/auth/authApi";
import { clearCredentials, setAuthChecked, setCredentials, } from "./REDUX_FEATURES/REDUX_SLICES/auth/authSlice";
import { useRefreshTokenMutation as useCustomerRefreshToken, useLazyGetMeQuery as useLazyCustomerGetMe, } from "./REDUX_FEATURES/REDUX_SLICES/customerAuth/customerAuthApi";
import { clearCredentials as clearCustomerCredentials, setCustomerCredentials, setCustomerAuthChecked, } from "./REDUX_FEATURES/REDUX_SLICES/customerAuth/customerAuthSlice";
import ToastConfig from "./Components/Shared/ToastConfig";


// Import web page components
import Home from "./Components/WebPages/Home";
import Navbar from "./Components/Common/Navbar";
import Footer from "./Components/Common/Footer";
import PropertyDetailPage from "./Components/UserSide/PropertyDetailPage/PropertyDetailPage";
import PropertiesRender from "./Components/UserSide/PropertiesRender/PropertiesRender";
import ContactUs from "./Components/WebPages/ContactUs/ContactUs";
import Eliteservices from "./Components/WebPages/Utilities/Eliteservices";
import Accommodation from "./Components/WebPages/EnquiryPages/Accommodation/Accommodation";
import CustomerLoginPage from "./Components/WebPages/CustomerAuth/CustomerLoginPage";
import CustomerSignupPage from "./Components/WebPages/CustomerAuth/SignupPage";
import CustomerDashboard from "./Components/Customer_Segment/CustomerDashboard";
import CustomerProtectedRoute from "./Components/Customer_Segment/CustomerProtectedRoute";
import VerifyOtpPage from "./Components/WebPages/CustomerAuth/VerifyOtpPage";
import GeneralInquiry from "./Components/WebPages/EnquiryPages/GeneralInquiry/GeneralInquiry";


// ─── Routes where Navbar & Footer should NOT appear ──────────────────────────
const SHELL_EXCLUDED_ROUTES = ["/admin", "/login", "/customer/dashboard"];

function AppShell({ children }) {
  const { pathname } = useLocation();
  const hideShell = SHELL_EXCLUDED_ROUTES.some((route) => pathname.startsWith(route));

  return (
    <>
      {!hideShell && <Navbar />}
      <ToastConfig />
      {children}
      {!hideShell && <Footer />}
    </>
  );
}


function App() {
  const dispatch = useDispatch();
  const hasBootstrapped = useRef(false);

  // ─── Admin Auth ─────────────────────────────────────────────────────────────
  const [refreshToken] = useRefreshTokenMutation();
  const [triggerGetMe] = useLazyGetMeQuery();
  const { isAuthenticated, authChecked } = useSelector((state) => state.auth);

  // ─── Customer Auth ───────────────────────────────────────────────────────────
  const [customerRefreshToken] = useCustomerRefreshToken();
  const [triggerCustomerGetMe] = useLazyCustomerGetMe();

  useEffect(() => {
    // Guard against React StrictMode double-invoke — only run once per mount
    if (hasBootstrapped.current) return;
    hasBootstrapped.current = true;

    // ── Admin bootstrap ──────────────────────────────────────────────────────
    const bootstrapAuth = async () => {
      try {
        const refreshPayload = await refreshToken().unwrap();
        const accessToken = refreshPayload?.accessToken;
        if (!accessToken) throw new Error("No access token returned from refresh");
        dispatch(setCredentials({ user: null, accessToken }));
        const meResult = await triggerGetMe().unwrap();
        dispatch(setCredentials({ user: meResult, accessToken }));
      } catch (_error) {
        dispatch(clearCredentials());
      } finally {
        dispatch(setAuthChecked(true));
      }
    };

    // ── Customer bootstrap ───────────────────────────────────────────────────
    const bootstrapCustomerAuth = async () => {
      try {
        const refreshPayload = await customerRefreshToken().unwrap();
        const accessToken = refreshPayload?.accessToken;
        if (!accessToken) throw new Error("No customer access token returned from refresh");
        dispatch(setCustomerCredentials({ user: null, accessToken }));
        const meResult = await triggerCustomerGetMe().unwrap();
        dispatch(setCustomerCredentials({ user: meResult, accessToken }));
      } catch (_error) {
        dispatch(clearCustomerCredentials());
      } finally {
        dispatch(setCustomerAuthChecked(true));
      }
    };

    // Run both bootstraps in parallel — halves startup time
    Promise.all([bootstrapAuth(), bootstrapCustomerAuth()]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!authChecked) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <BrowserRouter>
      <AppShell>
        <Routes>
          <Route
            path="/admin/login"
            element={isAuthenticated ? <Navigate to="/admin" replace /> : <LoginPage />}
          />

          {/* Admin Routes Start */}
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          {/* Admin Routes End */}


          {/* public web routes */}
          <Route path="/" element={<Home />} />
          <Route path="/properties" element={<PropertiesRender />} />
          <Route path="/property/:id" element={<PropertyDetailPage />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/eliteservices" element={<Eliteservices />} />
          <Route path="/enquiry" element={< GeneralInquiry/>} />

          {/* Customer Routes Start */}
          <Route path="/customer/login" element={<CustomerLoginPage />} />
          <Route path="/customer/signup" element={<CustomerSignupPage />} />
          <Route path="/customer/verify-otp" element={<VerifyOtpPage />} />
          <Route
            path="/customer/dashboard"
            element={
              <CustomerProtectedRoute>
                <CustomerDashboard />
              </CustomerProtectedRoute>
            }
          />
          {/* Customer Routes End */}

          {/* catch all redirect to home*/}
          <Route path="*" element={<Navigate to="/" replace />} />

        </Routes>
      </AppShell>
    </BrowserRouter>
  );
}

export default App;