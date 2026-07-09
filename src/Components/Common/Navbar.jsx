import { useEffect, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { Heart, Menu, X, ChevronDown } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { useLogoutMutation } from "../../REDUX_FEATURES/REDUX_SLICES/customerAuth/customerAuthApi";
import { clearCredentials as clearCustomerCredentials } from "../../REDUX_FEATURES/REDUX_SLICES/customerAuth/customerAuthSlice";
import LOGO from "../../assets/logoinh.png";

// ─── Constants ────────────────────────────────────────────────────────────────

const NAV_LINKS = [
    // { name: "Buy", path: "/buy" },
    // { name: "Rent", path: "/rent" },
    // { name: "New Launch", path: "/new-launch" },
    // { name: "Commercial", path: "/commercial" },
    // { name: "Plots", path: "/plots" },
    // Purane current links ko last me shift kar diya hai
    // { name: "Student Support", path: "#" },
    // { name: "Elite Services", path: "/eliteservices" },
    { name: "Enquiry Form", path: "/enquiry" },
    { name: "Contact Us", path: "/contact" },
];

const OTHER_SERVICES = [
    { name: "Constructions / Renovations", path: "/services/constructions-renovations" },
    { name: "Documentation", path: "/services/documentation" },
    { name: "Loan", path: "/services/loan" },
    { name: "Utility/HelpLines", path: "/services/utility-helplines" }
];

const NAVBAR_BG = "#000000";
const LOGO_CONTENT_TOP_RATIO = 1090 / 3200;
const LOGO_CONTENT_HEIGHT_RATIO = 1088 / 3200;
const LOGO_VISIBLE_HEIGHT = {
    base: 76,
    sm: 80,
    xl: 96,
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function ArrowIcon() {
    return (
        <svg width="11" height="11" viewBox="0 0 10 10" fill="none">
            <path
                d="M1.5 8.5L8.5 1.5M8.5 1.5H3M8.5 1.5V7"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

function NavLink({ item, isActive }) {
    const isFree = item.name.includes("(FREE)");
    const displayName = isFree ? item.name.replace("(FREE)", "").trim() : item.name;

    return (
        <Link 
            to={item.path}
            // Added translate-y-[2px] to push text down perfectly on Y-axis
            className={`group relative flex items-center justify-center rounded-full px-4 py-2.5 text-[15px] lg:text-[16px] font-medium leading-none translate-y-[2px] transition-all duration-300 ${isActive
                ? "bg-[#efefef] text-black"
                : "text-white hover:bg-white/10"
                }`}
        >
            <span className="flex items-center gap-1.5">
                {displayName}
                {isFree && (
                    <span className="inline-flex items-center gap-1 bg-[#efdfb6]/15 px-2 py-0.5 rounded-md border border-[#D4AF37]/45 shadow-[0_0_12px_rgba(212,175,55,0.3)] select-none">
                        <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path 
                                d="M12 2L14.8 8.4L21.2 9.6L16.2 13.9L17.8 20.3L12 16.7L6.2 20.3L7.8 13.9L2.8 9.6L9.2 8.4L12 2Z" 
                                fill="#D4AF37"
                            >
                                <animate 
                                    attributeName="transform" 
                                    type="scale" 
                                    values="1; 1.25; 1" 
                                    keyTimes="0; 0.5; 1" 
                                    dur="1.2s" 
                                    repeatCount="indefinite" 
                                    transform-origin="12 12"
                                />
                                <animate 
                                    attributeName="opacity" 
                                    values="0.6; 1; 0.6" 
                                    dur="1.2s" 
                                    repeatCount="indefinite"
                                />
                            </path>
                        </svg>
                        <span className="text-[10px] font-black text-[#D4AF37] tracking-wider uppercase animate-pulse">
                            Free
                        </span>
                    </span>
                )}
            </span>
        </Link>
    );
}

function MobileNavLink({ item, isActive, onClick }) {
    const isFree = item.name.includes("(FREE)");
    const displayName = isFree ? item.name.replace("(FREE)", "").trim() : item.name;

    return (
        <Link 
            to={item.path}
            onClick={onClick}
            className={`flex items-center justify-between rounded-2xl px-5 py-4 transition-all duration-300 ${isActive ? "bg-black text-white" : "bg-[#f5f5f5] text-black"
                }`}
        >
            <span className="font-medium text-[16px] flex items-center gap-1.5">
                {displayName}
                {isFree && (
                    <span className="inline-flex items-center gap-1 bg-[#efdfb6]/15 px-2 py-0.5 rounded-md border border-[#D4AF37]/45 shadow-[0_0_12px_rgba(212,175,55,0.3)] select-none">
                        <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path 
                                d="M12 2L14.8 8.4L21.2 9.6L16.2 13.9L17.8 20.3L12 16.7L6.2 20.3L7.8 13.9L2.8 9.6L9.2 8.4L12 2Z" 
                                fill="#D4AF37"
                            >
                                <animate 
                                    attributeName="transform" 
                                    type="scale" 
                                    values="1; 1.25; 1" 
                                    keyTimes="0; 0.5; 1" 
                                    dur="1.2s" 
                                    repeatCount="indefinite" 
                                    transform-origin="12 12"
                                />
                                <animate 
                                    attributeName="opacity" 
                                    values="0.6; 1; 0.6" 
                                    dur="1.2s" 
                                    repeatCount="indefinite"
                                />
                            </path>
                        </svg>
                        <span className="text-[10px] font-black text-[#D4AF37] tracking-wider uppercase animate-pulse">
                            Free
                        </span>
                    </span>
                )}
            </span>
            <ArrowIcon />
        </Link>
    );
}

function LogoMark({ visibleHeight }) {
    const fullHeight = visibleHeight / LOGO_CONTENT_HEIGHT_RATIO;
    const offsetTop = -(LOGO_CONTENT_TOP_RATIO * fullHeight);

    return (
        <div
            className="shrink-0 overflow-hidden"
            style={{ height: visibleHeight, width: fullHeight, backgroundColor: NAVBAR_BG }}
        >
            <img
                src={LOGO}
                alt="Mehta Estates"
                className="block max-w-none"
                style={{
                    height: fullHeight,
                    width: fullHeight,
                    marginTop: offsetTop,
                }}
            />
        </div>
    );
}

export default function Navbar() {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [logoutApi] = useLogoutMutation();
    const { isAuthenticated, user } = useSelector((state) => state.customerAuth);
    const [menuOpen, setMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [logoVisibleHeight, setLogoVisibleHeight] = useState(LOGO_VISIBLE_HEIGHT.base);
    const [mobileServicesOpen, setMobileServicesOpen] = useState(false);

    const userInitial = user?.fullName
        ? user.fullName.trim().charAt(0).toUpperCase()
        : (user?.email ? user.email.trim().charAt(0).toUpperCase() : "U");

    const handleNavbarLogout = async () => {
        try {
            await logoutApi().unwrap();
        } catch (_) { /* silent */ } finally {
            dispatch(clearCustomerCredentials());
            navigate("/");
        }
    };

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 10);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        const updateLogoHeight = () => {
            const w = window.innerWidth;
            if (w >= 1280) setLogoVisibleHeight(LOGO_VISIBLE_HEIGHT.xl);
            else if (w >= 640) setLogoVisibleHeight(LOGO_VISIBLE_HEIGHT.sm);
            else setLogoVisibleHeight(LOGO_VISIBLE_HEIGHT.base);
        };
        updateLogoHeight();
        window.addEventListener("resize", updateLogoHeight);
        return () => window.removeEventListener("resize", updateLogoHeight);
    }, []);

    return (
        <>
            {/* ── Desktop/Mobile Header ── */}
            <header
                className={`sticky top-0 font-['satoshi'] z-50 transition-all duration-500 border-b ${scrolled
                    ? "backdrop-blur-xl border-white/10"
                    : "border-transparent"
                    }`}
                style={{ backgroundColor: scrolled ? `${NAVBAR_BG}f2` : NAVBAR_BG }}
            >
                <div className="w-full px-5 md:px-10 lg:px-16">
                    <div className="h-[115px] flex items-center justify-between transition-all duration-300">

                        {/* Left/Logo Group - Taking 50% width on desktop to align nav items to center */}
                        <div className="flex items-center xl:flex-1">
                            <Link 
                                to="/"
                                className="flex shrink-0 items-center select-none"
                                style={{ backgroundColor: NAVBAR_BG }}
                            >
                                <LogoMark visibleHeight={logoVisibleHeight} />
                            </Link>
                        </div>

                        {/* Desktop Navigation Group (Starts from center to right end) */}
                        <div className="hidden xl:flex xl:flex-1 items-center justify-between gap-1.5 h-full pl-6">
                            {/* Inner Left: List Property, Other Services, Enquiry, Contact Us starting from center */}
                            <div className="flex items-center gap-1.5">
                                {/* 1. List Property (FREE) */}
                                <NavLink
                                    item={{ name: "List Property (FREE)", path: "/customer/login" }}
                                    isActive={false}
                                />

                                {/* 2. Other Services Dropdown */}
                                <div className="relative group/dropdown h-full py-5">
                                    <button className="flex items-center gap-1.5 rounded-full px-4 py-2.5 text-[15px] lg:text-[16px] font-medium leading-none text-white hover:bg-white/10 transition-all duration-300 translate-y-[2px]">
                                        <span>Other Services</span>
                                        <ChevronDown size={14} className="transition-transform duration-300 group-hover/dropdown:rotate-180" />
                                    </button>

                                    {/* Dropdown Menu Container */}
                                    <div className="absolute left-0 top-full mt-1 w-64 origin-top-left rounded-2xl bg-white p-2 shadow-xl ring-1 ring-black/5 opacity-0 scale-95 pointer-events-none transition-all duration-200 group-hover/dropdown:opacity-100 group-hover/dropdown:scale-100 group-hover/dropdown:pointer-events-auto z-[60]">
                                        {OTHER_SERVICES.map((service) => (
                                            <Link 
                                                key={service.name}
                                                to={service.path}
                                                className="block rounded-xl px-4 py-3 text-[14px] font-medium text-slate-800 hover:bg-slate-50 transition-colors"
                                            >
                                                {service.name}
                                            </Link>
                                        ))}
                                    </div>
                                </div>

                                {/* 3. Enquiry Form */}
                                <NavLink
                                    item={{ name: "Enquiry Form", path: "/enquiry" }}
                                    isActive={location.pathname === "/enquiry"}
                                />

                                {/* 4. Contact Us */}
                                <NavLink
                                    item={{ name: "Contact Us", path: "/contact" }}
                                    isActive={location.pathname === "/contact"}
                                />
                            </div>

                            {/* Inner Right: Wishlist & Login/Sign In */}
                            <div className="flex items-center gap-3">
                                {/* 5. Wishlist Icon Action Link */}
                                <button className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white transition-all duration-300 hover:bg-white/20">
                                    <Heart size={18} />
                                </button>

                                {/* 6. Authenticated Login Avatar Indicator Frame with Hover Dropdown */}
                                {isAuthenticated ? (
                                    <div className="relative group/user h-full py-5">
                                        {/* Trigger pill */}
                                        <button className="flex items-center gap-2 rounded-full border border-white/20 bg-white/10 p-2 text-white hover:bg-white/20 transition-all duration-300">
                                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#D4AF37] text-[14px] font-bold text-[#0f0301] shadow-inner">
                                                {userInitial}
                                            </div>
                                            <span className="text-[14px] font-medium pr-2 hidden sm:inline">{user?.fullName || "Account"}</span>
                                            <ChevronDown size={13} className="mr-1 text-white/60 transition-transform duration-300 group-hover/user:rotate-180" />
                                        </button>

                                        {/* Dropdown Menu */}
                                        <div className="absolute right-0 top-full mt-1 w-52 origin-top-right rounded-2xl bg-white p-2 shadow-xl ring-1 ring-black/5 opacity-0 scale-95 pointer-events-none transition-all duration-200 group-hover/user:opacity-100 group-hover/user:scale-100 group-hover/user:pointer-events-auto z-[60]">
                                            {/* User info strip */}
                                            <div className="px-4 py-2.5 border-b border-slate-100 mb-1">
                                                <p className="text-[13px] font-semibold text-slate-800 truncate">{user?.fullName}</p>
                                                <p className="text-[11px] text-slate-400 truncate">{user?.email}</p>
                                            </div>
                                            {/* Dashboard link */}
                                            <button
                                                onClick={() => navigate("/customer/dashboard")}
                                                className="w-full flex items-center gap-3 rounded-xl px-4 py-2.5 text-[14px] font-medium text-slate-700 hover:bg-slate-50 transition-colors text-left"
                                            >
                                                <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                                </svg>
                                                Dashboard
                                            </button>
                                            {/* Logout */}
                                            <button
                                                onClick={handleNavbarLogout}
                                                className="w-full flex items-center gap-3 rounded-xl px-4 py-2.5 text-[14px] font-medium text-red-500 hover:bg-red-50 transition-colors text-left"
                                            >
                                                <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                                </svg>
                                                Sign Out
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => navigate("/customer/login")}
                                        className="flex h-11 items-center justify-center rounded-full border border-white/15 bg-white/10 px-5 text-white text-[15px] font-medium transition-all duration-300 hover:bg-white/20"
                                    >
                                        Sign In
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Mobile menu hamburger icon */}
                        <button
                            onClick={() => setMenuOpen(!menuOpen)}
                            className="flex xl:hidden h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white"
                        >
                            {menuOpen ? <X size={20} /> : <Menu size={20} />}
                        </button>
                    </div>
                </div>
            </header>

            {/* ── Smooth Animated Mobile Drawer ── */}
            <div
                className={`fixed inset-0 z-[99] bg-black/40 backdrop-blur-sm xl:hidden transition-opacity duration-300 ${menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                    }`}
                onClick={() => setMenuOpen(false)}
            />

            <div
                className={`fixed right-0 top-0 bottom-0 z-[100] h-full w-[82%] max-w-[340px] bg-white xl:hidden flex flex-col shadow-2xl transition-transform duration-300 ease-in-out transform ${menuOpen ? "translate-x-0" : "translate-x-full"
                    }`}
            >
                {/* Drawer header */}
                <div className="flex items-center justify-between border-b border-black/5 px-6 py-6">
                    <div>
                        <p className="text-[11px] uppercase tracking-[0.2em] text-zinc-400">Real Estate</p>
                        <h2 className="mt-2 text-[28px] font-bold text-black">Menu</h2>
                    </div>
                    <button
                        onClick={() => setMenuOpen(false)}
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f3f3f3]"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Drawer navigation links */}
                <div className="px-4 py-5 flex flex-col gap-2 overflow-y-auto flex-1">

                    {/* 1. List Property (FREE) */}
                    <MobileNavLink
                        item={{ name: "List Property (FREE)", path: "/customer/login" }}
                        isActive={false}
                        onClick={() => setMenuOpen(false)}
                    />

                    {/* 2. Mobile Menu Dropdown Wrapper: Other Services */}
                    <div className="flex flex-col rounded-2xl bg-[#f5f5f5] overflow-hidden transition-all duration-300">
                        <button
                            onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
                            className="flex items-center justify-between px-5 py-4 text-black text-left"
                        >
                            <span className="font-medium text-[16px]">Other Services</span>
                            <ChevronDown size={16} className={`transition-transform duration-300 ${mobileServicesOpen ? "rotate-180" : ""}`} />
                        </button>

                        <div className={`flex flex-col bg-stone-50 border-t border-black/5 transition-all duration-300 ${mobileServicesOpen ? "max-h-60 opacity-100 py-2" : "max-h-0 opacity-0 pointer-events-none"}`}>
                            {OTHER_SERVICES.map((service) => (
                                <Link
                                    key={service.name}
                                    to={service.path}
                                    onClick={() => setMenuOpen(false)}
                                    className="block px-8 py-3 text-[14px] font-medium text-zinc-700 hover:text-black transition-colors"
                                >
                                    {service.name}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* 3. Enquiry Form & 4. Contact Us */}
                    {NAV_LINKS.map((item) => (
                        <MobileNavLink
                            key={item.name}
                            item={item}
                            isActive={location.pathname === item.path}
                            onClick={() => setMenuOpen(false)}
                        />
                    ))}

                    {/* Mobile Auth Section */}
                    <div className="mt-2 border-t border-black/5 pt-4">
                        {isAuthenticated ? (
                            <button
                                onClick={() => {
                                    setMenuOpen(false);
                                    navigate("/customer/dashboard");
                                }}
                                className="flex w-full items-center gap-3 rounded-2xl bg-[#f5f5f5] p-4 text-black text-left"
                            >
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#D4AF37] text-[15px] font-bold text-[#0f0301]">
                                    {userInitial}
                                </div>
                                <div className="overflow-hidden">
                                    <p className="font-semibold text-[15px] leading-tight truncate">{user?.fullName || "User"}</p>
                                    <p className="text-[12px] text-zinc-500 leading-tight truncate">{user?.email}</p>
                                </div>
                            </button>
                        ) : (
                            <button
                                onClick={() => {
                                    setMenuOpen(false);
                                    navigate("/customer/login");
                                }}
                                className="flex w-full items-center justify-center rounded-2xl bg-black py-4 font-semibold text-white transition-all hover:bg-[#222]"
                            >
                                Sign In
                            </button>
                        )}
                    </div>

                    {/* CTA Card element block */}
                    <div className="mt-5 rounded-[30px] bg-[#f5f5f5] p-5">
                        <p className="text-[12px] uppercase tracking-[0.2em] text-zinc-500">Premium Living</p>
                        <h3 className="mt-3 text-[24px] font-bold leading-tight text-black">
                            Find Your Perfect Property
                        </h3>
                        <button className="mt-6 flex w-full items-center justify-between rounded-full bg-black px-5 py-4 text-white transition-all hover:bg-[#222]">
                            <span className="font-medium">Explore Now</span>
                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-black">
                                <ArrowIcon />
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}

// import { useEffect, useState } from "react";
// import { useLocation } from "react-router-dom";
// import { Heart, Menu, X } from "lucide-react";
// import LOGO from "../../assets/m.png";

// // ─── Constants ────────────────────────────────────────────────────────────────

// const NAV_LINKS = [
//     // { name: "Buy", path: "/buy" },
//     // { name: "Rent", path: "/rent" },
//     // { name: "New Launch", path: "/new-launch" },
//     // { name: "Commercial", path: "/commercial" },
//     { name: "Plots", path: "/plots" },
//     { name: "Enquiry Form", path: "/enquiry" },
//     // Purane current links ko last me shift kar diya hai
//     { name: "Contact Us", path: "/contact" },
//     { name: "Student Support", path: "#" },
//     { name: "Elite Services", path: "/eliteservices" }
// ];

// const NAVBAR_BG = "#0f0301";
// const LOGO_CONTENT_TOP_RATIO = 825 / 4500;
// const LOGO_CONTENT_HEIGHT_RATIO = 2480 / 4500;
// const LOGO_VISIBLE_HEIGHT = {
//     base: 68,
//     sm: 76,
//     xl: 88,
// };

// // ─── Sub-components ───────────────────────────────────────────────────────────

// function ArrowIcon() {
//     return (
//         <svg width="11" height="11" viewBox="0 0 10 10" fill="none">
//             <path
//                 d="M1.5 8.5L8.5 1.5M8.5 1.5H3M8.5 1.5V7"
//                 stroke="currentColor"
//                 strokeWidth="1.6"
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//             />
//         </svg>
//     );
// }

// function NavLink({ item, isActive }) {
//     return (
//         <a
//             href={item.path}
//             // Added translate-y-[2px] to push text down perfectly on Y-axis
//             className={`group relative flex items-center justify-center rounded-full px-4 py-2.5 text-[15px] lg:text-[16px] font-medium leading-none translate-y-[2px] transition-all duration-300 ${isActive
//                 ? "bg-[#efefef] text-black"
//                 : "text-white hover:bg-white/10"
//                 }`}
//         >
//             <span>{item.name}</span>
//         </a>
//     );
// }

// function MobileNavLink({ item, isActive, onClick }) {
//     return (
//         <a
//             href={item.path}
//             onClick={onClick}
//             className={`flex items-center justify-between rounded-2xl px-5 py-4 transition-all duration-300 ${isActive ? "bg-black text-white" : "bg-[#f5f5f5] text-black"
//                 }`}
//         >
//             <span className="font-medium text-[16px]">{item.name}</span>
//             <ArrowIcon />
//         </a>
//     );
// }

// function LogoMark({ visibleHeight }) {
//     const fullHeight = visibleHeight / LOGO_CONTENT_HEIGHT_RATIO;
//     const offsetTop = -(LOGO_CONTENT_TOP_RATIO * fullHeight);

//     return (
//         <div
//             className="shrink-0 overflow-hidden"
//             style={{ height: visibleHeight, width: fullHeight, backgroundColor: NAVBAR_BG }}
//         >
//             <img
//                 src={LOGO}
//                 alt="Mehta Estates"
//                 className="block max-w-none"
//                 style={{
//                     height: fullHeight,
//                     width: fullHeight,
//                     marginTop: offsetTop,
//                 }}
//             />
//         </div>
//     );
// }

// export default function Navbar() {
//     const location = useLocation();
//     const [menuOpen, setMenuOpen] = useState(false);
//     const [scrolled, setScrolled] = useState(false);
//     const [logoVisibleHeight, setLogoVisibleHeight] = useState(LOGO_VISIBLE_HEIGHT.base);

//     useEffect(() => {
//         const handleScroll = () => setScrolled(window.scrollY > 10);
//         window.addEventListener("scroll", handleScroll);
//         return () => window.removeEventListener("scroll", handleScroll);
//     }, []);

//     useEffect(() => {
//         const updateLogoHeight = () => {
//             const w = window.innerWidth;
//             if (w >= 1280) setLogoVisibleHeight(LOGO_VISIBLE_HEIGHT.xl);
//             else if (w >= 640) setLogoVisibleHeight(LOGO_VISIBLE_HEIGHT.sm);
//             else setLogoVisibleHeight(LOGO_VISIBLE_HEIGHT.base);
//         };
//         updateLogoHeight();
//         window.addEventListener("resize", updateLogoHeight);
//         return () => window.removeEventListener("resize", updateLogoHeight);
//     }, []);

//     return (
//         <>
//             {/* ── Desktop/Mobile Header ── */}
//             <header
//                 className={`sticky top-0 font-['satoshi'] z-50 transition-all duration-500 border-b ${scrolled
//                     ? "backdrop-blur-xl border-white/10"
//                     : "border-transparent"
//                     }`}
//                 style={{ backgroundColor: scrolled ? `${NAVBAR_BG}f2` : NAVBAR_BG }}
//             >
//                 <div className="w-full px-5 md:px-10 lg:px-16">
//                     <div className="h-[88px] flex items-center justify-between transition-all duration-300">

//                         {/* Left Group */}
//                         <div className="flex items-center gap-6 lg:gap-10">
//                             <a
//                                 href="/"
//                                 className="flex shrink-0 items-center select-none"
//                                 style={{ backgroundColor: NAVBAR_BG }}
//                             >
//                                 <LogoMark visibleHeight={logoVisibleHeight} />
//                             </a>

//                             {/* Center Navigation Links Panel with clear baseline height */}
//                             <nav className="hidden xl:flex items-center h-full">
//                                 <div className="flex items-center gap-1">
//                                     {NAV_LINKS.map((item) => (
//                                         <NavLink
//                                             key={item.name}
//                                             item={item}
//                                             isActive={location.pathname === item.path}
//                                         />
//                                     ))}
//                                 </div>
//                             </nav>
//                         </div>

//                         {/* Right Group */}
//                         <div className="hidden xl:flex items-center gap-3">
//                             <button className="group flex items-center gap-3 rounded-full bg-white pl-5 pr-2 py-2 text-black transition-all duration-300 hover:bg-white/90">
//                                 <span className="text-[14px] font-medium">List Property (FREE)</span>
//                                 <div
//                                     className="flex h-9 w-9 items-center justify-center rounded-full text-white transition-transform duration-300 group-hover:rotate-45"
//                                     style={{ backgroundColor: NAVBAR_BG }}
//                                 >
//                                     <ArrowIcon />
//                                 </div>
//                             </button>

//                             <button className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white transition-all duration-300 hover:bg-white/20">
//                                 <Heart size={18} />
//                             </button>

//                             <button className="flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-2 pr-4 py-2 text-white">
//                                 <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#D4AF37] text-[14px] font-bold text-[#0f0301]">
//                                     K
//                                 </div>
//                             </button>
//                         </div>

//                         {/* Mobile menu hamburger icon */}
//                         <button
//                             onClick={() => setMenuOpen(!menuOpen)}
//                             className="flex xl:hidden h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white"
//                         >
//                             {menuOpen ? <X size={20} /> : <Menu size={20} />}
//                         </button>
//                     </div>
//                 </div>
//             </header>

//             {/* ── Smooth Animated Mobile Drawer ── */}
//             <div
//                 className={`fixed inset-0 z-[99] bg-black/40 backdrop-blur-sm xl:hidden transition-opacity duration-300 ${menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
//                     }`}
//                 onClick={() => setMenuOpen(false)}
//             />

//             <div
//                 className={`fixed right-0 top-0 bottom-0 z-[100] h-full w-[82%] max-w-[340px] bg-white xl:hidden flex flex-col shadow-2xl transition-transform duration-300 ease-in-out transform ${menuOpen ? "translate-x-0" : "translate-x-full"
//                     }`}
//             >
//                 {/* Drawer header */}
//                 <div className="flex items-center justify-between border-b border-black/5 px-6 py-6">
//                     <div>
//                         <p className="text-[11px] uppercase tracking-[0.2em] text-zinc-400">Real Estate</p>
//                         <h2 className="mt-2 text-[28px] font-bold text-black">Menu</h2>
//                     </div>
//                     <button
//                         onClick={() => setMenuOpen(false)}
//                         className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f3f3f3]"
//                     >
//                         <X size={18} />
//                     </button>
//                 </div>

//                 {/* Drawer navigation links */}
//                 <div className="px-4 py-5 flex flex-col gap-2 overflow-y-auto flex-1">
//                     {NAV_LINKS.map((item) => (
//                         <MobileNavLink
//                             key={item.name}
//                             item={item}
//                             isActive={location.pathname === item.path}
//                             onClick={() => setMenuOpen(false)}
//                         />
//                     ))}

//                     {/* CTA Card element block */}
//                     <div className="mt-5 rounded-[30px] bg-[#f5f5f5] p-5">
//                         <p className="text-[12px] uppercase tracking-[0.2em] text-zinc-500">Premium Living</p>
//                         <h3 className="mt-3 text-[24px] font-bold leading-tight text-black">
//                             Find Your Perfect Property
//                         </h3>
//                         <button className="mt-6 flex w-full items-center justify-between rounded-full bg-black px-5 py-4 text-white transition-all hover:bg-[#222]">
//                             <span className="font-medium">Explore Now</span>
//                             <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-black">
//                                 <ArrowIcon />
//                             </div>
//                         </button>
//                     </div>
//                 </div>
//             </div>
//         </>
//     );
// }

// import { useEffect, useState } from "react";
// import { useLocation } from "react-router-dom";
// import { Heart, Menu, X } from "lucide-react";
// import LOGO from "../../assets/m.png";

// // ─── Constants ────────────────────────────────────────────────────────────────

// const NAV_LINKS = [
//     { name: "Contact Us", path: "/contact" },
//     { name: "Student Support", path: "#" },
//     { name: "Elite Services", path: "/eliteservices" }
// ];

// const NAVBAR_BG = "#0f0301";
// const LOGO_CONTENT_TOP_RATIO = 825 / 4500;
// const LOGO_CONTENT_HEIGHT_RATIO = 2480 / 4500;
// const LOGO_VISIBLE_HEIGHT = {
//     base: 68,
//     sm: 76,
//     xl: 88,
// };

// // ─── Sub-components ───────────────────────────────────────────────────────────

// function ArrowIcon() {
//     return (
//         <svg width="11" height="11" viewBox="0 0 10 10" fill="none">
//             <path
//                 d="M1.5 8.5L8.5 1.5M8.5 1.5H3M8.5 1.5V7"
//                 stroke="currentColor"
//                 strokeWidth="1.6"
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//             />
//         </svg>
//     );
// }

// function NavLink({ item, isActive }) {
//     return (
//         <a
//             href={item.path}
//             // Added translate-y-[2px] to push text down perfectly on Y-axis
//             className={`group relative flex items-center justify-center rounded-full px-6 py-2.5 text-[16px] font-medium leading-none translate-y-[2px] transition-all duration-300 ${isActive
//                     ? "bg-[#efefef] text-black"
//                     : "text-white hover:bg-white/10"
//                 }`}
//         >
//             <span>{item.name}</span>
//         </a>
//     );
// }

// function MobileNavLink({ item, isActive, onClick }) {
//     return (
//         <a
//             href={item.path}
//             onClick={onClick}
//             className={`flex items-center justify-between rounded-2xl px-5 py-4 transition-all duration-300 ${isActive ? "bg-black text-white" : "bg-[#f5f5f5] text-black"
//                 }`}
//         >
//             <span className="font-medium text-[16px]">{item.name}</span>
//             <ArrowIcon />
//         </a>
//     );
// }

// function LogoMark({ visibleHeight }) {
//     const fullHeight = visibleHeight / LOGO_CONTENT_HEIGHT_RATIO;
//     const offsetTop = -(LOGO_CONTENT_TOP_RATIO * fullHeight);

//     return (
//         <div
//             className="shrink-0 overflow-hidden"
//             style={{ height: visibleHeight, width: fullHeight, backgroundColor: NAVBAR_BG }}
//         >
//             <img
//                 src={LOGO}
//                 alt="Mehta Estates"
//                 className="block max-w-none"
//                 style={{
//                     height: fullHeight,
//                     width: fullHeight,
//                     marginTop: offsetTop,
//                 }}
//             />
//         </div>
//     );
// }

// export default function Navbar() {
//     const location = useLocation();
//     const [menuOpen, setMenuOpen] = useState(false);
//     const [scrolled, setScrolled] = useState(false);
//     const [logoVisibleHeight, setLogoVisibleHeight] = useState(LOGO_VISIBLE_HEIGHT.base);

//     useEffect(() => {
//         const handleScroll = () => setScrolled(window.scrollY > 10);
//         window.addEventListener("scroll", handleScroll);
//         return () => window.removeEventListener("scroll", handleScroll);
//     }, []);

//     useEffect(() => {
//         const updateLogoHeight = () => {
//             const w = window.innerWidth;
//             if (w >= 1280) setLogoVisibleHeight(LOGO_VISIBLE_HEIGHT.xl);
//             else if (w >= 640) setLogoVisibleHeight(LOGO_VISIBLE_HEIGHT.sm);
//             else setLogoVisibleHeight(LOGO_VISIBLE_HEIGHT.base);
//         };
//         updateLogoHeight();
//         window.addEventListener("resize", updateLogoHeight);
//         return () => window.removeEventListener("resize", updateLogoHeight);
//     }, []);

//     return (
//         <>
//             {/* ── Desktop/Mobile Header ── */}
//             <header
//                 className={`sticky top-0 font-['satoshi'] z-50 transition-all duration-500 border-b ${scrolled
//                         ? "backdrop-blur-xl border-white/10"
//                         : "border-transparent"
//                     }`}
//                 style={{ backgroundColor: scrolled ? `${NAVBAR_BG}f2` : NAVBAR_BG }}
//             >
//                 <div className="w-full px-5 md:px-10 lg:px-16">
//                     <div className="h-[88px] flex items-center justify-between transition-all duration-300">

//                         {/* Left Group */}
//                         <div className="flex items-center gap-10">
//                             <a
//                                 href="/"
//                                 className="flex shrink-0 items-center select-none"
//                                 style={{ backgroundColor: NAVBAR_BG }}
//                             >
//                                 <LogoMark visibleHeight={logoVisibleHeight} />
//                             </a>

//                             {/* Center Navigation Links Panel with clear baseline height */}
//                             <nav className="hidden xl:flex items-center h-full">
//                                 <div className="flex items-center gap-1">
//                                     {NAV_LINKS.map((item) => (
//                                         <NavLink
//                                             key={item.name}
//                                             item={item}
//                                             isActive={location.pathname === item.path}
//                                         />
//                                     ))}
//                                 </div>
//                             </nav>
//                         </div>

//                         {/* Right Group */}
//                         <div className="hidden xl:flex items-center gap-3">
//                             <button className="group flex items-center gap-3 rounded-full bg-white pl-5 pr-2 py-2 text-black transition-all duration-300 hover:bg-white/90">
//                                 <span className="text-[14px] font-medium">Post Property</span>
//                                 <div
//                                     className="flex h-9 w-9 items-center justify-center rounded-full text-white transition-transform duration-300 group-hover:rotate-45"
//                                     style={{ backgroundColor: NAVBAR_BG }}
//                                 >
//                                     <ArrowIcon />
//                                 </div>
//                             </button>

//                             <button className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white transition-all duration-300 hover:bg-white/20">
//                                 <Heart size={18} />
//                             </button>

//                             <button className="flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-2 pr-4 py-2 text-white">
//                                 <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#D4AF37] text-[14px] font-bold text-[#0f0301]">
//                                     K
//                                 </div>
//                             </button>
//                         </div>

//                         {/* Mobile menu hamburger icon */}
//                         <button
//                             onClick={() => setMenuOpen(!menuOpen)}
//                             className="flex xl:hidden h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white"
//                         >
//                             {menuOpen ? <X size={20} /> : <Menu size={20} />}
//                         </button>
//                     </div>
//                 </div>
//             </header>

//             {/* ── Smooth Animated Mobile Drawer ── */}
//             <div
//                 className={`fixed inset-0 z-[99] bg-black/40 backdrop-blur-sm xl:hidden transition-opacity duration-300 ${menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
//                     }`}
//                 onClick={() => setMenuOpen(false)}
//             />

//             <div
//                 className={`fixed right-0 top-0 bottom-0 z-[100] h-full w-[82%] max-w-[340px] bg-white xl:hidden flex flex-col shadow-2xl transition-transform duration-300 ease-in-out transform ${menuOpen ? "translate-x-0" : "translate-x-full"
//                     }`}
//             >
//                 {/* Drawer header */}
//                 <div className="flex items-center justify-between border-b border-black/5 px-6 py-6">
//                     <div>
//                         <p className="text-[11px] uppercase tracking-[0.2em] text-zinc-400">Real Estate</p>
//                         <h2 className="mt-2 text-[28px] font-bold text-black">Menu</h2>
//                     </div>
//                     <button
//                         onClick={() => setMenuOpen(false)}
//                         className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f3f3f3]"
//                     >
//                         <X size={18} />
//                     </button>
//                 </div>

//                 {/* Drawer navigation links */}
//                 <div className="px-4 py-5 flex flex-col gap-2 overflow-y-auto flex-1">
//                     {NAV_LINKS.map((item) => (
//                         <MobileNavLink
//                             key={item.name}
//                             item={item}
//                             isActive={location.pathname === item.path}
//                             onClick={() => setMenuOpen(false)}
//                         />
//                     ))}

//                     {/* CTA Card element block */}
//                     <div className="mt-5 rounded-[30px] bg-[#f5f5f5] p-5">
//                         <p className="text-[12px] uppercase tracking-[0.2em] text-zinc-500">Premium Living</p>
//                         <h3 className="mt-3 text-[24px] font-bold leading-tight text-black">
//                             Find Your Perfect Property
//                         </h3>
//                         <button className="mt-6 flex w-full items-center justify-between rounded-full bg-black px-5 py-4 text-white transition-all hover:bg-[#222]">
//                             <span className="font-medium">Explore Now</span>
//                             <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-black">
//                                 <ArrowIcon />
//                             </div>
//                         </button>
//                     </div>
//                 </div>
//             </div>
//         </>
//     );
// }
