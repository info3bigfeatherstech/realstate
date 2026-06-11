import React from "react";
import { ArrowRight } from "lucide-react";

const cities = [
    {
        name: "Delhi / NCR",
        properties: "174,000+ Properties",
        image:
            "https://images.unsplash.com/photo-1587474260584-136574528ed5?q=80&w=1200&auto=format&fit=crop",
    },

    {
        name: "Bangalore",
        properties: "55,000+ Properties",
        image:
            "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?q=80&w=1200&auto=format&fit=crop",
    },

    {
        name: "Pune",
        properties: "39,000+ Properties",
        image:
            "https://images.unsplash.com/photo-1479839672679-a46483c0e7c8?q=80&w=1200&auto=format&fit=crop",
    },

    {
        name: "Chennai",
        properties: "40,000+ Properties",
        image:
            "https://images.unsplash.com/photo-1566552881560-0be862a7c445?q=80&w=1200&auto=format&fit=crop",
    },

    {
        name: "Mumbai",
        properties: "44,000+ Properties",
        image:
            "https://images.unsplash.com/photo-1529253355930-ddbe423a2ac7?q=80&w=1200&auto=format&fit=crop",
    },

    {
        name: "Hyderabad",
        properties: "31,000+ Properties",
        image:
            "https://images.unsplash.com/photo-1511818966892-d7d671e672a2?q=80&w=1200&auto=format&fit=crop",
    },

    {
        name: "Kolkata",
        properties: "34,000+ Properties",
        image:
            "https://images.unsplash.com/photo-1558431382-27e303142255?q=80&w=1200&auto=format&fit=crop",
    },

    {
        name: "Ahmedabad",
        properties: "22,000+ Properties",
        image:
            "https://images.unsplash.com/photo-1622308644420-b20142dc993c?q=80&w=1200&auto=format&fit=crop",
    },
];

const ExploreCities = () => {
    return (
        <section className="py-20 font-['Satoshi']">


            <div className="w-full px-5 md:px-10 lg:px-16">

                {/* TOP */}
                <div className="mb-14 flex items-center justify-between">

                    <div>

                        <p
                            className="
                text-[13px]
                font-bold
                uppercase
                tracking-[1px]
                text-[#8b95a7]
              "
                        >
                            Top Cities
                        </p>

                        <h2
                            className="
                mt-3
                text-[28px] sm:text-[36px] lg:text-[40px]
                font- uppercase
                tracking-[-2px]
                text-[#081630]
              "
                        >
                            Explore Real Estate in Popular Indian Cities
                        </h2>
                    </div>

                    {/* RIGHT BUTTON */}
                    <button
                        className="
              hidden lg:flex
              h-14 w-14 mr-10
              items-center justify-center
              rounded-full
              border border-[#e4e7ec]
              bg-white
              text-[#081630]
              transition-all duration-300

              hover:bg-[#081630]
              hover:text-white
            "
                    >
                        <ArrowRight size={20} />
                    </button>
                </div>

                {/* GRID */}
                <div className="grid grid-cols-1 gap-x-8 lg:gap-x-16 gap-y-7 sm:grid-cols-2 xl:grid-cols-4">

                    {cities.map((city, index) => (
                        <div
                            key={city.name}
                            className="
                group flex items-center gap-4
                cursor-pointer transition-transform duration-300
                hover:translate-x-1
              "
                        >

                            {/* IMAGE */}
                            <div
                                className="
                  h-[98px] w-[98px]
                  overflow-hidden rounded-[14px]
                  flex-shrink-0
                "
                            >

                                <img
                                    src={city.image}
                                    alt={city.name}
                                    className="
                    h-full w-full object-cover
                    transition-transform duration-500
                    group-hover:scale-[1.08]
                  "
                                />
                            </div>

                            {/* CONTENT */}
                            <div>

                                <h3
                                    className="
                    text-[20px] sm:text-[24px] lg:text-[28px]
                    font-bold
                    tracking-[-1px]
                    text-[#081630]
                  "
                                >
                                    {city.name}
                                </h3>

                                <p
                                    className="
                    mt-1
                    text-[15px]
                    font-semibold
                    text-[#8b95a7]
                  "
                                >
                                    {city.properties}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ExploreCities;