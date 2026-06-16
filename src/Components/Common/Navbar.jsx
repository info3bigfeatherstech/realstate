import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Heart, Menu, X } from "lucide-react";
import LOGO from "../../assets/m.png";

// ─── Constants ────────────────────────────────────────────────────────────────

const NAV_LINKS = [
    { name: "Buy", path: "/buy" },
    { name: "Rent", path: "/rent" },
    { name: "New Launch", path: "/new-launch" },
    { name: "Commercial", path: "/commercial" },
    { name: "Plots", path: "/plots" },
    { name: "Enquiry Form", path: "/enquiry" },
    // Purane current links ko last me shift kar diya hai
    { name: "Contact Us", path: "/contact" },
    { name: "Student Support", path: "#" },
    { name: "Elite Services", path: "/eliteservices" }
];

const NAVBAR_BG = "#0f0301";
const LOGO_CONTENT_TOP_RATIO = 825 / 4500;
const LOGO_CONTENT_HEIGHT_RATIO = 2480 / 4500;
const LOGO_VISIBLE_HEIGHT = {
    base: 68,
    sm: 76,
    xl: 88,
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
    return (
        <a
            href={item.path}
            // Added translate-y-[2px] to push text down perfectly on Y-axis
            className={`group relative flex items-center justify-center rounded-full px-4 py-2.5 text-[15px] lg:text-[16px] font-medium leading-none translate-y-[2px] transition-all duration-300 ${isActive
                    ? "bg-[#efefef] text-black"
                    : "text-white hover:bg-white/10"
                }`}
        >
            <span>{item.name}</span>
        </a>
    );
}

function MobileNavLink({ item, isActive, onClick }) {
    return (
        <a
            href={item.path}
            onClick={onClick}
            className={`flex items-center justify-between rounded-2xl px-5 py-4 transition-all duration-300 ${isActive ? "bg-black text-white" : "bg-[#f5f5f5] text-black"
                }`}
        >
            <span className="font-medium text-[16px]">{item.name}</span>
            <ArrowIcon />
        </a>
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
    const [menuOpen, setMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [logoVisibleHeight, setLogoVisibleHeight] = useState(LOGO_VISIBLE_HEIGHT.base);

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
                    <div className="h-[88px] flex items-center justify-between transition-all duration-300">

                        {/* Left Group */}
                        <div className="flex items-center gap-6 lg:gap-10">
                            <a
                                href="/"
                                className="flex shrink-0 items-center select-none"
                                style={{ backgroundColor: NAVBAR_BG }}
                            >
                                <LogoMark visibleHeight={logoVisibleHeight} />
                            </a>

                            {/* Center Navigation Links Panel with clear baseline height */}
                            <nav className="hidden xl:flex items-center h-full">
                                <div className="flex items-center gap-1">
                                    {NAV_LINKS.map((item) => (
                                        <NavLink
                                            key={item.name}
                                            item={item}
                                            isActive={location.pathname === item.path}
                                        />
                                    ))}
                                </div>
                            </nav>
                        </div>

                        {/* Right Group */}
                        <div className="hidden xl:flex items-center gap-3">
                            <button className="group flex items-center gap-3 rounded-full bg-white pl-5 pr-2 py-2 text-black transition-all duration-300 hover:bg-white/90">
                                <span className="text-[14px] font-medium">Post Property</span>
                                <div
                                    className="flex h-9 w-9 items-center justify-center rounded-full text-white transition-transform duration-300 group-hover:rotate-45"
                                    style={{ backgroundColor: NAVBAR_BG }}
                                >
                                    <ArrowIcon />
                                </div>
                            </button>

                            <button className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white transition-all duration-300 hover:bg-white/20">
                                <Heart size={18} />
                            </button>

                            <button className="flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-2 pr-4 py-2 text-white">
                                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#D4AF37] text-[14px] font-bold text-[#0f0301]">
                                    K
                                </div>
                            </button>
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
                    {NAV_LINKS.map((item) => (
                        <MobileNavLink
                            key={item.name}
                            item={item}
                            isActive={location.pathname === item.path}
                            onClick={() => setMenuOpen(false)}
                        />
                    ))}

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
