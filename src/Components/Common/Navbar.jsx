import { useEffect, useState } from "react";
import { Heart, ChevronDown, Menu, X } from "lucide-react";
import LOGO from "../../assets/logo1.png";

// ─── Constants ────────────────────────────────────────────────────────────────

const NAV_LINKS = [""];
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

function NavLink({ item, isActive, onClick }) {
    return (
        <button
            onClick={onClick}
            className={`group relative flex items-center gap-1.5 rounded-full px-4 py-2.5 text-[14px] font-medium transition-all duration-300 ${isActive ? "bg-[#efefef] text-black" : "text-[#555] hover:bg-[#f0f0f0]"
                }`}
        >
            <span>{item}</span>
            <ChevronDown size={13} className="opacity-50 transition-transform duration-300 group-hover:translate-y-[1px]" />
        </button>
    );
}

function MobileNavLink({ item, isActive, onClick }) {
    return (
        <button
            onClick={onClick}
            className={`flex items-center justify-between rounded-2xl px-5 py-4 transition-all duration-300 ${isActive ? "bg-black text-white" : "bg-[#f5f5f5] text-black"
                }`}
        >
            <span className="font-medium">{item}</span>
            <ArrowIcon />
        </button>
    );
}

// ─── Main Component ───────────────────────────────────────────────────────────

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
    const [active, setActive] = useState("Buy");
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
            {/* ── Desktop Header ── */}
            <header
                className={`sticky top-0 font-['satoshi'] z-50 transition-all duration-500 ${scrolled
                    ? "backdrop-blur-xl border-b border-white/10"
                    : ""
                    }`}
                style={{ backgroundColor: scrolled ? `${NAVBAR_BG}f2` : NAVBAR_BG }}
            >
                <div className="w-full px-5 md:px-10 lg:px-16">
                    <div className="h-[88px] flex items-center justify-between transition-all duration-300">

                        {/* Left — Logo + Nav */}
                        <div className="flex items-center gap-10">

                            <a
                                href="/"
                                className="flex shrink-0 items-center select-none"
                                style={{ backgroundColor: NAVBAR_BG }}
                            >
                                <LogoMark visibleHeight={logoVisibleHeight} />
                            </a>

                            {/* Desktop nav links */}
                            <nav className="hidden xl:flex items-center gap-3">
                                {/* <button className="flex items-center gap-2 rounded-full bg-[#efefef] px-4 py-2.5 text-[14px] font-semibold text-black transition-all duration-300 hover:bg-[#e8e8e8]">
                                    <span>Noida</span>
                                    <ChevronDown size={14} strokeWidth={2.3} />
                                </button> */}
                                {/* <div className="flex items-center gap-1">
                                    {NAV_LINKS.map((item) => (
                                        <NavLink
                                            key={item}
                                            item={item}
                                            isActive={active === item}
                                            onClick={() => setActive(item)}
                                        />
                                    ))}
                                </div> */}
                            </nav>
                        </div>

                        {/* Right — Actions */}
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

                            <button className="flex items-center gap-2 rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/10 px-2 pr-4 py-2 text-white">
                                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#D4AF37] text-[14px] font-bold text-[#0f0301]">
                                    K
                                </div>
                                <ChevronDown size={14} className="text-white/80" />
                            </button>
                        </div>

                        {/* Mobile menu toggle */}
                        <button
                            onClick={() => setMenuOpen(!menuOpen)}
                            className="flex xl:hidden h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white"
                        >
                            {menuOpen ? <X size={20} /> : <Menu size={20} />}
                        </button>
                    </div>
                </div>
            </header>

            {/* ── Mobile Drawer ── */}
            {menuOpen && (
                <>
                    {/* Overlay */}
                    <div
                        className="fixed inset-0 z-[99] bg-black/40 backdrop-blur-sm xl:hidden"
                        onClick={() => setMenuOpen(false)}
                    />

                    {/* Drawer */}
                    <div className="fixed right-0 top-0 bottom-0 z-[100] h-full w-[82%] max-w-[340px] bg-white xl:hidden flex flex-col shadow-2xl">

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

                        {/* Drawer links */}
                        <div className="px-4 py-5 flex flex-col gap-2 overflow-y-auto flex-1">
                            {NAV_LINKS.map((item) => (
                                <MobileNavLink
                                    key={item}
                                    item={item}
                                    isActive={active === item}
                                    onClick={() => {
                                        setActive(item);
                                        setMenuOpen(false);
                                    }}
                                />
                            ))}

                            {/* CTA card */}
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
            )}
        </>
    );
}

