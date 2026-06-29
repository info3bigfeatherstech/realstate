import React from "react";
import {
    Building2,
    Landmark,
    House,
    Hotel,
    Warehouse,
    ArrowUpRight,
} from "lucide-react";

const services = [
    {
        title: "Buying a commercial property",
        desc: "Shops, offices, land, factories and warehouses",
        icon: <Building2 size={28} />,
    },

    {
        title: "Leasing a commercial property",
        desc: "Premium office spaces and retail shops",
        icon: <Landmark size={28} />,
    },

    {
        title: "Renting a home",
        desc: "Apartments, homes and builder floors",
        icon: <House size={28} />,
    },

    {
        title: "PG & Co-living",
        desc: "Organised owner and broker listed PGs",
        icon: <Hotel size={28} />,
    },

    {
        title: "Buy plots / land",
        desc: "Residential plots, farm lands and more",
        icon: <Warehouse size={28} />,
    },

    {
        title: "Post Property FREE",
        desc: "Sell or rent faster with premium visibility",
        icon: <ArrowUpRight size={28} />,
    },
];

const ExploreServices = () => {
    return (
        <section className="py-24 font-['Satoshi']">

            <div className="w-full px-5 md:px-10 lg:px-16">

                <div
                    className="
            relative overflow-hidden
            bg-[#f3efe7]
            rounded-[32px]
            px-6 py-14
            lg:px-12
          "
                >

                    {/* BACKGROUND IMAGE */}
                    <img
                        src="https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1400&auto=format&fit=crop"
                        alt=""
                        className="
              absolute right-0 top-0
              h-full w-full lg:w-[42%]
              object-cover
              opacity-10 lg:opacity-20
            "
                    />

                    {/* TOP */}
                    <div className="relative z-10">

                        <span
                            className="
                text-[14px]
                font-bold
                 tracking-[0.2em]
                text-[#7d8797]
              "
                        >
                            Vistahaven Services
                        </span>

                        <div
                            className="
                mt-5 flex flex-col
                gap-6 lg:flex-row
                lg:items-end
                lg:justify-between
              "
                        >

                            <div>

                                <h2
                                    className="
                    text-[32px] sm:text-[38px] lg:text-[40px]
                    font-
                    leading-[1.1] 
                    tracking-[-2px]
                    text-[#081630]
                  "
                                >
                                    Explore
                                    <br className="sm:hidden" /> Our Services
                                </h2>

                                <p
                                    className="
                    mt-6 max-w-[620px]
                    text-[18px]
                    leading-[1.9]
                    text-[#667085]
                  "
                                >
                                    From buying premium properties
                                    to leasing office spaces and posting
                                    listings, everything you need is
                                    available in one modern marketplace.
                                </p>
                            </div>
                        </div>

                        {/* SERVICES GRID */}
                        <div
                            className="
                mt-14 grid gap-5
                md:grid-cols-2 lg:grid-cols-3
              "
                        >

                            {services.map((item, index) => (
                                <div
                                    key={index}
                                    className="
                    group relative overflow-hidden
                    rounded-[28px]
                    border border-black/5
                    bg-white/80
                    p-4 backdrop-blur-xl
                    transition-all duration-300

                    hover:-translate-y-1
                    hover:shadow-[0_20px_60px_rgba(0,0,0,0.08)]
                  "
                                >

                                    {/* ICON */}
                                    <div
                                        className="
                      flex h-16 w-16 items-center
                      justify-center rounded-2xl
                      bg-[#081630]
                      text-white
                    "
                                    >
                                        {item.icon}
                                    </div>

                                    {/* CONTENT */}
                                    <div className="mt-7">

                                        <h3
                                            className="
                        text-[22px]
                        font-black
                        leading-[1.15]
                        tracking-[-1px]
                        text-[#111]
                      "
                                        >
                                            {item.title}
                                        </h3>

                                        <p
                                            className="
                        mt-4
                        text-[16px]
                        leading-[1.8]
                        text-[#777]
                      "
                                        >
                                            {item.desc}
                                        </p>
                                    </div>

                                    {/* HOVER BUTTON */}
                                    <button
                                        className="
                      mt-8 flex items-center
                      gap-2 text-[15px]
                      font-bold text-black
                    "
                                    >
                                        Explore Service

                                        <span
                                            className="
                        transition-transform duration-300
                        group-hover:translate-x-1
                        group-hover:-translate-y-1
                      "
                                        >
                                            ↗
                                        </span>
                                    </button>

                                    {/* GLOW */}
                                    <div
                                        className="
                      absolute right-[-40px]
                      top-[-40px]
                      h-[120px] w-[120px]
                      rounded-full
                      bg-[#081630]/5
                      blur-3xl
                    "
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ExploreServices;