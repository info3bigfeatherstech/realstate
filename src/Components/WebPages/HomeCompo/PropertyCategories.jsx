import React from "react";
import {
    ArrowRight,
    BedDouble,
    Bath,
    MapPin,
    Building2,
} from "lucide-react";

const categories = [
    {
        title: "Residential Apartment",
        properties: "6,200+ Properties",
        image:
            "https://images.unsplash.com/photo-1460317442991-0ec209397118?q=80&w=1200&auto=format&fit=crop",
        bg: "#efe5d5",
        location: "Noida, Gurgaon, Pune",
        price: "Starting ₹58L",
        size: "2 • 3 • 4 BHK",
        tag: "Most Popular",
    },

    {
        title: "Builder Floor",
        properties: "840+ Properties",
        image:
            "https://images.unsplash.com/photo-1494526585095-c41746248156?q=80&w=1200&auto=format&fit=crop",
        bg: "#e8eef3",
        location: "Delhi NCR",
        price: "Starting ₹95L",
        size: "3 • 4 BHK",
        tag: "Premium",
    },

    {
        title: "Residential Land",
        properties: "260+ Properties",
        image:
            "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1200&auto=format&fit=crop",
        bg: "#dcecdf",
        location: "Lucknow, Jaipur",
        price: "Starting ₹22L",
        size: "Plots Available",
        tag: "Investment",
    },

    {
        title: "Luxury Homes",
        properties: "1,200+ Properties",
        image:
            "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1200&auto=format&fit=crop",
        bg: "#f3e8de",
        location: "Goa, Bangalore",
        price: "Starting ₹2.4Cr",
        size: "4 • 5 • 6 BHK",
        tag: "Luxury",
    },

    {
        title: "Commercial Spaces",
        properties: "3,400+ Properties",
        image:
            "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200&auto=format&fit=crop",
        bg: "#ececf3",
        location: "Mumbai, Gurgaon",
        price: "Starting ₹1.2Cr",
        size: "Office • Retail",
        tag: "Commercial",
    },

    {
        title: "Farm Houses",
        properties: "540+ Properties",
        image:
            "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1200&auto=format&fit=crop",
        bg: "#edf1e4",
        location: "Alibaug, Chandigarh",
        price: "Starting ₹1.8Cr",
        size: "Luxury Farms",
        tag: "Weekend Homes",
    },
];

