import { useState, useEffect } from "react";
import {
    Home,
    KeyRound,
    Building2,
    Landmark,
    MapPin,
    Search,
    ArrowUpRight,
    ChevronDown,
} from "lucide-react";

// import bg from "../../../../assets/hero-bg.png";

// ─── Constants ───────────────────────────────────────────────────────────────

const TABS = [
    { icon: Home, name: "Buy" },
    { icon: KeyRound, name: "Rent" },
    { icon: Building2, name: "Investment" },
    { icon: Landmark, name: "Projects" },
];

const LOCATIONS = ["Delhi", "East Patel Nagar", "West Patel Nagar"];

const STATS = [
    { value: "200+", label: "Projects Complete" },
    { value: "70+", label: "Happy Clients" },
    { value: "₹8.4Bn+", label: "Project Value" },
];

const AVATARS = [
    "https://i.pravatar.cc/150?img=11",
    "https://i.pravatar.cc/150?img=15",
    "https://i.pravatar.cc/150?img=47",
    "https://i.pravatar.cc/150?img=68",
];


const bg = 'https://images.pexels.com/photos/27307397/pexels-photo-27307397.jpeg';
const TAB_CONFIG = {
    Buy: {
        stats: "12K+ Properties",
        placeholders: [
            "Search luxury apartments in Delhi",
            "Find homes near expressway",
            "Explore premium 3 BHK homes",
        ],
        trending: ["Ready To Move", "Luxury Homes", "Smart Apartments"],
    },
    Rent: {
        stats: "4K+ Rentals",
        placeholders: [
            "Find rental homes near metro",
            "Search fully furnished flats",
            "Explore budget PG options",
        ],
        trending: ["Furnished", "Studio", "Family Flats"],
    },
    Investment: {
        stats: "120+ Launches",
        placeholders: [
            "Discover newly launched towers",
            "Book upcoming premium projects",
            "Explore pre-launch offers",
        ],
        trending: ["Pre Launch", "Bookings Open", "Investment Deals"],
    },
    Projects: {
        stats: "950+ Commercial",
        placeholders: [
            "Search office spaces in business hubs",
            "Explore coworking spaces",
            "Find retail shops for investment",
        ],
        trending: ["Coworking", "Retail Shops", "Office Space"],
    },
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function TabButton({ icon: Icon, name, isActive, onClick, isFirst, isLast }) {
    const config = TAB_CONFIG[name];
    return (
        <button
            onClick={onClick}
            className={`
                relative flex min-w-fit flex-1 items-center justify-center gap-3
                border-r border-white/5 px-6 py-4
                transition-all duration-300
                ${isActive ? "text-white bg-white/[0.04]" : "text-white/40 hover:text-white/80"}
                ${isFirst ? "rounded-tl-[20px] sm:rounded-tl-[28px]" : ""}
                ${isLast ? "border-r-0 rounded-tr-[20px] sm:rounded-tr-[28px]" : ""}
            `}
        >
            <div className={`
                flex h-8 w-8 items-center justify-center rounded-xl
                transition-all duration-300
                ${isActive
                    ? "bg-[#C8973E] text-black shadow-[0_0_20px_rgba(245,200,66,.35)] scale-105"
                    : "bg-white/5 text-white/60"
                }
            `}>
                <Icon size={15} />
            </div>

            <div className="flex flex-col items-start text-left text-white">
                <span className="text-sm font-semibold tracking-wide whitespace-nowrap">{name}</span>
                <span className={`text-[10px] tracking-wide transition-opacity ${isActive ? "text-white" : "text-white"}`}>
                    {config?.stats}
                </span>
            </div>

            {isActive && (
                <div className="absolute bottom-0 left-0 h-[2px] w-full bg-[#f5c842]" />
            )}
        </button>
    );
}

function AgentsBadge() {
    return (
        <div className="group absolute right-0 bottom-0 hidden xl:flex items-center gap-5 overflow-hidden rounded-tl-[32px] border border-white/10 border-b-0 border-r-0 bg-black/90 px-7 py-5 backdrop-blur-2xl shadow-[0_-8px_40px_rgba(0,0,0,.25)]">
            <div className="absolute -right-10 -top-10 h-32 w-32 rounded-text-xs text-white whitespace-nowrap mr-1 bg-[#C8973E]/10 blur-3xl" />

            {/* <div className="relative flex items-center">
                {AVATARS.map((src, i) => (
                    <div key={i} className={`${i !== 0 ? "-ml-3" : ""} relative`}>
                        <div className="rounded-full bg-gradient-to-br from-[#f5c842] to-yellow-200 p-[2px]">
                            <img
                                src={src}
                                alt=""
                                className="h-12 w-12 rounded-full border-2 border-[#081220] object-cover"
                            />
                        </div>
                        <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-[#081220] bg-green-400" />
                    </div>
                ))}
                <div className="-ml-3 flex h-12 w-12 items-center justify-center rounded-full border-2 border-[#081220] bg-white/10 text-xs font-semibold text-white backdrop-blur-xl">
                    +8
                </div>
            </div> */}

            <div className="h-12 w-px bg-white/10" />
            {/* 
            <div>
                <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold tracking-tight text-white">10+</span>
                    <span className="text-sm font-medium text-white/80">Featured Agents</span>
                </div>
                <div className="mt-2 flex items-center gap-2">
                    <div className="flex items-center gap-[2px]">
                        {[...Array(5)].map((_, i) => (
                            <span key={i} className="text-[13px] text-[#f5c842]">★</span>
                        ))}
                    </div>
                    <span className="rounded-full bg-white/5 px-2 py-1 text-[11px] font-semibold text-[#f5c842]">
                        4.7 Client Rating
                    </span>
                </div>
            </div> */}

            <div className="absolute inset-0 rounded-tl-[32px] border border-transparent transition-all duration-500 group-hover:border-[#f5c842]/20" />
        </div>
    );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function HeroSection() {
    const [activeTab, setActiveTab] = useState("Buy");
    const [query, setQuery] = useState("");
    const [hovered, setHovered] = useState(false);
    const [placeholderIndex, setPlaceholderIndex] = useState(0);
    const [selectedLocation, setSelectedLocation] = useState("Delhi");
    const [locationMenuOpen, setLocationMenuOpen] = useState(false);

    const currentTab = TAB_CONFIG[activeTab];

    useEffect(() => {
        const interval = setInterval(() => {
            setPlaceholderIndex((prev) => (prev + 1) % currentTab.placeholders.length);
        }, 2500);
        return () => clearInterval(interval);
    }, [activeTab, currentTab.placeholders.length]);

    function handleTabChange(name) {
        setActiveTab(name);
        setPlaceholderIndex(0);
    }

    return (
        <div className="min-h-screen font-['satoshi'] px-3 sm:px-5 md:px-8 lg:px-10 mt-4 sm:mt-6 md:mt-10">
            <div className="relative overflow-hidden rounded-3xl min-h-[620px] sm:min-h-[780px] bg-[#040d18]">

                {/* Background image */}
                <img
                    src={bg}
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-[linear-gradient(105deg,rgba(4,13,24,.97)_0%,rgba(5,17,31,.91)_36%,rgba(8,22,40,.55)_64%,rgba(10,25,45,.08)_100%)]" />

                {/* Top-right glow */}
                <div className="absolute right-0 top-0 h-[500px] w-[500px] bg-[radial-gradient(ellipse_at_top_right,rgba(245,200,66,.07)_0%,transparent_70%)]" />

                {/* Content */}
                <div className="relative z-10 flex flex-col justify-between min-h-[580px] sm:min-h-[700px] pb-6 sm:pb-10">

                    {/* Hero text */}
                    <div className="max-w-[850px] pt-16 sm:pt-20 md:pt-28 lg:pt-36 px-4 sm:px-0 md:pl-12 lg:pl-24 xl:pl-[120px]">
                        <h1 className="bg-[linear-gradient(90deg,#fff_35%,#f5c842_50%,#fff_65%)] bg-[length:250%_auto] bg-clip-text text-transparent text-[clamp(28px,5vw,72px)] uppercase leading-[1.1] md:leading-[0.95] tracking-[-2px] md:tracking-[-4px]">
                            FIND YOUR PERFECT <br /> HOME TODAY
                        </h1>

                        <p className="mt-6 max-w-[540px] text-[15px] leading-[1.9] text-white/60">
                            We provide tailored real estate solutions, guiding you through every step
                            with personalized experiences that meet your unique needs and aspirations.
                        </p>

                        <div className="mt-10">
                            <button
                                onMouseEnter={() => setHovered(true)}
                                onMouseLeave={() => setHovered(false)}
                                className="inline-flex items-center gap-4 rounded-full bg-white pl-6 pr-2 py-2 font-semibold text-black transition-all hover:shadow-lg"
                            >
                                Explore Properties
                                <span className={`flex h-10 w-10 items-center justify-center rounded-full bg-black text-white transition-transform duration-300 ${hovered ? "rotate-45" : ""}`}>
                                    <ArrowUpRight size={16} />
                                </span>
                            </button>
                        </div>

                        {/* Stats */}
                        {/* <div className="mt-6 sm:mt-10 md:mt-14 flex flex-wrap gap-4 sm:gap-10">
                            {STATS.map((stat, i) => (
                                <div
                                    key={stat.label}
                                    className={`pr-4 sm:pr-10 ${i !== STATS.length - 1 ? "border-r border-white/20" : ""}`}
                                >
                                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold leading-none tracking-[-2px] text-white">
                                        {stat.value}
                                    </h2>
                                    <p className="mt-2 text-sm text-white/45">{stat.label}</p>
                                </div>
                            ))}
                        </div> */}
                    </div>

                    {/* Search panel + agents */}
                    {/* FIXED: Added matching left-alignment margins to line up perfectly with the text hierarchy */}
                    <div className="relative z-20 flex items-end w-full px-4 sm:px-0 md:pl-12 lg:pl-24 xl:pl-[120px]">
                        {/* FIXED: Shrunk maximum width using max-w-[820px] instead of stretching too far out */}
                        <div className="w-full max-w-[820px] rounded-[20px] sm:rounded-[28px] border border-white/10 bg-gradient-to-b from-white/[0.10] to-white/[0.03] backdrop-blur-[30px] shadow-[0_8px_50px_rgba(0,0,0,.28)] mt-6 sm:mt-10">

                            {/* Tab bar */}
                            <div className="flex overflow-x-auto border-b border-white/10 hide-scrollbar rounded-t-[20px] sm:rounded-t-[28px]">
                                {TABS.map((tab, idx) => (
                                    <TabButton
                                        key={tab.name}
                                        icon={tab.icon}
                                        name={tab.name}
                                        isActive={activeTab === tab.name}
                                        onClick={() => handleTabChange(tab.name)}
                                        isFirst={idx === 0}
                                        isLast={idx === TABS.length - 1}
                                    />
                                ))}
                            </div>

                            {/* Search row */}
                            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 px-4 py-4">

                                {/* Location picker */}
                                <div className="relative w-full sm:w-[220px]">
                                    <button
                                        type="button"
                                        onClick={() => setLocationMenuOpen(!locationMenuOpen)}
                                        className="flex h-[52px] w-full items-center justify-between rounded-xl bg-white px-4 text-left shadow-md transition-all active:scale-[0.98]"
                                    >
                                        <div className="flex items-center gap-2 overflow-hidden">
                                            <MapPin size={16} className="text-gray-400 shrink-0" />
                                            <span className="text-sm font-bold text-black truncate">{selectedLocation}</span>
                                        </div>
                                        <ChevronDown size={15} className={`text-gray-400 shrink-0 transition-transform duration-200 ${locationMenuOpen ? "rotate-180" : ""}`} />
                                    </button>

                                    {locationMenuOpen && (
                                        <>
                                            <div className="fixed inset-0 z-40" onClick={() => setLocationMenuOpen(false)} />
                                            <div className="absolute left-0 bottom-full sm:bottom-auto sm:top-full mb-2 sm:mb-0 sm:mt-2 w-full rounded-xl bg-white p-1 text-black shadow-[0_10px_30px_rgba(0,0,0,0.5)] border border-gray-200 z-50">
                                                {LOCATIONS.map((loc) => (
                                                    <button
                                                        key={loc}
                                                        type="button"
                                                        onClick={() => {
                                                            setSelectedLocation(loc);
                                                            setLocationMenuOpen(false);
                                                        }}
                                                        className={`w-full text-left px-3 py-2.5 text-sm font-semibold rounded-lg transition-colors ${selectedLocation === loc ? "bg-amber-100 text-amber-900 font-bold" : "hover:bg-slate-100 text-slate-800"}`}
                                                    >
                                                        {loc}
                                                    </button>
                                                ))}
                                            </div>
                                        </>
                                    )}
                                </div>

                                {/* Search input */}
                                <div className="group relative flex h-[52px] w-full sm:flex-1 items-center gap-3 overflow-hidden rounded-xl bg-white px-4">
                                    <Search size={16} className="text-gray-400 shrink-0" />
                                    {!query && (
                                        <span className="pointer-events-none absolute left-11 text-sm text-gray-400 truncate right-4">
                                            {currentTab?.placeholders[placeholderIndex]}
                                        </span>
                                    )}
                                    <input
                                        value={query}
                                        onChange={(e) => setQuery(e.target.value)}
                                        className="w-full bg-transparent text-sm font-medium text-black outline-none"
                                    />
                                </div>

                                {/* Search button */}
                                <button className="h-[52px] rounded-xl bg-[#C8973E] px-8 text-sm font-bold text-black w-full sm:w-auto transition-all hover:bg-[#e0b536] active:scale-[0.97]">
                                    Search
                                </button>
                            </div>

                            {/* Trending tags */}
                            <div className="flex items-center gap-2 overflow-x-auto px-4 pb-4 hide-scrollbar">
                                <span className="text-xs text-white whitespace-nowrap mr-1">Trending:</span>
                                {currentTab?.trending.map((tag) => (
                                    <div
                                        key={tag}
                                        onClick={() => setQuery(tag)}
                                        className="whitespace-nowrap rounded-full border border-white/5 bg-white/5 px-3 py-1.5 text-xs text-white transition-all hover:bg-white/10 hover:text-white cursor-pointer"
                                    >
                                        {tag}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex-1" />
                        <AgentsBadge />
                    </div>
                </div>
            </div>
        </div>
    );
}
// import { useState, useEffect } from "react";
// import {
//     Home,
//     KeyRound,
//     Building2,
//     Landmark,
//     Map,
//     MapPin,
//     Search,
//     ArrowUpRight,
//     ChevronDown,
// } from "lucide-react";

// import bg from "../../../../assets/hero-bg.png";

// // ─── Constants ───────────────────────────────────────────────────────────────

// const TABS = [
//     { icon: Home, name: "Buy" },
//     { icon: KeyRound, name: "Rent" },
//     { icon: Building2, name: "Investment " },
//     { icon: Landmark, name: "Projects" },
//     // { icon: Map, name: "Plots" },
// ];

// const STATS = [
//     { value: "200+", label: "Projects Complete" },
//     { value: "70+", label: "Happy Clients" },
//     { value: "₹8.4Bn+", label: "Project Value" },
// ];

// const AVATARS = [
//     "https://i.pravatar.cc/150?img=11",
//     "https://i.pravatar.cc/150?img=15",
//     "https://i.pravatar.cc/150?img=47",
//     "https://i.pravatar.cc/150?img=68",
// ];

// const TAB_CONFIG = {
//     Buy: {
//         stats: "12K+ Properties",
//         placeholders: [
//             "Search luxury apartments in Noida",
//             "Find homes near expressway",
//             "Explore premium 3 BHK homes",
//         ],
//         trending: ["Ready To Move", "Luxury Homes", "Sea Facing", "Smart Apartments"],
//     },
//     Rent: {
//         stats: "4K+ Rentals",
//         placeholders: [
//             "Find rental homes near metro",
//             "Search fully furnished flats",
//             "Explore budget PG options",
//         ],
//         trending: ["Furnished", "Studio", "Family Flats", "Pet Friendly"],
//     },
//     Investment: {
//         stats: "120+ Launches",
//         placeholders: [
//             "Discover newly launched towers",
//             "Book upcoming premium projects",
//             "Explore pre-launch offers",
//         ],
//         trending: ["Pre Launch", "Bookings Open", "Investment Deals", "New Towers"],
//     },
//     Projects: {
//         stats: "950+ Commercial",
//         placeholders: [
//             "Search office spaces in business hubs",
//             "Explore coworking spaces",
//             "Find retail shops for investment",
//         ],
//         trending: ["Coworking", "Retail Shops", "Office Space", "Warehouse"],
//     },
// };

// // ─── Sub-components ───────────────────────────────────────────────────────────

// function TabButton({ icon: Icon, name, isActive, onClick }) {
//     const config = TAB_CONFIG[name];
//     return (
//         <button
//             onClick={onClick}
//             className={`
//                 relative flex min-w-fit items-center gap-3
//                 border-r border-white/5 px-4 sm:px-6 py-3 sm:py-4
//                 transition-all duration-300
//                 ${isActive ? "text-white" : "text-white/40 hover:text-white/80"}
//             `}
//         >
//             {isActive && (
//                 <div className="absolute inset-0 bg-gradient-to-b from-white/[0.06] to-transparent" />
//             )}

//             <div className={`
//                 relative z-10 flex h-8 w-8 items-center justify-center rounded-xl
//                 transition-all duration-300
//                 ${isActive
//                     ? "bg-[#f5c842] text-black shadow-[0_0_20px_rgba(245,200,66,.35)] scale-110"
//                     : "bg-white/5 text-white/60"
//                 }
//             `}>
//                 <Icon size={15} />
//             </div>

//             <div className="relative z-10 flex flex-col items-start">
//                 <span className="text-sm font-medium whitespace-nowrap">{name}</span>
//                 <span className={`text-[10px] tracking-wide transition-opacity ${isActive ? "text-[#f5c842]" : "text-white/25"}`}>
//                     {config.stats}
//                 </span>
//             </div>

//             {isActive && (
//                 <div className="absolute bottom-0 left-0 h-[2px] w-full bg-[#f5c842]" />
//             )}
//         </button>
//     );
// }

// function AgentsBadge() {
//     return (
//         <div className="group absolute right-0 bottom-0 hidden xl:flex items-center gap-5 overflow-hidden rounded-tl-[32px] border border-white/10 border-b-0 border-r-0 bg-black/90 px-7 py-5 backdrop-blur-2xl shadow-[0_-8px_40px_rgba(0,0,0,.25)]">
//             <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-[#f5c842]/10 blur-3xl" />

//             {/* Avatars */}
//             <div className="relative flex items-center">
//                 {AVATARS.map((src, i) => (
//                     <div key={i} className={`${i !== 0 ? "-ml-3" : ""} relative`}>
//                         <div className="rounded-full bg-gradient-to-br from-[#f5c842] to-yellow-200 p-[2px]">
//                             <img
//                                 src={src}
//                                 alt=""
//                                 className="h-12 w-12 rounded-full border-2 border-[#081220] object-cover"
//                             />
//                         </div>
//                         <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-[#081220] bg-green-400" />
//                     </div>
//                 ))}
//                 <div className="-ml-3 flex h-12 w-12 items-center justify-center rounded-full border-2 border-[#081220] bg-white/10 text-xs font-semibold text-white backdrop-blur-xl">
//                     +8
//                 </div>
//             </div>

//             <div className="h-12 w-px bg-white/10" />

//             {/* Info */}
//             <div>
//                 <div className="flex items-center gap-2">
//                     <span className="text-2xl font-bold tracking-tight text-white">10+</span>
//                     <span className="text-sm font-medium text-white/80">Featured Agents</span>
//                 </div>
//                 <div className="mt-2 flex items-center gap-2">
//                     <div className="flex items-center gap-[2px]">
//                         {[...Array(5)].map((_, i) => (
//                             <span key={i} className="text-[13px] text-[#f5c842]">★</span>
//                         ))}
//                     </div>
//                     <span className="rounded-full bg-white/5 px-2 py-1 text-[11px] font-semibold text-[#f5c842]">
//                         4.7 Client Rating
//                     </span>
//                 </div>
//             </div>

//             <div className="absolute inset-0 rounded-tl-[32px] border border-transparent transition-all duration-500 group-hover:border-[#f5c842]/20" />
//         </div>
//     );
// }

// // ─── Main Component ───────────────────────────────────────────────────────────

// export default function HeroSection() {
//     const [activeTab, setActiveTab] = useState("Buy");
//     const [query, setQuery] = useState("");
//     const [hovered, setHovered] = useState(false);
//     const [placeholderIndex, setPlaceholderIndex] = useState(0);

//     const currentTab = TAB_CONFIG[activeTab];

//     useEffect(() => {
//         const interval = setInterval(() => {
//             setPlaceholderIndex((prev) => (prev + 1) % currentTab.placeholders.length);
//         }, 2500);
//         return () => clearInterval(interval);
//     }, [activeTab, currentTab.placeholders.length]);

//     function handleTabChange(name) {
//         setActiveTab(name);
//         setPlaceholderIndex(0);
//     }

//     return (
//         <div className="min-h-screen font-['satoshi'] px-3 sm:px-5 md:px-8 lg:px-10 mt-4 sm:mt-6 md:mt-10">
//             <div className="relative overflow-hidden rounded-3xl min-h-[620px] sm:min-h-[780px] bg-[#040d18]">

//                 {/* Background image */}
//                 <img
//                     src={bg}
//                     alt=""
//                     className="absolute inset-0 h-full w-full object-cover"
//                 />

//                 {/* Overlay */}
//                 <div className="absolute inset-0 bg-[linear-gradient(105deg,rgba(4,13,24,.97)_0%,rgba(5,17,31,.91)_36%,rgba(8,22,40,.55)_64%,rgba(10,25,45,.08)_100%)]" />

//                 {/* Top-right glow */}
//                 <div className="absolute right-0 top-0 h-[500px] w-[500px] bg-[radial-gradient(ellipse_at_top_right,rgba(245,200,66,.07)_0%,transparent_70%)]" />

//                 {/* Content */}
//                 <div className="relative z-10 flex flex-col justify-between min-h-[580px] sm:min-h-[700px]">

//                     {/* Hero text */}
//                     <div className="max-w-[850px] px-4 sm:px-6 pt-16 sm:pt-20 md:pt-28 lg:pt-36 md:pl-12 lg:pl-24 xl:pl-[120px]">
//                         <h1 className="bg-[linear-gradient(90deg,#fff_35%,#f5c842_50%,#fff_65%)] bg-[length:250%_auto] bg-clip-text text-transparent text-[clamp(28px,5vw,72px)] uppercase leading-[1.1] md:leading-[0.95] tracking-[-2px] md:tracking-[-4px]">
//                             FIND YOUR PERFECT <br /> HOME TODAY
//                         </h1>

//                         <p className="mt-6 max-w-[540px] text-[15px] leading-[1.9] text-white/60">
//                             We provide tailored real estate solutions, guiding you through every step
//                             with personalized experiences that meet your unique needs and aspirations.
//                         </p>

//                         <div className="mt-10">
//                             <button
//                                 onMouseEnter={() => setHovered(true)}
//                                 onMouseLeave={() => setHovered(false)}
//                                 className="inline-flex items-center gap-4 rounded-full bg-white pl-6 pr-2 py-2 font-semibold text-black transition-all hover:shadow-lg"
//                             >
//                                 Explore Properties
//                                 <span className={`flex h-10 w-10 items-center justify-center rounded-full bg-black text-white transition-transform duration-300 ${hovered ? "rotate-45" : ""}`}>
//                                     <ArrowUpRight size={16} />
//                                 </span>
//                             </button>
//                         </div>

//                         {/* Stats */}
//                         <div className="mt-6 sm:mt-10 md:mt-14 flex flex-wrap gap-4 sm:gap-10">
//                             {STATS.map((stat, i) => (
//                                 <div
//                                     key={stat.label}
//                                     className={`pr-4 sm:pr-10 ${i !== STATS.length - 1 ? "border-r border-white/20" : ""}`}
//                                 >
//                                     <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold leading-none tracking-[-2px] text-white">
//                                         {stat.value}
//                                     </h2>
//                                     <p className="mt-2 text-sm text-white/45">{stat.label}</p>
//                                 </div>
//                             ))}
//                         </div>
//                     </div>

//                     {/* Search panel + agents */}
//                     <div className="relative z-10 flex items-end">
//                         <div className="mx-auto w-full sm:w-[95%] md:w-[92%] max-w-[980px] mb-6 sm:mb-10 overflow-hidden rounded-[20px] sm:rounded-[28px] border border-white/10 bg-gradient-to-b from-white/[0.10] to-white/[0.03] backdrop-blur-[30px] shadow-[0_8px_50px_rgba(0,0,0,.28)] mt-6 sm:mt-10">

//                             {/* Tab bar */}
//                             <div className="flex overflow-x-auto border-b border-white/10 hide-scrollbar">
//                                 {TABS.map((tab) => (
//                                     <TabButton
//                                         key={tab.name}
//                                         icon={tab.icon}
//                                         name={tab.name}
//                                         isActive={activeTab === tab.name}
//                                         onClick={() => handleTabChange(tab.name)}
//                                     />
//                                 ))}
//                             </div>

//                             {/* Search row */}
//                             <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 px-3 sm:px-4 py-3 sm:py-4">

//                                 {/* Location picker */}
//                                 <div className="flex h-[48px] sm:h-[52px] w-full sm:w-[160px] items-center justify-between rounded-xl bg-white px-4">
//                                     <div className="flex items-center gap-2">
//                                         <MapPin size={15} className="text-gray-400" />
//                                         <span className="text-sm font-semibold text-black">Noida</span>
//                                     </div>
//                                     <ChevronDown size={15} className="text-gray-400" />
//                                 </div>

//                                 {/* Search input */}
//                                 <div className="group relative flex h-[48px] sm:h-[52px] w-full sm:flex-1 items-center gap-3 overflow-hidden rounded-xl bg-white px-4">
//                                     <Search size={15} className="relative z-10 text-gray-400" />
//                                     {!query && (
//                                         <span className="pointer-events-none absolute left-11 text-sm text-gray-400">
//                                             {currentTab.placeholders[placeholderIndex]}
//                                         </span>
//                                     )}
//                                     <input
//                                         value={query}
//                                         onChange={(e) => setQuery(e.target.value)}
//                                         className="relative z-10 w-full bg-transparent text-sm outline-none"
//                                     />
//                                     <div className={`absolute right-4 h-2 w-2 rounded-full bg-[#f5c842] transition-opacity ${query ? "opacity-100" : "opacity-0"}`} />
//                                 </div>

//                                 {/* Search button */}
//                                 <button className="h-[48px] sm:h-[52px] rounded-xl bg-[#f5c842] px-6 sm:px-8 text-sm font-semibold text-black w-full sm:w-auto transition-all hover:shadow-lg active:scale-95">
//                                     Search
//                                 </button>
//                             </div>

//                             {/* Trending tags */}
//                             <div className="flex items-center gap-3 overflow-x-auto px-4 pb-4 hide-scrollbar">
//                                 <span className="text-xs text-white/35 whitespace-nowrap">Trending Searches:</span>
//                                 {currentTab.trending.map((tag) => (
//                                     <div
//                                         key={tag}
//                                         className="whitespace-nowrap rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-white/80 transition-all hover:bg-white/10 hover:scale-105 cursor-pointer"
//                                     >
//                                         {tag}
//                                     </div>
//                                 ))}
//                             </div>
//                         </div>

//                         <div className="flex-1" />
//                         <AgentsBadge />
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }