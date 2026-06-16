// src/Components/Admin_Segment/Tabs/PropertiesTab/Shared/LocationPicker.jsx
import { useState, useEffect, useCallback } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix default marker icon (Leaflet + Vite issue)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

function MapClickHandler({ onLocationSelect }) {
    useMapEvents({
        click(e) {
            onLocationSelect(e.latlng.lat, e.latlng.lng);
        },
    });
    return null;
}

async function reverseGeocode(lat, lng) {
    try {
        const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&addressdetails=1`,
            { headers: { "Accept-Language": "en" } }
        );
        const data = await res.json();
        const addr = data.address || {};

        const city =
            addr.city || addr.town || addr.village || addr.county || addr.state_district || "";

        const state = addr.state || "";
        const pincode = addr.postcode || "";
        const fullAddress = data.display_name || "";

        return { fullAddress, city, state, pincode };
    } catch {
        return { fullAddress: "", city: "", state: "", pincode: "" };
    }
}

export default function LocationPicker({ onChange }) {
    const [markerPos, setMarkerPos] = useState(null);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");
    const [mapCenter, setMapCenter] = useState([20.5937, 78.9629]);
    const [mapZoom, setMapZoom] = useState(5);
    const [statusMsg, setStatusMsg] = useState("Click anywhere on the map to pick a location");

    const handleLocationSelect = useCallback(async (lat, lng) => {
        setMarkerPos([lat, lng]);
        setLoading(true);
        setStatusMsg("Fetching address...");
        const result = await reverseGeocode(lat, lng);
        onChange({ lat, lng, ...result });
        setStatusMsg(`📍 ${result.fullAddress || `${lat.toFixed(5)}, ${lng.toFixed(5)}`}`);
        setLoading(false);
    }, [onChange]);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!search.trim()) return;
        setLoading(true);
        setStatusMsg("Searching...");
        try {
            const res = await fetch(
                `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(search)}&format=json&limit=1&addressdetails=1`,
                { headers: { "Accept-Language": "en" } }
            );
            const data = await res.json();
            if (data.length > 0) {
                const { lat, lon } = data[0];
                setMapCenter([parseFloat(lat), parseFloat(lon)]);
                setMapZoom(14);
                await handleLocationSelect(parseFloat(lat), parseFloat(lon));
            } else {
                setStatusMsg("Location not found. Try a more specific address.");
                setLoading(false);
            }
        } catch {
            setStatusMsg("Search failed. Check your internet connection.");
            setLoading(false);
        }
    };

    const handleMyLocation = () => {
        if (!navigator.geolocation) {
            setStatusMsg("Geolocation not supported by your browser.");
            return;
        }
        setLoading(true);
        setStatusMsg("Getting your location...");
        navigator.geolocation.getCurrentPosition(
            async ({ coords }) => {
                setMapCenter([coords.latitude, coords.longitude]);
                setMapZoom(16);
                await handleLocationSelect(coords.latitude, coords.longitude);
            },
            () => {
                setStatusMsg("Location access denied. Allow location in browser settings.");
                setLoading(false);
            }
        );
    };

    return (
        <div className="rounded-xl border border-slate-200 overflow-hidden">
            {/* Search bar */}
            <div className="bg-slate-50 border-b border-slate-200 p-3 flex gap-2">
                <form onSubmit={handleSearch} className="flex flex-1 gap-2">
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search address, area, city..."
                        className="flex-1 h-9 px-3 rounded-lg border border-slate-300 text-sm focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none"
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        className="h-9 px-4 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 disabled:opacity-50 transition-colors"
                    >
                        Search
                    </button>
                </form>
                <button
                    type="button"
                    onClick={handleMyLocation}
                    disabled={loading}
                    title="Use my current location"
                    className="h-9 w-9 flex items-center justify-center rounded-lg border border-slate-300 bg-white hover:bg-blue-50 hover:border-blue-400 transition-colors disabled:opacity-50"
                >
                    🎯
                </button>
            </div>

            {/* Map */}
            <div className="relative">
                <MapContainer
                    center={mapCenter}
                    zoom={mapZoom}
                    key={`${mapCenter[0]}-${mapCenter[1]}-${mapZoom}`}
                    style={{ height: "340px", width: "100%" }}
                    zoomControl={true}
                >
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    />
                    <MapClickHandler onLocationSelect={handleLocationSelect} />
                    {markerPos && <Marker position={markerPos} />}
                </MapContainer>

                {loading && (
                    <div className="absolute inset-0 bg-white/60 flex items-center justify-center z-[999]">
                        <div className="flex items-center gap-2 bg-white rounded-lg px-4 py-2 shadow border text-sm font-medium text-slate-600">
                            <span className="h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                            Fetching address...
                        </div>
                    </div>
                )}
            </div>

            {/* Status */}
            <div className="bg-slate-50 border-t border-slate-200 px-3 py-2">
                <p className="text-xs text-slate-500 truncate">{statusMsg}</p>
            </div>
        </div>
    );
}
