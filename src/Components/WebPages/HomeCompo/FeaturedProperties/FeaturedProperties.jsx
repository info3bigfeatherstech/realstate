// src/Components/UserSide/FeaturedProperties/FeaturedProperties.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation, Autoplay } from "swiper/modules";
import { useGetPropertiesQuery } from "../../../../REDUX_FEATURES/REDUX_SLICES/userPropertyApi/userPropertyApi";
import PropertyCard from "../../../UserSide/PropertyCard/PropertyCard";
import "swiper/css";
import "swiper/css/pagination";
import { ArrowUpRight } from "lucide-react";

const tabs = [
    { label: "All", value: "", },
    { label: "Buy", value: "For Sell", },
    { label: "Rent", value: "For Rent", },
    { label: "PG", value: "PG", },
    { label: "Commercial", value: "Office Space", },
    { label: "Plots", value: "Residential Plot", },
];

const FeaturedProperties = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("All");

    const getListingType = () => {
        const tab = tabs.find(t => t.label === activeTab);
        return tab?.value || "";
    };

    const { data, isLoading, isFetching } = useGetPropertiesQuery({
        page: 1,
        limit: 10,
        ...(getListingType() && { listingType: getListingType() }),
        sortBy: "publishedAt",
        sortOrder: "desc"
    });

    const properties = data?.data || [];
    const isLoadingData = isLoading || isFetching;

    const handlePropertyClick = (propertyId) => {
        navigate(`/property/${propertyId}`);
    };

    return (
        <section className="bg-white py-20 font-['satoshi']">
            <div className="w-full px-5 md:px-10 lg:px-16">
                {/* LABEL */}
                <div>
                    <div className="mb-5 inline-flex items-center rounded-full border border-[#E0E0E0] px-4 py-[6px]">
                        <span className="text-[16px] font-medium text-[#555]">
                            Featured Properties
                        </span>
                    </div>
                </div>

                {/* HEADING + TABS */}
                <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
                    <h3 className="max-w-[800px] text-[clamp(28px,4vw,42px)] font-uppercase leading-[1.05] tracking-[-1.5px] text-[#111] sm:text-[36px] lg:text-[42px]">
                        Discover Homes Tailored To Your
                        <br />
                        Lifestyle And Needs
                    </h3>

                    <div className="flex flex-wrap gap-2">
                        {tabs.map((tab) => {
                            const active = activeTab === tab.label;
                            return (
                                <button
                                    key={tab.label}
                                    onClick={() => setActiveTab(tab.label)}
                                    className={`rounded-full border px-5 py-[9px] text-[13px] font-semibold transition-all duration-200 ${active
                                        ? "border-[#111] bg-[#111] text-white"
                                        : "border-[#E8E8E8] bg-white text-[#666] hover:border-[#111] hover:text-[#111]"
                                        }`}
                                >
                                    {tab.label}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* NAVIGATION BUTTONS */}
                <div className="mb-10 flex items-center justify-end gap-3 pr-5 lg:pr-10">
                    <button className="featured-prev flex h-11 w-11 items-center justify-center rounded-full border border-[#E5E5E5] bg-white transition-all duration-300 hover:border-[#111] hover:bg-[#111] hover:text-white">
                        ←
                    </button>
                    <button className="featured-next flex h-12 w-12 items-center justify-center rounded-full border border-[#E5E5E5] bg-white transition-all duration-300 hover:border-[#111] hover:bg-[#111] hover:text-white">
                        →
                    </button>
                </div>

                {/* LOADING STATE */}
                {isLoadingData ? (
                    <div className="flex h-96 items-center justify-center">
                        <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
                    </div>
                ) : properties.length === 0 ? (
                    <div className="flex h-96 items-center justify-center">
                        <p className="text-slate-500">No properties found</p>
                    </div>
                ) : (
                    <Swiper
                        modules={[Pagination, Navigation, Autoplay]}
                        spaceBetween={30}
                        slidesPerView={1.1}
                        speed={900}
                        grabCursor={true}
                        autoplay={{
                            delay: 4000,
                            disableOnInteraction: false,
                            pauseOnMouseEnter: true,
                        }}
                        navigation={{
                            prevEl: ".featured-prev",
                            nextEl: ".featured-next",
                        }}
                        pagination={{ clickable: true }}
                        key={activeTab}
                        breakpoints={{
                            600: { slidesPerView: 1.8, spaceBetween: 20 },
                            900: { slidesPerView: 2.5, spaceBetween: 24 },
                            1240: { slidesPerView: 3.5, spaceBetween: 30 },
                            1600: { slidesPerView: 4.2, spaceBetween: 30 },
                        }}
                        className="featured-swiper"
                    >
                        {properties.map((property) => (
                            <SwiperSlide key={property._id}>
                                <PropertyCard
                                    property={property}
                                    onClick={() => handlePropertyClick(property._id)}
                                />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                )}

                {/* EXPLORE ALL BUTTON */}
                {/* <div className="mt-16 flex justify-center">
                    <button
                        onClick={() => navigate("/properties")}
                        className="inline-flex items-center gap-2.5 rounded-full bg-[#111] px-8 py-[15px] transition-colors duration-200 hover:bg-[#333]"
                    >
                        <span className="text-[14px] font-bold text-white">
                            Explore All Properties
                        </span>
                        <div className="flex h-[30px] w-[30px] items-center justify-center rounded-full bg-white">
                            <ArrowUpRight size={15} color="#111" strokeWidth={2.5} />
                        </div>
                    </button>
                </div> */}
            </div>
        </section>
    );
};

export default FeaturedProperties;

// // src/Components/UserSide/FeaturedProperties/FeaturedProperties.jsx
// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { Swiper, SwiperSlide } from "swiper/react";
// import { Pagination, Navigation, Autoplay } from "swiper/modules";
// import { useGetPropertiesQuery } from "../../../../REDUX_FEATURES/REDUX_SLICES/userPropertyApi/userPropertyApi";
// import PropertyCard from "../../../UserSide/PropertyCard/PropertyCard";
// import "swiper/css";
// import "swiper/css/pagination";
// import { ArrowUpRight } from "lucide-react";

// const tabs = [
//     { label: "All", value: "", count: "20K+" },
//     { label: "Buy", value: "For Sale", count: "12K+" },
//     { label: "Rent", value: "For Rent", count: "4K+" },
//     { label: "PG", value: "PG", count: "2K+" },
//     { label: "Commercial", value: "Office Space", count: "800+" },
//     { label: "Plots", value: "Residential Plot", count: "46+" },
// ];

// const FeaturedProperties = () => {
//     const navigate = useNavigate();
//     const [activeTab, setActiveTab] = useState("All");

//     // Get active tab value for API
//     const getListingType = () => {
//         const tab = tabs.find(t => t.label === activeTab);
//         return tab?.value || "";
//     };

//     const { data, isLoading, isFetching } = useGetPropertiesQuery({
//         page: 1,
//         limit: 10,
//         ...(getListingType() && { listingType: getListingType() }),
//         sortBy: "publishedAt",
//         sortOrder: "desc"
//     });

//     const properties = data?.data || [];
//     const isLoadingData = isLoading || isFetching;

//     const handlePropertyClick = (propertyId) => {
//         navigate(`/property/${propertyId}`);
//     };

//     return (
//         <section className="bg-white py-20 font-['satoshi']">
//             <div className="w-full px-5 md:px-10 lg:px-16">
//                 {/* LABEL */}
//                 <div>
//                     <div className="mb-5 inline-flex items-center rounded-full border border-[#E0E0E0] px-4 py-[6px]">
//                         <span className="text-[16px] font-medium text-[#555]">
//                             Featured Properties
//                         </span>
//                     </div>
//                 </div>

//                 {/* HEADING + TABS */}
//                 <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
//                     {/* HEADING */}
//                     <h3 className="max-w-[800px] text-[clamp(28px,4vw,42px)] font-uppercase leading-[1.05] tracking-[-1.5px] text-[#111] sm:text-[36px] lg:text-[42px]">
//                         Discover Homes Tailored To Your
//                         <br />
//                         Lifestyle And Needs
//                     </h3>

//                     {/* TABS */}
//                     <div className="flex flex-wrap gap-2">
//                         {tabs.map((tab) => {
//                             const active = activeTab === tab.label;
//                             return (
//                                 <button
//                                     key={tab.label}
//                                     onClick={() => setActiveTab(tab.label)}
//                                     className={`rounded-full border px-5 py-[9px] text-[13px] font-semibold transition-all duration-200 ${active
//                                         ? "border-[#111] bg-[#111] text-white"
//                                         : "border-[#E8E8E8] bg-white text-[#666] hover:border-[#111] hover:text-[#111]"
//                                         }`}
//                                 >
//                                     {tab.label} ({tab.count})
//                                 </button>
//                             );
//                         })}
//                     </div>
//                 </div>

//                 {/* NAVIGATION BUTTONS */}
//                 <div className="mb-10 flex items-center justify-end gap-3 pr-5 lg:pr-10">
//                     <button className="featured-prev flex h-11 w-11 items-center justify-center rounded-full border border-[#E5E5E5] bg-white transition-all duration-300 hover:border-[#111] hover:bg-[#111] hover:text-white">
//                         ←
//                     </button>
//                     <button className="featured-next flex h-12 w-12 items-center justify-center rounded-full border border-[#E5E5E5] bg-white transition-all duration-300 hover:border-[#111] hover:bg-[#111] hover:text-white">
//                         →
//                     </button>
//                 </div>

//                 {/* LOADING STATE */}
//                 {isLoadingData ? (
//                     <div className="flex h-96 items-center justify-center">
//                         <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
//                     </div>
//                 ) : properties.length === 0 ? (
//                     <div className="flex h-96 items-center justify-center">
//                         <p className="text-slate-500">No properties found</p>
//                     </div>
//                 ) : (
//                     <Swiper
//                         modules={[Pagination, Navigation, Autoplay]}
//                         spaceBetween={24}
//                         slidesPerView={1.1}
//                         speed={900}
//                         grabCursor={true}
//                         autoplay={{
//                             delay: 4000,
//                             disableOnInteraction: false,
//                             pauseOnMouseEnter: true,
//                         }}
//                         navigation={{
//                             prevEl: ".featured-prev",
//                             nextEl: ".featured-next",
//                         }}
//                         pagination={{ clickable: true }}
//                         key={activeTab}
//                         breakpoints={{
//                             640: { slidesPerView: 1.2 },
//                             900: { slidesPerView: 2 },
//                             1200: { slidesPerView: 2.6 },
//                             1536: { slidesPerView: 3.2 },
//                         }}
//                         className="featured-swiper"
//                     >
//                         {properties.map((property) => (
//                             <SwiperSlide key={property._id}>
//                                 <PropertyCard
//                                     property={property}
//                                     onClick={() => handlePropertyClick(property._id)}
//                                 />
//                             </SwiperSlide>
//                         ))}
//                     </Swiper>
//                 )}

//                 {/* EXPLORE ALL BUTTON */}
//                 <div className="mt-16 flex justify-center">
//                     <button
//                         onClick={() => navigate("/properties")}
//                         className="inline-flex items-center gap-2.5 rounded-full bg-[#111] px-8 py-[15px] transition-colors duration-200 hover:bg-[#333]"
//                     >
//                         <span className="text-[14px] font-bold text-white">
//                             Explore All Properties
//                         </span>
//                         <div className="flex h-[30px] w-[30px] items-center justify-center rounded-full bg-white">
//                             <ArrowUpRight size={15} color="#111" strokeWidth={2.5} />
//                         </div>
//                     </button>
//                 </div>
//             </div>
//         </section>
//     );
// };

// export default FeaturedProperties;