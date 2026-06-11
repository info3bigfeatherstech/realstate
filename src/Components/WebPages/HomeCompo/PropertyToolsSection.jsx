import React from "react";
import { ArrowRight } from "lucide-react";

const tools = [
    {
        title: "Owner Properties",
        count: "37,536",
        image:
            "https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1200&auto=format&fit=crop",
    },

    {
        title: "Projects",
        count: "1000+",
        image:
            "https://images.unsplash.com/photo-1511818966892-d7d671e672a2?q=80&w=1200&auto=format&fit=crop",
    },

    {
        title: "Budget Homes",
        count: "819",
        image:
            "https://images.unsplash.com/photo-1484154218962-a197022b5858?q=80&w=1200&auto=format&fit=crop",
    },
];

const PropertyToolsSection = () => {
    return (
        <section className="bg-[#f5f5f3] pb-20 font-['Satoshi']">

            <div className="w-full px-5 md:px-10 lg:px-16">

                <div className="mb-10">

                    <h2 className="text-[30px] sm:text-[36px] lg:text-[40px] font- tracking-[-2px] text-[#081630]">
                        We've got properties for everyone
                    </h2>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">

                    {tools.map((item) => (
                        <div
                            key={item.title}
                            className="
                group relative overflow-hidden
                rounded-[28px]
              "
                        >

                            <img
                                src={item.image}
                                alt=""
                                className="
                  h-[320px] w-full object-cover
                  transition duration-700
                  group-hover:scale-105
                "
                            />

                            <div
                                className="
                  absolute inset-0
                  bg-gradient-to-t
                  from-black/80 via-black/20
                  to-transparent
                "
                            />

                            <div className="absolute bottom-0 p-8">

                                <h3 className="text-[36px] sm:text-[44px] lg:text-[52px] font-black text-white leading-[1]">
                                    {item.count}
                                </h3>

                                <p className="text-[22px] sm:text-[26px] lg:text-[30px] font-bold text-white mt-1">
                                    {item.title}
                                </p>

                                <button
                                    className="
                    mt-6 flex items-center gap-2
                    text-[18px] font-bold
                    text-white
                  "
                                >
                                    Explore
                                    <ArrowRight size={18} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default PropertyToolsSection;