// import { useEffect, useState } from "react";
// import { Heart, ChevronDown, Menu, X } from "lucide-react";
// import LOGO from "../../assets/logo1.png";

// // ─── Constants ────────────────────────────────────────────────────────────────

// const NAV_LINKS = [""];

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

// function NavLink({ item, isActive, onClick }) {
//     return (
//         <button
//             onClick={onClick}
//             className={`group relative flex items-center gap-1.5 rounded-full px-4 py-2.5 text-[14px] font-medium transition-all duration-300 ${isActive ? "bg-[#efefef] text-black" : "text-[#555] hover:bg-[#f0f0f0]"
//                 }`}
//         >
//             <span>{item}</span>
//             <ChevronDown size={13} className="opacity-50 transition-transform duration-300 group-hover:translate-y-[1px]" />
//         </button>
//     );
// }

// function MobileNavLink({ item, isActive, onClick }) {
//     return (
//         <button
//             onClick={onClick}
//             className={`flex items-center justify-between rounded-2xl px-5 py-4 transition-all duration-300 ${isActive ? "bg-black text-white" : "bg-[#f5f5f5] text-black"
//                 }`}
//         >
//             <span className="font-medium">{item}</span>
//             <ArrowIcon />
//         </button>
//     );
// }

// // ─── Main Component ───────────────────────────────────────────────────────────

// export default function Navbar() {
//     const [active, setActive] = useState("Buy");
//     const [menuOpen, setMenuOpen] = useState(false);
//     const [scrolled, setScrolled] = useState(false);

//     useEffect(() => {
//         const handleScroll = () => setScrolled(window.scrollY > 10);
//         window.addEventListener("scroll", handleScroll);
//         return () => window.removeEventListener("scroll", handleScroll);
//     }, []);

//     return (
//         <>
//             {/* ── Desktop Header ── */}
//             <header
//                 className={`sticky top-0 font-['satoshi'] z-50 transition-all duration-500 ${scrolled
//                     ? "bg-white/75 backdrop-blur-xl border-b border-black/5"
//                     : "bg-[#f5f5f3]"
//                     }`}
//             >
//                 <div className="w-full px-5 md:px-10 lg:px-16">
//                     <div className="h-[88px] flex items-center justify-between">

//                         {/* Left — Logo + Nav */}
//                         <div className="flex items-center gap-10">

//                             {/* Logo */}
//                             <a href="#" className="flex items-center select-none">
//                                 <img src={LOGO} alt="Vistahaven" style={{ height: "72px", width: "auto", objectFit: "contain" }} />
//                             </a>

//                             {/* Desktop nav links */}
//                             <nav className="hidden xl:flex items-center gap-3">
//                                 {/* <button className="flex items-center gap-2 rounded-full bg-[#efefef] px-4 py-2.5 text-[14px] font-semibold text-black transition-all duration-300 hover:bg-[#e8e8e8]">
//                                     <span>Noida</span>
//                                     <ChevronDown size={14} strokeWidth={2.3} />
//                                 </button> */}
//                                 {/* <div className="flex items-center gap-1">
//                                     {NAV_LINKS.map((item) => (
//                                         <NavLink
//                                             key={item}
//                                             item={item}
//                                             isActive={active === item}
//                                             onClick={() => setActive(item)}
//                                         />
//                                     ))}
//                                 </div> */}
//                             </nav>
//                         </div>