const PropertyCategories = () => {
    return (
        <section className="py-20 font-['Satoshi'] overflow-hidden">

            <div className="w-full px-5 md:px-10 lg:px-16">

                {/* TOP */}
                <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">

                    <div>

                        <p
                            className="
                text-[13px]
                font-bold
                uppercase
                tracking-[0.18em]
                text-[#8b95a7]
              "
                        >
                            Property Categories
                        </p>

                        <h2
                            className="
                mt-3
                text-[32px] sm:text-[38px] lg:text-[40px]
                font-
                leading-[1.1]
                tracking-[-2px]
                text-[#081630]
              "
                        >
                            Apartments, Homes
                            <br className="hidden sm:inline" /> and More
                        </h2>

                        <p
                            className="
                mt-5 max-w-[620px]
                text-[16px]
                leading-[1.8]
                text-[#7d8797]
              "
                        >
                            Explore verified residential apartments,
                            luxury homes, commercial spaces,
                            builder floors and investment-ready plots
                            across India's fastest-growing cities.
                        </p>
                    </div>

                    <button
                        className="
              hidden lg:flex
              items-center gap-3
              rounded-full
              bg-white
              px-6 py-4
              border border-black/5
              text-[14px]
              font-semibold
              text-[#081630]
              transition-all duration-300

              hover:bg-[#081630]
              hover:text-white
            "
                    >
                        View All Categories

                        <ArrowRight size={16} />
                    </button>
                </div>

                {/* ROW */}
                <div
                    className="
            flex gap-6 overflow-x-auto
            pb-5 hide-scrollbar
          "
                >

                    {categories.map((item, index) => (
                        <div
                            key={item.title}
                            className="
                group relative flex-shrink-0
                w-[300px] sm:w-[380px]
                overflow-hidden
                rounded-[24px] sm:rounded-[30px]
                border border-black/5
                shadow-[0_10px_40px_rgba(0,0,0,0.04)]
                transition-transform duration-300 hover:translate-y-[-6px]
              "
                            style={{
                                background: item.bg,
                            }}
                        >

                            {/* TOP CONTENT */}
                            <div className="p-5 sm:p-7">

                                {/* TAG */}
                                <div
                                    className="
                    mb-6 flex w-fit items-center
                    gap-2 rounded-full
                    bg-white/80
                    px-4 py-2
                    backdrop-blur-md
                  "
                                >
                                    <Building2 size={14} />

                                    <span
                                        className="
                      text-[12px]
                      font-bold
                      text-[#081630]
                    "
                                    >
                                        {item.tag}
                                    </span>
                                </div>

                                {/* TITLE */}
                                <h3
                                    className="
                    max-w-[260px]
                    text-[22px] sm:text-[28px]
                    font-black
                    leading-[1.1] sm:leading-[0.95]
                    tracking-[-1px] sm:tracking-[-2px]
                    text-[#3b4b70]
                  "
                                >
                                    {item.title}
                                </h3>

                                {/* PROPERTIES */}
                                <p
                                    className="
                    mt-4 text-[14px]
                    font-semibold
                    text-[#8391a8]
                  "
                                >
                                    {item.properties}
                                </p>

                                {/* LOCATION */}
                                <div
                                    className="
                    mt-6 flex items-center
                    gap-2
                  "
                                >
                                    <MapPin size={15} color="#6c7b91" />

                                    <span
                                        className="
                      text-[14px]
                      font-medium
                      text-[#6c7b91]
                    "
                                    >
                                        {item.location}
                                    </span>
                                </div>

                                {/* INFO ROW */}
                                <div
                                    className="
                    mt-7 flex items-center
                    justify-between
                    rounded-[18px]
                    bg-white/65
                    px-5 py-4
                    backdrop-blur-md
                  "
                                >

                                    {/* LEFT */}
                                    <div>

                                        <p
                                            className="
                        text-[12px]
                        font-medium
                        text-[#7d8797]
                      "
                                        >
                                            Starting Price
                                        </p>

                                        <h4
                                            className="
                        mt-1 text-[24px]
                        font-black
                        tracking-[-1px]
                        text-[#081630]
                      "
                                        >
                                            {item.price}
                                        </h4>
                                    </div>

                                    {/* RIGHT */}
                                    <div className="text-right">

                                        <p
                                            className="
                        text-[12px]
                        font-medium
                        text-[#7d8797]
                      "
                                        >
                                            Available
                                        </p>

                                        <h4
                                            className="
                        mt-1 text-[16px]
                        font-bold
                        text-[#081630]
                      "
                                        >
                                            {item.size}
                                        </h4>
                                    </div>
                                </div>
                            </div>

                            {/* IMAGE */}
                            <div className="relative overflow-hidden">

                                <img
                                    src={item.image}
                                    alt={item.title}
                                    className="
                    h-[200px] sm:h-[270px] w-full object-cover
                    transition-transform duration-700
                    group-hover:scale-[1.05]
                  "
                                />

                                {/* OVERLAY */}
                                <div
                                    className="
                    absolute inset-0
                    bg-gradient-to-t
                    from-black/40
                    via-transparent
                    to-transparent
                  "
                                />

                                {/* BOTTOM ACTION */}
                                <div
                                    className="
                    absolute bottom-5 left-5 right-5
                    flex items-center justify-between
                  "
                                >

                                    <div
                                        className="
                      flex items-center gap-4
                    "
                                    >

                                        <div
                                            className="
                        flex items-center gap-2
                        rounded-full
                        bg-white/90
                        px-3 py-2
                        backdrop-blur-md
                      "
                                        >
                                            <BedDouble size={14} />

                                            <span
                                                className="
                          text-[12px]
                          font-semibold
                          text-black
                        "
                                            >
                                                Premium Homes
                                            </span>
                                        </div>

                                        <div
                                            className="
                        flex items-center gap-2
                        rounded-full
                        bg-white/90
                        px-3 py-2
                        backdrop-blur-md
                      "
                                        >
                                            <Bath size={14} />

                                            <span
                                                className="
                          text-[12px]
                          font-semibold
                          text-black
                        "
                                            >
                                                Verified
                                            </span>
                                        </div>
                                    </div>

                                    {/* BUTTON */}
                                    <button
                                        className="
                      flex h-12 w-12 items-center
                      justify-center rounded-full
                      bg-white text-black
                      transition-all duration-300

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

export default PropertyCategories;