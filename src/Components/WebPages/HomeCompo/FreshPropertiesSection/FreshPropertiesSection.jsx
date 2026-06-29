// src/Components/UserSide/FreshPropertiesSection/FreshPropertiesSection.jsx
import React from "react";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import FreshPropertyCard from "./FreshPropertyCard";

import "swiper/css";
import "swiper/css/navigation";

const properties = [
    {
        title: "3 BHK Luxury Flat",
        price: "₹1.57 Cr",
        sqft: "1600 sqft",
        location: "Whitefield, Bangalore",
        status: "Ready To Move",
        image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=1200&auto=format&fit=crop",
    },
    {
        title: "Modern 2 BHK",
        price: "₹95 Lac",
        sqft: "1180 sqft",
        location: "Indiranagar, Bangalore",
        status: "New Launch",
        image: "https://images.unsplash.com/photo-1494526585095-c41746248156?q=80&w=1200&auto=format&fit=crop",
    },
    {
        title: "Premium Penthouse",
        price: "₹3.2 Cr",
        sqft: "4200 sqft",
        location: "Sarjapur Road",
        status: "Ready To Move",
        image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1200&auto=format&fit=crop",
    },
    {
        title: "Builder Floor",
        price: "₹1.2 Cr",
        sqft: "1450 sqft",
        location: "Electronic City",
        status: "Under Construction",
        image: "https://images.unsplash.com/photo-1460317442991-0ec209397118?q=80&w=1200&auto=format&fit=crop",
    },
    {
        title: "Builder Floor",
        price: "₹1.2 Cr",
        sqft: "1450 sqft",
        location: "Electronic City",
        status: "Under Construction",
        image: "https://images.unsplash.com/photo-1460317442991-0ec209397118?q=80&w=1200&auto=format&fit=crop",
    },
];

