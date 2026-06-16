// src/Components/UserSide/ContactUs/ContactUs.jsx
import React, { useState } from "react";
import { Phone, Mail, MapPin, Send } from "lucide-react";

export default function ContactUs() {
    const [formData, setFormData] = useState({ name: "", email: "", message: "" });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Form Submitted:", formData);
    };

    return (
        <section className="bg-white py-20 font-['satoshi'] text-[#111]">
            <div className="w-full px-5 md:px-10 lg:px-16 max-w-[1440px] mx-auto">

                {/* ─── HEADER SECTION ─────────────────────────────────────────── */}
                <div className="mb-14 max-w-2xl">
                    <div className="mb-5 inline-flex items-center rounded-full border border-[#E0E0E0] px-4 py-[6px]">
                        <span className="text-[14px] font-medium text-[#555] tracking-wide uppercase">
                            Get In Touch
                        </span>
                    </div>
                    <h1 className="text-[clamp(28px,4vw,42px)] leading-[1.05] tracking-[-1.5px] text-[#111] sm:text-[36px] lg:text-[42px]">
                        Let’s Connect. We’re Here To
                        <br />
                        Help You.
                    </h1>
                    <p className="mt-4 text-[16px] text-[#666] leading-relaxed">
                        Have questions about properties, pricing, or utility services? Drop us a message or reach out through our official channels.
                    </p>
                </div>

                {/* ─── GRID CONTAINER ──────────────────────────────────────────── */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 xl:gap-16 items-start">

                    {/* LEFT: CONTACT FORM (5 Columns) */}
                    <div className="lg:col-span-5 bg-[#F9F9F9] border border-[#E8E8E8] rounded-[32px] p-6 md:p-10">
                        <h2 className="text-[24px] font-bold tracking-tight text-[#111] mb-6">Send a Message</h2>

                        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                            <div>
                                <label className="block text-[13px] font-bold uppercase tracking-wider text-[#666] mb-2">
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    placeholder="John Doe"
                                    className="w-full rounded-2xl bg-white border border-[#E0E0E0] px-5 py-4 text-[15px] text-[#111] placeholder-black/30 outline-none transition-all duration-300 focus:border-[#111]"
                                />
                            </div>

                            <div>
                                <label className="block text-[13px] font-bold uppercase tracking-wider text-[#666] mb-2">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    placeholder="john@example.com"
                                    className="w-full rounded-2xl bg-white border border-[#E0E0E0] px-5 py-4 text-[15px] text-[#111] placeholder-black/30 outline-none transition-all duration-300 focus:border-[#111]"
                                />
                            </div>

                            <div>
                                <label className="block text-[13px] font-bold uppercase tracking-wider text-[#666] mb-2">
                                    How can we help?
                                </label>
                                <textarea
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    required
                                    rows="4"
                                    placeholder="Tell us about your requirement..."
                                    className="w-full rounded-2xl bg-white border border-[#E0E0E0] px-5 py-4 text-[15px] text-[#111] placeholder-black/30 outline-none transition-all duration-300 resize-none focus:border-[#111]"
                                />
                            </div>

                            <button
                                type="submit"
                                className="group mt-2 flex w-full items-center justify-center gap-3 rounded-full bg-[#111] py-4 text-white font-semibold text-[15px] transition-all duration-200 hover:bg-[#333] active:scale-[0.98]"
                            >
                                <span>Send Message</span>
                                <Send size={15} className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-0.5" />
                            </button>
                        </form>
                    </div>

                    {/* RIGHT: DETAILS, MAP & SOCIALS (7 Columns) */}
                    <div className="lg:col-span-7 flex flex-col gap-8 w-full">

                        {/* Info Row cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            {/* Phone Numbers Box */}
                            <div className="flex gap-4 rounded-[24px] border border-[#E8E8E8] bg-[#F9F9F9] p-6">
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white border border-[#E0E0E0] text-[#081630]">
                                    <Phone size={20} />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <span className="text-[12px] font-bold uppercase tracking-wider text-[#8b95a7]">Call / WhatsApp</span>
                                    <a href="tel:+919873085801" className="text-[16px] font-bold text-[#081630] hover:text-[#111] transition-colors">+91 98730 85801</a>
                                    <a href="tel:+919289684801" className="text-[16px] font-bold text-[#081630] hover:text-[#111] transition-colors">+91 92896 84801</a>
                                </div>
                            </div>

                            {/* Email Box */}
                            <div className="flex gap-4 rounded-[24px] border border-[#E8E8E8] bg-[#F9F9F9] p-6">
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white border border-[#E0E0E0] text-[#081630]">
                                    <Mail size={19} />
                                </div>
                                <div className="flex flex-col gap-1 justify-center">
                                    <span className="text-[12px] font-bold uppercase tracking-wider text-[#8b95a7]">Email Address</span>
                                    <a href="mailto:mehtaestatesncr@gmail.com" className="text-[16px] font-bold text-[#081630] hover:text-[#111] transition-colors break-all">
                                        mehtaestatesncr@gmail.com
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Interactive Map Container */}
                        <div className="w-full overflow-hidden rounded-[28px] border border-[#E4E7EC] bg-[#F9F9F9] p-2">
                            <iframe
                                title="Google Map"
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3502.5620216441406!2d77.22728097632124!3d28.612911975674312!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cfd5b347eb62d%3A0x37205b715389640!2sIndia%20Gate!5e0!3m2!1sen!2sin!4v1710000000000!5m2!1sen!2sin"
                                className="w-full h-[280px] md:h-[320px] rounded-[22px] border-0 block opacity-90 hover:opacity-100 transition-opacity duration-300"
                                allowFullScreen=""
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                            />
                        </div>

                        {/* Social Media Channels Row */}
                        <div className="flex flex-wrap items-center justify-between gap-4 rounded-[24px] border border-[#E8E8E8] bg-[#F9F9F9] px-6 py-5">
                            <div className="flex items-center gap-2">
                                <MapPin size={16} className="text-[#8b95a7]" />
                                <span className="text-[14px] text-[#666] font-semibold">Follow our official channels</span>
                            </div>

                            {/* Real Brand Colors SVG List Stack */}
                            <div className="flex items-center gap-4">
                                {/* Facebook - Permanent Blue */}
                                <a
                                    href="https://facebook.com"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex h-11 w-11 items-center justify-center rounded-full border border-[#E4E7EC] bg-white text-[#1877F2] shadow-sm transition-transform duration-300 hover:scale-110"
                                >
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                    </svg>
                                </a>

                                {/* Instagram - Permanent Pink/Red */}
                                <a
                                    href="https://instagram.com"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex h-11 w-11 items-center justify-center rounded-full border border-[#E4E7EC] bg-white text-[#E4405F] shadow-sm transition-transform duration-300 hover:scale-110"
                                >
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204 0.013-3.583 0.07-4.849 0.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
                                    </svg>
                                </a>

                                {/* Google Business Page - Multi-color Asset */}
                                <a
                                    href="https://google.com"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex h-11 w-11 items-center justify-center rounded-full border border-[#E4E7EC] bg-white shadow-sm transition-transform duration-300 hover:scale-110"
                                >
                                    <svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
                                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                    </svg>
                                </a>

                                {/* YouTube Icon */}
                                <a
                                    href="https://youtube.com"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex h-11 w-11 items-center justify-center rounded-full border border-[#E4E7EC] bg-white text-[#FF0000] shadow-sm transition-transform duration-300 hover:scale-110"
                                >
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                                    </svg>
                                </a>
                            </div>
                        </div>

                    </div>
                </div>

            </div>
        </section>
    );
}