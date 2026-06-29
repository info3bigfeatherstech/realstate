// src/Components/UserSide/FreshPropertiesSection/FreshPropertyCard.jsx
import React from "react";
import { MapPin, BedDouble, ArrowUpRight } from "lucide-react";

export default function FreshPropertyCard({ item, featured = false }) {

    if (featured) {
        return (
            <div className="group cursor-pointer flex flex-col sm:flex-row w-full rounded-2xl bg-white border border-[#EFEFEF] overflow-hidden transition-all duration-300 hover:shadow-[0_8px_30px_rgba(0,0,0,0.10)] hover: min-h-[320px]">

                {/* Image — fixed height on desktop so content side doesn't look empty */}
                <div className="relative w-full sm:w-[42%] min-h-[240px] sm:min-h-[320px] flex-shrink-0 overflow-hidden bg-[#F5F5F5]">
                    <img
                        src={item.image}
                        alt={item.title}
                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />

                    {/* Verified badge */}
                    <div className="absolute left-3 top-3 rounded-full bg-black/70 px-3 py-1 text-[11px] font-semibold text-white backdrop-blur-md">
                        Verified
                    </div>

                    {/* Top Pick badge */}
                    <div className="absolute right-3 top-3 rounded-full bg-white/95 backdrop-blur-sm px-3 py-1">
                        <span className="text-[11px] font-bold text-[#111] tracking-wide uppercase">
                            Top Pick
                        </span>
                    </div>
                </div>

                {/* Content */}
                <div className="flex flex-col justify-between flex-1 p-6 sm:p-8">

                    <div className="flex flex-col gap-4">

                        {/* Status pill */}
                        <span className="self-start rounded-full bg-[#F0F4FF] px-3 py-1 text-[11px] font-semibold text-[#3B5BDB] uppercase tracking-wide">
                            {item.status}
                        </span>

                        {/* Title + arrow */}
                        <div className="flex items-start justify-between gap-3">
                            <h3 className="text-[22px] sm:text-[28px] lg:text-[32px] font-bold text-[#111] leading-snug tracking-tight">
                                {item.title}
                            </h3>
                            <div className="shrink-0 mt-1 flex h-8 w-8 items-center justify-center rounded-full border border-[#E5E5E5] transition-all duration-200 group-hover:border-[#111] group-hover:bg-[#111]">
                                <ArrowUpRight size={14} strokeWidth={2.5} className="text-[#999] transition-colors duration-200 group-hover:text-white" />
                            </div>
                        </div>

                        {/* Location */}
                        <div className="flex items-center gap-1.5">
                            <MapPin size={13} className="text-[#999] shrink-0" strokeWidth={2.5} />
                            <span className="text-[14px] text-[#999]">{item.location}</span>
                        </div>

                        {/* Description placeholder — fills the empty space */}
                        <p className="text-[14px] text-[#bbb] leading-relaxed hidden sm:block">
                            A premium verified listing ready for immediate possession. Well-connected location with easy access to schools, hospitals, and metro.
                        </p>
                    </div>

                    {/* Bottom — price + sqft */}
                    <div className="flex items-end justify-between pt-5 mt-5 border-t border-[#F0F0F0]">
                        <div>
                            <p className="text-[12px] text-[#999] mb-1">Price</p>
                            <span className="text-[30px] sm:text-[34px] font-extrabold text-[#111] tracking-tight leading-none">
                                {item.price}
                            </span>
                        </div>
                        <div className="text-right">
                            <p className="text-[12px] text-[#999] mb-1">Area</p>
                            <span className="text-[18px] font-bold text-[#555]">
                                {item.sqft}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // ── Small card ──
    return (
        <div className="group cursor-pointer w-full rounded-2xl bg-white border border-[#EFEFEF] overflow-hidden transition-all duration-300 hover:shadow-[0_8px_30px_rgba(0,0,0,0.10)] ">

            {/* Image — controlled height, not aspect ratio based */}
            <div className="relative w-full h-[180px] overflow-hidden bg-[#F5F5F5]">
                <img
                    src={item.image}
                    alt={item.title}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {/* Verified badge */}
                <div className="absolute left-3 top-3 rounded-full bg-black/70 px-3 py-1 text-[11px] font-semibold text-white backdrop-blur-md">
                    Verified
                </div>

                {/* Price overlay */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent px-4 pt-6 pb-3">
                    <span className="text-[17px] font-extrabold text-white tracking-tight">
                        {item.price}
                    </span>
                </div>
            </div>

            {/* Content */}
            <div className="p-4">

                {/* Location */}
                <div className="flex items-center gap-1 mb-1.5">
                    <MapPin size={11} className="text-[#999] shrink-0" strokeWidth={2.5} />
                    <span className="text-[12px] text-[#999] truncate">{item.location}</span>
                </div>

                {/* Title + arrow */}
                <div className="flex items-start justify-between gap-2 mb-3">
                    <h3 className="text-[15px] font-bold text-[#111] leading-snug line-clamp-1 tracking-tight flex-1">
                        {item.title}
                    </h3>
                    <div className="shrink-0 flex h-6 w-6 items-center justify-center rounded-full border border-[#E5E5E5] transition-all duration-200 group-hover:border-[#111] group-hover:bg-[#111]">
                        <ArrowUpRight size={12} strokeWidth={2.5} className="text-[#999] transition-colors duration-200 group-hover:text-white" />
                    </div>
                </div>

                {/* Specs */}
                <div className="flex items-center justify-between pt-3 border-t border-[#F0F0F0]">
                    <div className="flex items-center gap-1.5">
                        <BedDouble size={13} className="text-[#888]" strokeWidth={2} />
                        <span className="text-[12px] font-semibold text-[#555]">{item.status}</span>
                    </div>
                    <span className="text-[12px] font-semibold text-[#555]">{item.sqft}</span>
                </div>
            </div>
        </div>
    );
}