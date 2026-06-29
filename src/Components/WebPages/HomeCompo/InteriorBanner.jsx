import React from "react";
import { ArrowRight } from "lucide-react";

const InteriorBanner = () => {
    return (
        <section className="bg-[#f5f5f3] pb-20 font-['Satoshi'] ">

            <div className="w-full px-5 md:px-10 lg:px-16">

                <div
                    className="
            relative overflow-hidden
            rounded-[36px]
            border border-black/5
            bg-[#dfe9f1]
            p-10 lg:p-16
          "
                >

                    <img
                        src="https://images.pexels.com/photos/1488267/pexels-photo-1488267.png"
                        alt=""
                        className="
              absolute inset-0
              h-full w-full
              object-cover opacity-20
            "
                    />

                    <div className="relative z-10 grid gap-12 lg:grid-cols-2">

                        <div>

                            <span
                                className="
                  inline-block rounded-full
                  bg-[#ffcc4d]
                  px-4 py-2 text-[13px]
                  font-bold text-black
                "
                            >
                                SAVE UPTO 40%
                            </span>

                            <h2
                                className="
                  mt-6
                  text-[36px] sm:text-[48px] lg:text-[45px]
                  
                  leading-[1.1]
                  tracking-[-2px]
                  text-[#111]
                "
                            >
                                Transform
                                <br />
                                Your Home
                            </h2>

                            <p
                                className="
                  mt-6 max-w-[480px]
                  text-[18px]
                  leading-[1.8]
                  text-[#555]
                "
                            >
                                Compare top interior designers,
                                get instant quotations and build
                                premium interiors for your dream home.
                            </p>
                        </div>

                        <div
                            className="
                rounded-[30px]
                bg-white/70
                p-8 backdrop-blur-xl
              "
                        >

                            <h3 className="text-[26px] sm:text-[30px] lg:text-[34px] font-black text-[#111]">
                                Why Choose Us?
                            </h3>

                            <div className="mt-8 space-y-5">

                                {[
                                    "300+ Verified Interior Brands",
                                    "Instant Cost Estimation",
                                    "Premium Design Consultation",
                                    "Luxury Furniture Partnerships",
                                ].map((item) => (
                                    <div
                                        key={item}
                                        className="
                      flex items-center gap-4
                      rounded-2xl bg-white
                      p-4 shadow-sm
                    "
                                    >

                                        <div className="h-3 w-3 rounded-full bg-black" />

                                        <span className="text-[17px] font-medium text-[#333]">
                                            {item}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-8 flex flex-col sm:flex-row gap-4">

                                <button
                                    className="
                    rounded-full bg-black
                    px-8 py-4 text-white
                    font-bold text-center
                  "
                                >
                                    Interior Designers
                                </button>

                                <button
                                    className="
                    flex items-center justify-center gap-2
                    rounded-full border
                    border-black px-8 py-4
                    font-bold text-black
                  "
                                >
                                    Get Quote
                                    <ArrowRight size={16} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default InteriorBanner;