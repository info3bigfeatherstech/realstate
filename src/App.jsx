import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import AdminDashboard from "./Components/Admin_Segment/AdminDashboard";
import LoginPage from "./Components/Admin_Segment/LoginPage/LoginPage";
import ProtectedRoute from "./Components/Admin_Segment/LoginPage/ProtectedRoute";
import { useRefreshTokenMutation, useLazyGetMeQuery, } from "./REDUX_FEATURES/REDUX_SLICES/auth/authApi";
import { clearCredentials, setAuthChecked, setCredentials, } from "./REDUX_FEATURES/REDUX_SLICES/auth/authSlice";
import ToastConfig from "./Components/Shared/ToastConfig";


// Import web page components
import Home from "./Components/WebPages/Home";
import Navbar from "./Components/Common/Navbar";
import Footer from "./Components/Common/Footer";
import PropertyDetailPage from "./Components/UserSide/PropertyDetailPage/PropertyDetailPage";
import ContactUs from "./Components/WebPages/ContactUs/ContactUs";
import Eliteservices from "./Components/WebPages/Utilities/Eliteservices";
import Accommodation from "./Components/WebPages/EnquiryPages/Accommodation/Accommodation";


// ─── Routes where Navbar & Footer should NOT appear ──────────────────────────
const SHELL_EXCLUDED_ROUTES = ["/admin", "/login"];

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
  const [refreshToken] = useRefreshTokenMutation();
  const [triggerGetMe] = useLazyGetMeQuery();
  const { isAuthenticated, authChecked } = useSelector((state) => state.auth);

  useEffect(() => {
    const bootstrapAuth = async () => {
      try {
        // Step 1: try to get a fresh access token using the httpOnly refresh cookie
        const refreshPayload = await refreshToken().unwrap();
        const accessToken = refreshPayload?.accessToken;

        if (!accessToken) {
          throw new Error("No access token returned from refresh");
        }

        // Step 2: put token in Redux FIRST so axiosInstance interceptor
        // can attach it as Authorization header for the /me call below
        dispatch(setCredentials({ user: null, accessToken }));

        // Step 3: fetch the current user profile
        const meResult = await triggerGetMe().unwrap();

        // Step 4: finalize auth state with both user + token
        dispatch(setCredentials({ user: meResult, accessToken }));
      } catch (_error) {
        // No valid refresh token (expired/missing) -> clean logged-out state
        dispatch(clearCredentials());
      } finally {
        dispatch(setAuthChecked(true));
      }
    };

    bootstrapAuth();
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
            path="/login"
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
          <Route path="/property/:id" element={<PropertyDetailPage />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/eliteservices" element={<Eliteservices />} />
          <Route path="/enquiry" element={<Accommodation />} />

          {/* catch all redirect to home*/}
          <Route path="*" element={<Navigate to="/" replace />} />

        </Routes>
      </AppShell>
    </BrowserRouter>
  );
}

export default App;