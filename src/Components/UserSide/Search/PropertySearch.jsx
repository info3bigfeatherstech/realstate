import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Home,
  KeyRound,
  Building2,
  Landmark,
  MapPin,
  Search,
  ChevronDown,
} from "lucide-react";
import { SEARCH_LOCATIONS } from "../../../data/propertiesDemo";

const TABS = [
  { icon: Home, name: "Buy", mode: "buy" },
  { icon: KeyRound, name: "Rent", mode: "rent" },
  { icon: Building2, name: "Investment", mode: "investment" },
  { icon: Landmark, name: "Projects", mode: "projects" },
];

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

function TabButton({ icon: Icon, name, isActive, onClick, isFirst, isLast }) {
  const config = TAB_CONFIG[name];
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        relative flex min-w-fit flex-1 items-center justify-center gap-3
        border-r border-white/5 px-6 py-4 transition-all duration-300
        ${isActive ? "text-white bg-white/[0.04]" : "text-white/40 hover:text-white/80"}
        ${isFirst ? "rounded-tl-[20px] sm:rounded-tl-[28px]" : ""}
        ${isLast ? "border-r-0 rounded-tr-[20px] sm:rounded-tr-[28px]" : ""}
      `}
    >
      <div
        className={`flex h-8 w-8 items-center justify-center rounded-xl transition-all duration-300 ${isActive
          ? "bg-[#C8973E] text-black shadow-[0_0_20px_rgba(245,200,66,.35)] scale-105"
          : "bg-white/5 text-white/60"
          }`}
      >
        <Icon size={15} />
      </div>
      <div className="flex flex-col items-start text-left text-white">
        <span className="text-sm font-semibold tracking-wide whitespace-nowrap">{name}</span>
        <span className="text-[10px] tracking-wide text-white">{config?.stats}</span>
      </div>
      {isActive && <div className="absolute bottom-0 left-0 h-[2px] w-full bg-[#f5c842]" />}
    </button>
  );
}

export default function PropertySearch() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Buy");
  const [query, setQuery] = useState("");
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [selectedLocation, setSelectedLocation] = useState("Select Location");
  const [locationMenuOpen, setLocationMenuOpen] = useState(false);

  const currentTab = TAB_CONFIG[activeTab];
  const currentMode = TABS.find((t) => t.name === activeTab)?.mode ?? "buy";

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % currentTab.placeholders.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [activeTab, currentTab.placeholders.length]);

  function handleSearch() {
    const params = new URLSearchParams({
      mode: currentMode,
      city: selectedLocation,
    });
    if (query.trim()) params.set("q", query.trim());
    navigate(`/properties?${params.toString()}`);
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") handleSearch();
  }

  return (
    <div className="w-full max-w-[820px] rounded-[20px] sm:rounded-[28px] border border-white/10 bg-gradient-to-b from-white/[0.10] to-white/[0.03] backdrop-blur-[30px] shadow-[0_8px_50px_rgba(0,0,0,.28)] mt-6 sm:mt-10">
      <div className="flex overflow-x-auto border-b border-white/10 hide-scrollbar rounded-t-[20px] sm:rounded-t-[28px]">
        {TABS.map((tab, idx) => (
          <TabButton
            key={tab.name}
            icon={tab.icon}
            name={tab.name}
            isActive={activeTab === tab.name}
            onClick={() => {
              setActiveTab(tab.name);
              setPlaceholderIndex(0);
            }}
            isFirst={idx === 0}
            isLast={idx === TABS.length - 1}
          />
        ))}
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 px-4 py-4">
        <div className="relative w-full sm:w-[240px]">
          <button
            type="button"
            onClick={() => setLocationMenuOpen(!locationMenuOpen)}
            className="flex h-[52px] w-full items-center justify-between rounded-xl bg-white px-4 text-left shadow-md transition-all active:scale-[0.98]"
          >
            <div className="flex items-center gap-2 overflow-hidden">
              <MapPin size={16} className="text-gray-400 shrink-0" />
              <span className="text-sm font-bold text-black truncate">{selectedLocation}</span>
            </div>
            <ChevronDown
              size={15}
              className={`text-gray-400 shrink-0 transition-transform duration-200 ${locationMenuOpen ? "rotate-180" : ""}`}
            />
          </button>

          {locationMenuOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setLocationMenuOpen(false)} />
              <div className="absolute left-0 bottom-full sm:bottom-auto sm:top-full mb-2 sm:mb-0 sm:mt-2 w-full rounded-xl bg-white p-1 text-black shadow-[0_10px_30px_rgba(0,0,0,0.5)] border border-gray-200 z-50">
                {SEARCH_LOCATIONS.map((loc) => (
                  <button
                    key={loc}
                    type="button"
                    onClick={() => {
                      setSelectedLocation(loc);
                      setLocationMenuOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2.5 text-sm font-semibold rounded-lg transition-colors ${selectedLocation === loc
                      ? "bg-amber-100 text-amber-900 font-bold"
                      : "hover:bg-slate-100 text-slate-800"
                      }`}
                  >
                    {loc}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

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
            onKeyDown={handleKeyDown}
            className="w-full bg-transparent text-sm font-medium text-black outline-none"
          />
        </div>

        <button
          type="button"
          onClick={handleSearch}
          className="h-[52px] rounded-xl bg-[#C8973E] px-8 text-sm font-bold text-black w-full sm:w-auto transition-all hover:bg-[#e0b536] active:scale-[0.97]"
        >
          Search
        </button>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto px-4 pb-4 hide-scrollbar">
        <span className="text-xs text-white whitespace-nowrap mr-1">Trending:</span>
        {currentTab?.trending.map((tag) => (
          <button
            key={tag}
            type="button"
            onClick={() => setQuery(tag)}
            className="whitespace-nowrap rounded-full border border-white/5 bg-white/5 px-3 py-1.5 text-xs text-white transition-all hover:bg-white/10 cursor-pointer"
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  );
}
