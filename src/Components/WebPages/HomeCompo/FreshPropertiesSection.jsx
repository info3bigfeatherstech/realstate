import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { ArrowRight, BedDouble, MapPin } from "lucide-react";

import "swiper/css";
import "swiper/css/navigation";

const properties = [
    {
        title: "3 BHK Luxury Flat",
        price: "₹1.57 Cr",
        sqft: "1600 sqft",
        location: "Whitefield, Bangalore",
        status: "Ready To Move",
        image:
            "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=1200&auto=format&fit=crop",
    },

    {
        title: "Modern 2 BHK",
        price: "₹95 Lac",
        sqft: "1180 sqft",
        location: "Indiranagar, Bangalore",
        status: "New Launch",
        image:
            "https://images.unsplash.com/photo-1494526585095-c41746248156?q=80&w=1200&auto=format&fit=crop",
    },

    {
        title: "Premium Villa",
        price: "₹3.2 Cr",
        sqft: "4200 sqft",
        location: "Sarjapur Road",
        status: "Ready To Move",
        image:
            "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1200&auto=format&fit=crop",
    },

    {
        title: "Builder Floor",
        price: "₹1.2 Cr",
        sqft: "1450 sqft",
        location: "Electronic City",
        status: "Under Construction",
        image:
            "https://images.unsplash.com/photo-1460317442991-0ec209397118?q=80&w=1200&auto=format&fit=crop",
    },
];

const FreshPropertiesSection = () => {
    return (
        <section className="py-20 font-['Satoshi']">

            <div className="w-full px-5 md:px-10 lg:px-16">

                <div className="mb-10 flex items-center justify-between">

                    <div>

                        <h4 className="text-[20px] sm:text-[36px] lg:text-[40px] font- uppercase tracking-[-2px] text-[#081630]">
                            Fresh Properties
                        </h4>

                        <p className="mt-2 text-[#7d8797] text-[16px]">
                            Newly added verified listings
                        </p>
                    </div>

                    <button className="flex items-center gap-2 text-[15px] font-bold text-black">
                        View All
                        <ArrowRight size={16} />
                    </button>
                </div>

                <Swiper
                    modules={[Navigation]}
                    navigation
                    spaceBetween={20}
                    slidesPerView={1}
                    breakpoints={{
                        480: { slidesPerView: 1.5 },
                        640: { slidesPerView: 2 },
                        900: { slidesPerView: 3 },
                        1200: { slidesPerView: 4 },
                    }}
                >
                    {properties.map((item, index) => (
                        <SwiperSlide key={index}>

                            <div className="overflow-hidden rounded-[24px] border border-black/5 bg-white">

                                <div className="relative overflow-hidden">

                                    <img
                                        src={item.image}
                                        alt=""
                                        className="h-[260px] w-full object-cover transition duration-700 hover:scale-105"
                                    />

                                    <div className="absolute left-4 top-4 rounded-full bg-black/70 px-3 py-1 text-[12px] text-white backdrop-blur-md">
                                        Verified
                                    </div>
                                </div>

                                <div className="p-5">

                                    <h3 className="text-[22px] font-bold text-[#111]">
                                        {item.title}
                                    </h3>

                                    <div className="mt-3 flex items-center gap-3">

                                        <span className="text-[24px] font-black text-black">
                                            {item.price}
                                        </span>

                                        <span className="text-[#999]">|</span>

                                        <span className="text-[16px] text-[#666]">
                                            {item.sqft}
                                        </span>
                                    </div>

                                    <div className="mt-4 flex items-center gap-2 text-[#777]">

                                        <MapPin size={15} />

                                        <span>{item.location}</span>
                                    </div>

                                    <div className="mt-3 flex items-center gap-2 text-[#777]">

                                        <BedDouble size={15} />

                                        <span>{item.status}</span>
                                    </div>
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </section>
    );
};

export default FreshPropertiesSection;