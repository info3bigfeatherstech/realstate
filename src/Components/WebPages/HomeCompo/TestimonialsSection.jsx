import React from "react";

const testimonials = [
    {
        name: "Nathan Harper",
        role: "Software Developer",
        image: "https://randomuser.me/api/portraits/men/32.jpg",
        text:
            "Buying my vacation home was surprisingly easy. The team guided me through every step and made the entire process stress free.",
    },

    {
        name: "Logan Price",
        role: "Environmental Consultant",
        image: "https://randomuser.me/api/portraits/men/41.jpg",
        text:
            "I finally found a property investment platform that actually feels trustworthy and premium. Everything was transparent.",
    },

    {
        name: "Aria Sullivan",
        role: "Digital Nomad",
        image: "https://randomuser.me/api/portraits/women/44.jpg",
        text:
            "The rental process felt effortless. I explored verified listings and found the perfect apartment within days.",
    },

    {
        name: "Grace Powell",
        role: "Financial Consultant",
        image: "https://randomuser.me/api/portraits/women/68.jpg",
        text:
            "What impressed me most was the clean experience and genuine property assistance. It felt modern and reliable.",
    },

    {
        name: "Ethan Brooks",
        role: "Architect",
        image: "https://randomuser.me/api/portraits/men/76.jpg",
        text:
            "The luxury home options were incredible. I loved how premium yet simple the browsing experience felt.",
    },
];

