// src/Components/UserSide/PropertyDetail/PropertyMap.jsx
import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

function FlyTo({ lat, lng }) {
    const map = useMap();
    useEffect(() => {
        map.setView([lat, lng], 15);
    }, [lat, lng, map]);
    return null;
}

export default function PropertyMap({ lat, lng, title }) {
    if (!lat || !lng) return null;

    return (
        <div
            className="overflow-hidden rounded-xl border border-[#EBEBEB]"
            style={{ height: "320px" }}
        >
            <MapContainer
                center={[lat, lng]}
                zoom={15}
                style={{ height: "100%", width: "100%" }}
                scrollWheelZoom={false}
                zoomControl={true}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                />
                <FlyTo lat={lat} lng={lng} />
                <Marker position={[lat, lng]}>
                    {title && (
                        <Popup>
                            <span className="font-semibold text-[13px]">{title}</span>
                        </Popup>
                    )}
                </Marker>
            </MapContainer>
        </div>
    );
}
//
// import { useEffect } from "react";
// import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
// import L from "leaflet";
// import "leaflet/dist/leaflet.css";

// delete L.Icon.Default.prototype._getIconUrl;
// L.Icon.Default.mergeOptions({
//     iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
//     iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
//     shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
// });

// function FlyTo({ lat, lng }) {
//     const map = useMap();
//     useEffect(() => {
//         map.setView([lat, lng], 15);
//     }, [lat, lng, map]);
//     return null;
// }

// export default function PropertyMap({ lat, lng, title }) {
//     if (!lat || !lng) return null;

//     return (
//         <div className="overflow-hidden rounded-xl border border-[#EBEBEB]" style={{ height: "320px" }}>
//             <MapContainer
//                 center={[lat, lng]}
//                 zoom={15}
//                 style={{ height: "100%", width: "100%" }}
//                 scrollWheelZoom={false}
//                 zoomControl={true}
//             >
//                 <TileLayer
//                     url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//                     attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
//                 />
//                 <FlyTo lat={lat} lng={lng} />
//                 <Marker position={[lat, lng]}>
//                     {title && (
//                         <Popup>
//                             <span className="font-semibold text-[13px]">{title}</span>
//                         </Popup>
//                     )}
//                 </Marker>
//             </MapContainer>
//         </div>
//     );
// }
