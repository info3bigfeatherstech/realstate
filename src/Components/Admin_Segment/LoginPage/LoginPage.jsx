import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCredentials, setAuthChecked } from "../../../REDUX_FEATURES/REDUX_SLICES/auth/authSlice";
import { useLoginMutation } from "../../../REDUX_FEATURES/REDUX_SLICES/auth/authApi";
import { Eye, EyeOff } from "lucide-react";  // ✅ ADD THIS

const LoginPage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [login, { isLoading, error }] = useLoginMutation();
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [showPassword, setShowPassword] = useState(false);  // ✅ ADD THIS

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await login(formData).unwrap();

            dispatch(setCredentials({
                user: response.user,
                accessToken: response.accessToken,
            }));
            dispatch(setAuthChecked(true));

            navigate("/admin");
        } catch (err) {
            console.error("Login error:", err);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                        RE
                    </div>
                    <h1 className="text-2xl font-bold text-slate-800">Admin Login</h1>
                    <p className="text-slate-500 text-sm mt-1">Real Estate Dashboard</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            Email Address
                        </label>
                        <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            Password
                        </label>
                        <div className="relative">  {/* ✅ ADD THIS DIV */}
                            <input
                                type={showPassword ? "text" : "password"}  // ✅ CHANGE THIS
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                className="w-full px-4 py-2 pr-10 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                            >
                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>  {/* ✅ END DIV */}
                    </div>

                    {error && (
                        <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
                            {error.data?.message || "Login failed. Please try again."}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? "Logging in..." : "Login"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;

// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useDispatch } from "react-redux";
// import { setCredentials, setAuthChecked } from "../../../REDUX_FEATURES/REDUX_SLICES/auth/authSlice";
// import { useLoginMutation } from "../../../REDUX_FEATURES/REDUX_SLICES/auth/authApi";

// const LoginPage = () => {
//     const navigate = useNavigate();
//     const dispatch = useDispatch();
//     const [login, { isLoading, error }] = useLoginMutation();
//     const [formData, setFormData] = useState({
//         email: "",
//         password: "",
//     });

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         try {
//             const response = await login(formData).unwrap();

//             dispatch(setCredentials({
//                 user: response.user,
//                 accessToken: response.accessToken,
//             }));
//             dispatch(setAuthChecked(true));

//             navigate("/admin");
//         } catch (err) {
//             console.error("Login error:", err);
//         }
//     };

//     return (
//         <div className="min-h-screen flex items-center justify-center bg-slate-50">
//             <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
//                 <div className="text-center mb-8">
//                     <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
//                         RE
//                     </div>
//                     <h1 className="text-2xl font-bold text-slate-800">Admin Login</h1>
//                     <p className="text-slate-500 text-sm mt-1">Real Estate Dashboard</p>
//                 </div>

//                 <form onSubmit={handleSubmit} className="space-y-5">
//                     <div>
//                         <label className="block text-sm font-medium text-slate-700 mb-1">
//                             Email Address
//                         </label>
//                         <input
//                             type="email"
//                             value={formData.email}
//                             onChange={(e) => setFormData({ ...formData, email: e.target.value })}
//                             className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
//                             required
//                         />
//                     </div>

//                     <div>
//                         <label className="block text-sm font-medium text-slate-700 mb-1">
//                             Password
//                         </label>
//                         <input
//                             type="password"
//                             value={formData.password}
//                             onChange={(e) => setFormData({ ...formData, password: e.target.value })}
//                             className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
//                             required
//                         />
//                     </div>

//                     {error && (
//                         <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
//                             {error.data?.message || "Login failed. Please try again."}
//                         </div>
//                     )}

//                     <button
//                         type="submit"
//                         disabled={isLoading}
//                         className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//                     >
//                         {isLoading ? "Logging in..." : "Login"}
//                     </button>
//                 </form>
//             </div>
//         </div>
//     );
// };

// export default LoginPage;