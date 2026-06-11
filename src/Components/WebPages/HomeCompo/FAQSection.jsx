import React, { useState } from "react";
import { Plus, Minus } from "lucide-react";

const faqs = [
    {
        question: "What is the process for buying a property?",
        answer:
            "Browse verified listings, connect with agents, schedule visits and complete documentation securely through our platform.",
    },

    {
        question: "How do I determine how much I can afford?",
        answer:
            "You can use our home loan and affordability tools to estimate budgets based on your income and financial profile.",
    },

    {
        question: "What documents are required for renting a property?",
        answer:
            "Usually Aadhaar Card, PAN Card, address proof, employment proof and security deposit details are required.",
    },

    {
        question: "Can I terminate a lease agreement early?",
        answer:
            "Yes, depending on your rental agreement terms and notice period clauses agreed upon with the owner.",
    },

    {
        question: "What are the risks of investing in real estate?",
        answer:
            "Risks include market fluctuations, delayed possession and legal verification issues. We help minimize these with verified listings.",
    },
];

const FAQSection = () => {
    const [open, setOpen] = useState(0);

    return (
        <section className="py-24 font-['Satoshi']">
            <div className="w-full px-5 md:px-10 lg:px-16">
                <div className="grid grid-cols-1 gap-14 lg:grid-cols-12">

                    {/* LEFT */}
                    <div className="lg:col-span-4">
                        <div className="inline-flex items-center rounded-full border border-black/10 bg-white px-5 py-2">
                            <span className="text-[13px] font-semibold text-[#666]">
                                Help Center
                            </span>
                        </div>

                        <h2 className="mt-6 text-[32px] sm:text-[40px] lg:text-[40px] leading-[1.1] tracking-[-2px] text-[#111]">
                            FREQUENTLY
                            <br />
                            ASKED QUESTIONS
                        </h2>
                    </div>

                    {/* RIGHT */}
                    <div className="lg:col-span-8">
                        <div className="border-t border-black/10">
                            {faqs.map((faq, index) => {
                                const active = open === index;

                                return (
                                    <div
                                        key={index}
                                        className="border-b border-black/10"
                                    >

                                        {/* QUESTION */}
                                        <button
                                            onClick={() =>
                                                setOpen(active ? null : index)
                                            }
                                            className="flex w-full items-center justify-between gap-5 py-8 text-left hover:opacity-70 transition-opacity"
                                        >

                                            <h3 className="text-[18px] sm:text-[22px] md:text-[24px] font-bold tracking-[-1px] text-[#111]">
                                                {faq.question}
                                            </h3>

                                            <div className="flex h-11 w-11 items-center justify-center rounded-full border border-black/10 bg-white flex-shrink-0 transition-transform">
                                                {active ? (
                                                    <Minus size={18} />
                                                ) : (
                                                    <Plus size={18} />
                                                )}
                                            </div>
                                        </button>

                                        {/* ANSWER */}
                                        <div
                                            className={`overflow-hidden transition-all duration-300 ease-in-out ${active ? "max-h-96" : "max-h-0"
                                                }`}
                                        >
                                            <p className="max-w-[760px] pb-8 pr-10 text-[17px] leading-[1.9] text-[#666]">
                                                {faq.answer}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FAQSection;