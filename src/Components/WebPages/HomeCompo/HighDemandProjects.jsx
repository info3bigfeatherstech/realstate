import React from "react";
import {
    ArrowRight,
    Heart,
    ShieldCheck,
} from "lucide-react";

const projects = [
    {
        name: "Garur Golf Island",
        location:
            "4 BHK Apartment in Sector 19B Dwarka, Delhi",
        price: "₹ 9.93 Cr",
        image:
            "https://images.unsplash.com/photo-1511818966892-d7d671e672a2?q=80&w=1400&auto=format&fit=crop",
        possession: "Possession from Mar 2028",
    },

    {
        name: "Goyal Builder Floor",
        location:
            "3, 4 BHK Apartment in Sector 23 Dwarka, Delhi",
        price: "₹ 1.05 - 1.35 Cr",
        image:
            "https://images.unsplash.com/photo-1494526585095-c41746248156?q=80&w=1400&auto=format&fit=crop",
        possession: "Ready To Move",
    },

    {
        name: "Eldeco Camelot",
        location:
            "3, 4 BHK Apartment in Sector 17 Dwarka, Delhi",
        price: "₹ 5.98 - 9.54 Cr",
        image:
            "https://images.unsplash.com/photo-1460317442991-0ec209397118?q=80&w=1400&auto=format&fit=crop",
        possession: "Possession from Nov 2030",
    },
];

const HighDemandProjects = () => {
    return (

        <section className="py-8 font-['Satoshi']">

            <div className="w-full px-5 md:px-10 lg:px-16">

                {/* TOP */}
                <div className="mb-12 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">

                    <div>

                        <p
                            className="
            text-[13px]
            font-bold uppercase
            tracking-[0.18em]
            text-[#8b95a7]
          "
                        >
                            Trending Projects
                        </p>

                        <h2
                            className="
            mt-3
            text-[2px] sm:text-[36px] lg:text-[35px]
            font-
            tracking-[-2px] uppercase
            text-[#081630]
          "
                        >
                            Projects in High Demand
                        </h2>

                        <p
                            className="
            mt-4 max-w-[620px]
            text-[16px]
            leading-[1.8]
            text-[#7d8797]
          "
                        >
                            Discover the most explored residential projects,
                            premium apartments and luxury developments
                            across top investment destinations.
                        </p>
                    </div>

                    <button
                        className="
          hidden lg:flex
          items-center gap-3
          rounded-full
          border border-black/5
          bg-white
          px-6 py-4
          text-[14px]
          font-semibold
          text-[#081630]
          transition-all duration-300

          hover:bg-[#081630]
          hover:text-white
        "
                    >
                        View All Projects

                        <ArrowRight size={16} />
                    </button>
                </div>

                {/* GRID */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">

                    {[
                        {
                            name: "Garur Golf Island",
                            location:
                                "4 BHK Apartment in Sector 19B Dwarka, Delhi",
                            price: "₹ 9.93 Cr",
                            img: "https://images.unsplash.com/photo-1511818966892-d7d671e672a2?q=80&w=1400&auto=format&fit=crop",
                            possession: "Possession from Mar 2028",
                        },

                        {
                            name: "Goyal Builder Floor",
                            location:
                                "3, 4 BHK Apartment in Sector 23 Dwarka, Delhi",
                            price: "₹ 1.05 - 1.35 Cr",
                            img: "https://images.unsplash.com/photo-1494526585095-c41746248156?q=80&w=1400&auto=format&fit=crop",
                            possession: "Ready To Move",
                        },

                        {
                            name: "Eldeco Camelot",
                            location:
                                "3, 4 BHK Apartment in Sector 17 Dwarka, Delhi",
                            price: "₹ 5.98 - 9.54 Cr",
                            img: "https://images.unsplash.com/photo-1460317442991-0ec209397118?q=80&w=1400&auto=format&fit=crop",
                            possession: "Possession from Nov 2030",
                        },
                    ].map((item, index) => (
                        <div
                            key={item.name}
                            className="
            group overflow-hidden
            rounded-[30px]
            bg-white
            border border-black/5
            shadow-[0_10px_40px_rgba(0,0,0,0.04)]
            cursor-pointer
            transition-transform duration-300
            hover:translate-y-[-5px]
          "
                        >

                            {/* IMAGE */}
                            <div className="relative overflow-hidden">

                                <img
                                    src={item.img}
                                    alt=""
                                    className="
                h-[290px] w-full object-cover
                transition-transform duration-700
                group-hover:scale-[1.05]
              "
                                />

                                {/* OVERLAY */}
                                <div
                                    className="
                absolute inset-0
                bg-gradient-to-t
                from-black/80
                via-black/10
                to-transparent
              "
                                />

                                {/* TOP */}
                                <div
                                    className="
                absolute left-0 top-0
                flex w-full items-center
                justify-between p-5
              "
                                >

                                    <div
                                        className="
                  flex items-center gap-2
                  rounded-full
                  bg-white/90
                  px-3 py-1.5
                  backdrop-blur-md
                "
                                    >

                                        <ShieldCheck size={14} />

                                        <span className="text-[12px] font-bold">
                                            RERA Approved
                                        </span>
                                    </div>

                                    <button
                                        className="
                  flex h-10 w-10 items-center
                  justify-center rounded-full
                  bg-black/35 text-white
                  backdrop-blur-md
                "
                                    >
                                        <Heart size={17} />
                                    </button>
                                </div>

                                {/* BOTTOM */}
                                <div className="absolute bottom-5 left-5">

                                    <p
                                        className="
                  text-[13px]
                  font-semibold
                  text-white
                "
                                    >
                                        {item.possession}
                                    </p>
                                </div>
                            </div>

                            {/* CONTENT */}
                            <div className="p-6">

                                {/* NAME */}
                                <h3
                                    className="
                text-[24px] sm:text-[30px]
                font-black
                tracking-[-1px]
                text-[#081630]
              "
                                >
                                    {item.name}
                                </h3>

                                {/* LOCATION */}
                                <p
                                    className="
                mt-3 text-[15px]
                leading-[1.7]
                text-[#7d8797]
              "
                                >
                                    {item.location}
                                </p>

                                {/* FEATURES */}
                                <div className="mt-5 flex flex-wrap gap-2">

                                    {[
                                        "Luxury",
                                        "Clubhouse",
                                        "Prime Location",
                                    ].map((tag) => (
                                        <div
                                            key={tag}
                                            className="
                    rounded-full
                    bg-[#f5f5f3]
                    px-3 py-2
                  "
                                        >
                                            <span className="text-[12px] font-semibold text-[#666]">
                                                {tag}
                                            </span>
                                        </div>
                                    ))}
                                </div>

                                {/* PRICE + BUTTON */}
                                <div
                                    className="
                mt-7 flex items-center
                justify-between
              "
                                >

                                    <div>

                                        <p className="text-[13px] text-[#8b95a7]">
                                            Starting Price
                                        </p>

                                        <h4
                                            className="
                    mt-1 text-[24px] sm:text-[30px] lg:text-[34px]
                    font-black
                    tracking-[-1px]
                    text-[#081630]
                  "
                                        >
                                            {item.price}
                                        </h4>
                                    </div>

                                    <button
                                        className="
                  flex h-12 w-12 items-center
                  justify-center rounded-full
                  bg-[#081630]
                  text-white
                  transition-transform duration-300

                  group-hover:rotate-45
                "
                                    >
                                        <ArrowRight size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default HighDemandProjects;