import React from "react";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";

const tools = [
    {
        title: "Owner Properties",
        count: "37,536",
        image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1200&auto=format&fit=crop",
    },
    {
        title: "Projects",
        count: "1000+",
        image: "https://images.unsplash.com/photo-1511818966892-d7d671e672a2?q=80&w=1200&auto=format&fit=crop",
    },
    {
        title: "Budget Homes",
        count: "819",
        image: "https://images.unsplash.com/photo-1484154218962-a197022b5858?q=80&w=1200&auto=format&fit=crop",
    },
    {
        title: "Luxury Villas",
        count: "245",
        image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1200&auto=format&fit=crop",
    },
    {
        title: "Commercial Spaces",
        count: "1,200+",
        image: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?q=80&w=1200&auto=format&fit=crop",
    },
];

const PropertyToolsSection = () => {
    return (
        <section className="bg-[#f5f5f3] pb-20 font-['Satoshi']">
            <div className="w-full px-5 md:px-10 lg:px-16">

                {/* HEADER */}
                <div className="mb-10">
                    <h2 className="text-[30px] sm:text-[36px] lg:text-[35px] tracking-[-2px] text-[#081630]">
                        We've got properties for everyone
                    </h2>
                </div>

                {/* SLIDER WRAPPER */}
                <div className="relative px-0 md:px-6">

                    {/* Prev Arrow */}
                    <button
                        id="tools-prev"
                        className="absolute left-2 md:left-[-15px] top-1/2 z-30 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white/90 shadow-md backdrop-blur-sm transition-all hover:bg-slate-900 hover:text-white disabled:opacity-40 cursor-pointer"
                    >
                        <ChevronLeft size={20} strokeWidth={2.5} />
                    </button>

                    {/* Next Arrow */}
                    <button
                        id="tools-next"
                        className="absolute right-2 md:right-[-15px] top-1/2 z-30 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white/90 shadow-md backdrop-blur-sm transition-all hover:bg-slate-900 hover:text-white disabled:opacity-40 cursor-pointer"
                    >
                        <ChevronRight size={20} strokeWidth={2.5} />
                    </button>

                    <Swiper
                        modules={[Navigation, Autoplay]}
                        navigation={{
                            prevEl: "#tools-prev",
                            nextEl: "#tools-next",
                        }}
                        autoplay={{
                            delay: 3000,
                            disableOnInteraction: false,
                            pauseOnMouseEnter: true,
                        }}
                        loop={tools.length > 3}
                        spaceBetween={24}
                        slidesPerView={1}
                        breakpoints={{
                            640: { slidesPerView: 2 },
                            1024: { slidesPerView: 3 },
                        }}
                    >
                        {tools.map((item) => (
                            <SwiperSlide key={item.title}>
                                <div className="group relative overflow-hidden rounded-[28px]">

                                    <img
                                        src={item.image}
                                        alt={item.title}
                                        className="h-[320px] w-full object-cover transition duration-700 group-hover:scale-105"
                                    />

                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                                    <div className="absolute bottom-0 p-8">
                                        <h3 className="text-[36px] sm:text-[44px] lg:text-[52px] font-black text-white leading-[1]">
                                            {item.count}
                                        </h3>
                                        <p className="text-[22px] sm:text-[26px] lg:text-[30px] font-bold text-white mt-1">
                                            {item.title}
                                        </p>
                                        <button className="mt-6 flex items-center gap-2 text-[18px] font-bold text-white">
                                            Explore
                                            <ArrowRight size={18} />
                                        </button>
                                    </div>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>

            </div>
        </section>
    );
};

export default PropertyToolsSection;

// import React from "react";
// import { ArrowRight } from "lucide-react";

// const tools = [
//     {
//         title: "Owner Properties",
//         count: "37,536",
//         image:
//             "https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1200&auto=format&fit=crop",
//     },

//     {
//         title: "Projects",
//         count: "1000+",
//         image:
//             "https://images.unsplash.com/photo-1511818966892-d7d671e672a2?q=80&w=1200&auto=format&fit=crop",
//     },

//     {
//         title: "Budget Homes",
//         count: "819",
//         image:
//             "https://images.unsplash.com/photo-1484154218962-a197022b5858?q=80&w=1200&auto=format&fit=crop",
//     },
// ];

// const PropertyToolsSection = () => {
//     return (
//         <section className="bg-[#f5f5f3] pb-20 font-['Satoshi']">

//             <div className="w-full px-5 md:px-10 lg:px-16">

//                 <div className="mb-10">

//                     <h2 className="text-[30px] sm:text-[36px] lg:text-[40px] font- tracking-[-2px] text-[#081630]">
//                         We've got properties for everyone
//                     </h2>
//                 </div>

//                 <div className="grid gap-6 lg:grid-cols-3">

//                     {tools.map((item) => (
//                         <div
//                             key={item.title}
//                             className="
//                 group relative overflow-hidden
//                 rounded-[28px]
//               "
//                         >

//                             <img
//                                 src={item.image}
//                                 alt=""
//                                 className="
//                   h-[320px] w-full object-cover
//                   transition duration-700
//                   group-hover:scale-105
//                 "
//                             />

//                             <div
//                                 className="
//                   absolute inset-0
//                   bg-gradient-to-t
//                   from-black/80 via-black/20
//                   to-transparent
//                 "
//                             />

//                             <div className="absolute bottom-0 p-8">

//                                 <h3 className="text-[36px] sm:text-[44px] lg:text-[52px] font-black text-white leading-[1]">
//                                     {item.count}
//                                 </h3>

//                                 <p className="text-[22px] sm:text-[26px] lg:text-[30px] font-bold text-white mt-1">
//                                     {item.title}
//                                 </p>

//                                 <button
//                                     className="
//                     mt-6 flex items-center gap-2
//                     text-[18px] font-bold
//                     text-white
//                   "
//                                 >
//                                     Explore
//                                     <ArrowRight size={18} />
//                                 </button>
//                             </div>
//                         </div>
//                     ))}
//                 </div>
//             </div>
//         </section>
//     );
// };

// export default PropertyToolsSection;