const FreshPropertiesSection = () => {
    const [featured, ...rest] = properties;

    return (
        <section className="py-20 font-['Satoshi']">
            <div className="w-full px-5 md:px-10 lg:px-16">

                {/* HEADER */}
                <div className="mb-10">
                    <h4 className="text-[20px] sm:text-[36px] lg:text-[35px]  tracking-[-2px] text-[#081630]">
                        Fresh Properties
                    </h4>
                    <p className="mt-2 text-[#7d8797] text-[16px]">
                        Newly added verified listings
                    </p>
                </div>

                {/* FEATURED HERO — fixed, no slider */}
                <div className="mb-5">
                    <FreshPropertyCard item={featured} featured={true} />
                </div>

                {/* BOTTOM CARDS — autoplay slider */}
                <div className="relative px-0 md:px-6">
                    {/* Left Navigation Arrow */}
                    <button
                        id="fresh-prev"
                        className="absolute left-2 md:left-[-15px] top-1/2 z-30 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white/90 shadow-md backdrop-blur-sm transition-all hover:bg-slate-900 hover:text-white disabled:opacity-40 cursor-pointer"
                    >
                        <ChevronLeft size={20} strokeWidth={2.5} />
                    </button>

                    {/* Right Navigation Arrow */}
                    <button
                        id="fresh-next"
                        className="absolute right-2 md:right-[-15px] top-1/2 z-30 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white/90 shadow-md backdrop-blur-sm transition-all hover:bg-slate-900 hover:text-white disabled:opacity-40 cursor-pointer"
                    >
                        <ChevronRight size={20} strokeWidth={2.5} />
                    </button>

                    <Swiper
                        modules={[Navigation, Autoplay]}
                        navigation={{
                            prevEl: "#fresh-prev",
                            nextEl: "#fresh-next",
                        }}
                        autoplay={{
                            delay: 3000,
                            disableOnInteraction: false,   // user ne manually slide kiya toh bhi autoplay continue kare
                            pauseOnMouseEnter: true,        // hover pe ruk jaye
                        }}
                        loop={rest.length > 3}
                        spaceBetween={20}
                        slidesPerView={1}
                        breakpoints={{
                            640: { slidesPerView: 2 },
                            1024: { slidesPerView: 3 },
                        }}
                    >
                        {rest.map((item, index) => (
                            <SwiperSlide key={index}>
                                <FreshPropertyCard item={item} />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>

                {/* View All Button at Center Bottom */}
                <div className="mt-12 flex justify-center">
                    <button className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-7 py-3 text-[15px] font-bold text-black transition-all hover:border-[#111] hover:bg-slate-50 cursor-pointer">
                        View All
                        <ArrowRight size={16} />
                    </button>
                </div>

            </div>
        </section>
    );
};

export default FreshPropertiesSection;

// import React from "react";
// import { Swiper, SwiperSlide } from "swiper/react";
// import { Navigation } from "swiper/modules";
// import { ArrowRight, BedDouble, MapPin } from "lucide-react";

// import "swiper/css";
// import "swiper/css/navigation";

// const properties = [
//     {
//         title: "3 BHK Luxury Flat",
//         price: "₹1.57 Cr",
//         sqft: "1600 sqft",
//         location: "Whitefield, Bangalore",
//         status: "Ready To Move",
//         image:
//             "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=1200&auto=format&fit=crop",
//     },

//     {
//         title: "Modern 2 BHK",
//         price: "₹95 Lac",
//         sqft: "1180 sqft",
//         location: "Indiranagar, Bangalore",
//         status: "New Launch",
//         image:
//             "https://images.unsplash.com/photo-1494526585095-c41746248156?q=80&w=1200&auto=format&fit=crop",
//     },

//     {
//         title: "Premium Penthouse",
//         price: "₹3.2 Cr",
//         sqft: "4200 sqft",
//         location: "Sarjapur Road",
//         status: "Ready To Move",
//         image:
//             "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1200&auto=format&fit=crop",
//     },

//     {
//         title: "Builder Floor",
//         price: "₹1.2 Cr",
//         sqft: "1450 sqft",
//         location: "Electronic City",
//         status: "Under Construction",
//         image:
//             "https://images.unsplash.com/photo-1460317442991-0ec209397118?q=80&w=1200&auto=format&fit=crop",
//     },
// ];

// const FreshPropertiesSection = () => {
//     return (
//         <section className="py-20 font-['Satoshi']">

//             <div className="w-full px-5 md:px-10 lg:px-16">

//                 <div className="mb-10 flex items-center justify-between">

//                     <div>

//                         <h4 className="text-[20px] sm:text-[36px] lg:text-[40px] font- uppercase tracking-[-2px] text-[#081630]">
//                             Fresh Properties
//                         </h4>

//                         <p className="mt-2 text-[#7d8797] text-[16px]">
//                             Newly added verified listings
//                         </p>
//                     </div>

//                     <button className="flex items-center gap-2 text-[15px] font-bold text-black">
//                         View All
//                         <ArrowRight size={16} />
//                     </button>
//                 </div>

//                 <Swiper
//                     modules={[Navigation]}
//                     navigation
//                     spaceBetween={20}
//                     slidesPerView={1}
//                     breakpoints={{
//                         480: { slidesPerView: 1.5 },
//                         640: { slidesPerView: 2 },
//                         900: { slidesPerView: 3 },
//                         1200: { slidesPerView: 4 },
//                     }}
//                 >
//                     {properties.map((item, index) => (
//                         <SwiperSlide key={index}>

//                             <div className="overflow-hidden rounded-[24px] border border-black/5 bg-white">

//                                 <div className="relative overflow-hidden">

//                                     <img
//                                         src={item.image}
//                                         alt=""
//                                         className="h-[260px] w-full object-cover transition duration-700 hover:scale-105"
//                                     />

//                                     <div className="absolute left-4 top-4 rounded-full bg-black/70 px-3 py-1 text-[12px] text-white backdrop-blur-md">
//                                         Verified
//                                     </div>
//                                 </div>

//                                 <div className="p-5">

//                                     <h3 className="text-[22px] font-bold text-[#111]">
//                                         {item.title}
//                                     </h3>

//                                     <div className="mt-3 flex items-center gap-3">

//                                         <span className="text-[24px] font-black text-black">
//                                             {item.price}
//                                         </span>

//                                         <span className="text-[#999]">|</span>

//                                         <span className="text-[16px] text-[#666]">
//                                             {item.sqft}
//                                         </span>
//                                     </div>

//                                     <div className="mt-4 flex items-center gap-2 text-[#777]">

//                                         <MapPin size={15} />

//                                         <span>{item.location}</span>
//                                     </div>

//                                     <div className="mt-3 flex items-center gap-2 text-[#777]">

//                                         <BedDouble size={15} />

//                                         <span>{item.status}</span>
//                                     </div>
//                                 </div>
//                             </div>
//                         </SwiperSlide>
//                     ))}
//                 </Swiper>
//             </div>
//         </section>
//     );
// };

// export default FreshPropertiesSection;