//                         {/* Right — Actions */}
//                         <div className="hidden xl:flex items-center gap-3">
//                             <button className="group flex items-center gap-3 rounded-full bg-[#111] pl-5 pr-2 py-2 text-white transition-all duration-300 hover:bg-black">
//                                 <span className="text-[14px] font-medium">Post Property</span>
//                                 <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-black transition-transform duration-300 group-hover:rotate-45">
//                                     <ArrowIcon />
//                                 </div>
//                             </button>

//                             <button className="flex h-11 w-11 items-center justify-center rounded-full border border-black/5 bg-white text-black transition-all duration-300 hover:bg-[#f3f3f3]">
//                                 <Heart size={18} />
//                             </button>

//                             <button className="flex items-center gap-2 rounded-full bg-[#e5c7c7] px-2 pr-4 py-2">
//                                 <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#c79f9f] text-[14px] font-bold text-black">
//                                     K
//                                 </div>
//                                 <ChevronDown size={14} />
//                             </button>
//                         </div>

//                         {/* Mobile menu toggle */}
//                         <button
//                             onClick={() => setMenuOpen(!menuOpen)}
//                             className="flex xl:hidden h-11 w-11 items-center justify-center rounded-full bg-black text-white"
//                         >
//                             {menuOpen ? <X size={20} /> : <Menu size={20} />}
//                         </button>
//                     </div>
//                 </div>
//             </header>

//             {/* ── Mobile Drawer ── */}
//             {menuOpen && (
//                 <>
//                     {/* Overlay */}
//                     <div
//                         className="fixed inset-0 z-[99] bg-black/40 backdrop-blur-sm xl:hidden"
//                         onClick={() => setMenuOpen(false)}
//                     />

//                     {/* Drawer */}
//                     <div className="fixed right-0 top-0 bottom-0 z-[100] h-full w-[82%] max-w-[340px] bg-white xl:hidden flex flex-col shadow-2xl">

//                         {/* Drawer header */}
//                         <div className="flex items-center justify-between border-b border-black/5 px-6 py-6">
//                             <div>
//                                 <p className="text-[11px] uppercase tracking-[0.2em] text-zinc-400">Real Estate</p>
//                                 <h2 className="mt-2 text-[28px] font-bold text-black">Menu</h2>
//                             </div>
//                             <button
//                                 onClick={() => setMenuOpen(false)}
//                                 className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f3f3f3]"
//                             >
//                                 <X size={18} />
//                             </button>
//                         </div>

//                         {/* Drawer links */}
//                         <div className="px-4 py-5 flex flex-col gap-2 overflow-y-auto flex-1">
//                             {NAV_LINKS.map((item) => (
//                                 <MobileNavLink
//                                     key={item}
//                                     item={item}
//                                     isActive={active === item}
//                                     onClick={() => {
//                                         setActive(item);
//                                         setMenuOpen(false);
//                                     }}
//                                 />
//                             ))}

//                             {/* CTA card */}
//                             <div className="mt-5 rounded-[30px] bg-[#f5f5f5] p-5">
//                                 <p className="text-[12px] uppercase tracking-[0.2em] text-zinc-500">Premium Living</p>
//                                 <h3 className="mt-3 text-[24px] font-bold leading-tight text-black">
//                                     Find Your Perfect Property
//                                 </h3>
//                                 <button className="mt-6 flex w-full items-center justify-between rounded-full bg-black px-5 py-4 text-white transition-all hover:bg-[#222]">
//                                     <span className="font-medium">Explore Now</span>
//                                     <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-black">
//                                         <ArrowIcon />
//                                     </div>
//                                 </button>
//                             </div>
//                         </div>
//                     </div>
//                 </>
//             )}
//         </>
//     );
// }