const TestimonialsSection = () => {
    return (
        <>
            <style>{`
        @keyframes marqueeLeft {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        @keyframes marqueeRight {
          0% {
            transform: translateX(-50%);
          }
          100% {
            transform: translateX(0%);
          }
        }

        .marquee-left {
          animation: marqueeLeft 35s linear infinite;
        }

        .marquee-right {
          animation: marqueeRight 35s linear infinite;
        }

        .marquee-left:hover,
        .marquee-right:hover {
          animation-play-state: paused;
        }
      `}</style>

            <section className="py-24 overflow-hidden font-['Satoshi']">

                <div className="w-full px-5 md:px-10 lg:px-16">

                    <div className="grid grid-cols-1 gap-14 lg:grid-cols-12">

                        {/* LEFT */}
                        <div className="lg:col-span-4">

                            <div
                                className="
                  inline-flex items-center
                  rounded-full
                  border border-black/10
                  bg-white
                  px-5 py-2
                "
                            >
                                <span
                                    className="
                    text-[13px]
                    font-semibold
                    text-[#666]
                  "
                                >
                                    What Our Clients Say
                                </span>
                            </div>

                            <h2
                                className="
                  mt-6
                  text-[32px] sm:text-[40px] lg:text-[35px]
                  
                  leading-[1.1]
                  tracking-[-2px]
                  text-[#111]
                "
                            >
                                Trusted By Many,
                                <br />
                                Loved By All
                            </h2>

                            <p
                                className="
                  mt-8 max-w-[420px]
                  text-[17px]
                  leading-[1.9]
                  text-[#666]
                "
                            >
                                Our clients’ success stories reflect
                                our commitment to excellence.
                                From luxury apartments to investment-ready
                                properties, we help people find homes
                                they truly love.
                            </p>
                        </div>

                        {/* RIGHT */}
                        <div className="lg:col-span-8">

                            <div className="space-y-5 overflow-hidden">

                                {/* ROW 1 */}
                                <div className="relative overflow-hidden">

                                    {/* LEFT FADE */}
                                    <div
                                        className="
                      absolute left-0 top-0 z-10
                      h-full w-32
                      bg-gradient-to-r
                      from-[#f5f5f3]
                      to-transparent
                    "
                                    />

                                    {/* RIGHT FADE */}
                                    <div
                                        className="
                      absolute right-0 top-0 z-10
                      h-full w-32
                      bg-gradient-to-l
                      from-[#f5f5f3]
                      to-transparent
                    "
                                    />

                                    <div className="flex w-max gap-5 marquee-left">

                                        {[...testimonials, ...testimonials].map(
                                            (item, index) => (
                                                <div
                                                    key={index}
                                                    className="
                            w-[420px]
                            rounded-[30px]
                            border border-black/10
                            bg-white
                            p-7
                            shadow-[0_10px_40px_rgba(0,0,0,0.03)]
                            transition-transform duration-300
                            hover:translate-y-[-4px]
                          "
                                                >

                                                    {/* STARS */}
                                                    <div className="flex items-center gap-1">

                                                        {[...Array(5)].map((_, i) => (
                                                            <span
                                                                key={i}
                                                                className="
                                  text-[15px]
                                  text-black
                                "
                                                            >
                                                                ★
                                                            </span>
                                                        ))}
                                                    </div>

                                                    {/* TEXT */}
                                                    <p
                                                        className="
                              mt-6
                              text-[16px]
                              leading-[1.9]
                              text-[#555]
                            "
                                                    >
                                                        {item.text}
                                                    </p>

                                                    {/* USER */}
                                                    <div
                                                        className="
                              mt-8
                              flex items-center gap-4
                            "
                                                    >

                                                        <img
                                                            src={item.image}
                                                            alt=""
                                                            className="
                                h-14 w-14
                                rounded-full
                                object-cover
                              "
                                                        />

                                                        <div>

                                                            <h4
                                                                className="
                                  text-[18px]
                                  font-bold
                                  text-[#111]
                                "
                                                            >
                                                                {item.name}
                                                            </h4>

                                                            <p
                                                                className="
                                  mt-1
                                  text-[14px]
                                  text-[#888]
                                "
                                                            >
                                                                {item.role}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        )}
                                    </div>
                                </div>

                                {/* ROW 2 */}
                                <div className="relative overflow-hidden">

                                    {/* LEFT FADE */}
                                    <div
                                        className="
                      absolute left-0 top-0 z-10
                      h-full w-32
                      bg-gradient-to-r
                      from-[#f5f5f3]
                      to-transparent
                    "
                                    />

                                    {/* RIGHT FADE */}
                                    <div
                                        className="
                      absolute right-0 top-0 z-10
                      h-full w-32
                      bg-gradient-to-l
                      from-[#f5f5f3]
                      to-transparent
                    "
                                    />

                                    <div className="flex w-max gap-5 marquee-right">

                                        {[...testimonials, ...testimonials].map(
                                            (item, index) => (
                                                <div
                                                    key={index}
                                                    className="
                            w-[420px]
                            rounded-[30px]
                            border border-black/10
                            bg-white
                            p-7
                            shadow-[0_10px_40px_rgba(0,0,0,0.03)]
                            transition-transform duration-300
                            hover:translate-y-[-4px]
                          "
                                                >

                                                    {/* STARS */}
                                                    <div className="flex items-center gap-1">

                                                        {[...Array(5)].map((_, i) => (
                                                            <span
                                                                key={i}
                                                                className="
                                  text-[15px]
                                  text-black
                                "
                                                            >
                                                                ★
                                                            </span>
                                                        ))}
                                                    </div>

                                                    {/* TEXT */}
                                                    <p
                                                        className="
                              mt-6
                              text-[16px]
                              leading-[1.9]
                              text-[#555]
                            "
                                                    >
                                                        {item.text}
                                                    </p>

                                                    {/* USER */}
                                                    <div
                                                        className="
                              mt-8
                              flex items-center gap-4
                            "
                                                    >

                                                        <img
                                                            src={item.image}
                                                            alt=""
                                                            className="
                                h-14 w-14
                                rounded-full
                                object-cover
                              "
                                                        />

                                                        <div>

                                                            <h4
                                                                className="
                                  text-[18px]
                                  font-bold
                                  text-[#111]
                                "
                                                            >
                                                                {item.name}
                                                            </h4>

                                                            <p
                                                                className="
                                  mt-1
                                  text-[14px]
                                  text-[#888]
                                "
                                                            >
                                                                {item.role}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default TestimonialsSection;