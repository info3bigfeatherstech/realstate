import { MapPin, Phone, Mail, ArrowUpRight, Building2 } from "lucide-react";
import LOGO from "../../assets/logo1.png";

// ─── Constants ────────────────────────────────────────────────────────────────

const NAV_LINKS = {
    Company: ["About Us", "Careers", "Our Agents", "Blog", "Contact"],
    Properties: ["Apartments", "Luxury Villas", "Builder Floors", "Commercial", "Plots"],
    "Top Cities": ["Delhi NCR", "Mumbai", "Bangalore", "Pune", "Hyderabad"],
};

const SOCIAL_ICONS = [
    {
        label: "Facebook",
        path: "M22 12.07C22 6.477 17.523 2 12 2S2 6.477 2 12.07c0 5.019 3.657 9.182 8.438 9.93v-7.03H7.898v-2.9h2.54V9.845c0-2.52 1.492-3.913 3.777-3.913 1.095 0 2.24.198 2.24.198v2.476h-1.262c-1.243 0-1.63.777-1.63 1.572v1.887h2.773l-.443 2.9h-2.33V22c4.78-.748 8.437-4.911 8.437-9.93z",
    },
    {
        label: "LinkedIn",
        path: "M4.983 3.5C4.983 4.604 4.104 5.5 3 5.5S1.017 4.604 1.017 3.5 1.896 1.5 3 1.5s1.983.896 1.983 2zM1.5 8h3V22h-3V8zm7.5 0h2.877v1.909h.041c.401-.761 1.379-1.562 2.84-1.562 3.037 0 3.6 2 3.6 4.59V22h-3v-6.364c0-1.518-.027-3.472-2.116-3.472-2.117 0-2.442 1.654-2.442 3.36V22h-3V8z",
    },
    {
        label: "YouTube",
        path: "M23.498 6.186a2.997 2.997 0 0 0-2.11-2.12C19.506 3.5 12 3.5 12 3.5s-7.506 0-9.388.566a2.997 2.997 0 0 0-2.11 2.12C0 8.083 0 12 0 12s0 3.917.502 5.814a2.997 2.997 0 0 0 2.11 2.12C4.494 20.5 12 20.5 12 20.5s7.506 0 9.388-.566a2.997 2.997 0 0 0 2.11-2.12C24 15.917 24 12 24 12s0-3.917-.502-5.814zM9.75 15.568v-7.136L15.818 12 9.75 15.568z",
    },
];

const LEGAL_LINKS = ["Privacy Policy", "Terms & Conditions", "Cookie Policy"];

const CONTACT_ITEMS = [
    { icon: Phone, text: "+91 98765 43210" },
    { icon: Mail, text: "info@vistahaven.com" },
    { icon: MapPin, text: "Tower A, Sector 62, Noida, Uttar Pradesh 201309, India", multiline: true },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function ContactItem({ icon: Icon, text, multiline }) {
    return (
        <div className={`flex ${multiline ? "items-start" : "items-center"} gap-4`}>
            <div className={`${multiline ? "mt-1" : ""} flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5`}>
                <Icon size={17} />
            </div>
            <span className="text-[17px] leading-[1.8] text-white/75">{text}</span>
        </div>
    );
}

function NavColumn({ title, links }) {
    return (
        <div>
            <h3 className="text-[20px] font-bold">{title}</h3>
            <div className="mt-7 space-y-4">
                {links.map((item) => (
                    <a
                        key={item}
                        href="#"
                        className="block text-[16px] text-white/55 transition-all duration-300 hover:text-white hover:translate-x-1"
                    >
                        {item}
                    </a>
                ))}
            </div>
        </div>
    );
}

function SocialButton({ label, path }) {
    return (
        <button
            aria-label={label}
            className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition-all duration-300 hover:bg-white hover:text-black hover:-translate-y-1"
        >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                <path d={path} />
            </svg>
        </button>
    );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function Footer() {
    return (
        <footer className="bg-black text-white font-['Satoshi'] overflow-hidden">

            {/* Top section */}
            <div className="border-b border-white/10">
                <div className="w-full px-5 md:px-10 lg:px-16 py-20">
                    <div className="grid grid-cols-1 gap-16 lg:grid-cols-12">

                        {/* Left — Brand + Contact */}
                        <div className="lg:col-span-5">

                            {/* Logo */}
                            <div className="flex items-center">
                                <img src={LOGO} alt="Vistahaven" className="h-16 w-auto object-contain brightness-0 invert" />
                            </div>

                            {/* Description */}
                            <p className="mt-8 max-w-[500px] text-[17px] leading-[1.9] text-white/55">
                                Discover premium apartments, luxury villas, commercial spaces
                                and investment-ready properties across India's fastest growing cities.
                            </p>

                            {/* Contact */}
                            <div className="mt-10 space-y-5">
                                {CONTACT_ITEMS.map((item) => (
                                    <ContactItem key={item.text} {...item} />
                                ))}
                            </div>
                        </div>

                        {/* Right — Links + Newsletter */}
                        <div className="lg:col-span-7">
                            <div className="grid grid-cols-2 gap-10 lg:grid-cols-4">

                                {/* Nav columns */}
                                {Object.entries(NAV_LINKS).map(([title, links]) => (
                                    <NavColumn key={title} title={title} links={links} />
                                ))}

                                {/* Newsletter */}
                                <div>
                                    <h3 className="text-[20px] font-bold">Stay Updated</h3>

                                    <p className="mt-6 text-[15px] leading-[1.8] text-white/55">
                                        Get the latest property updates and investment opportunities.
                                    </p>

                                    {/* Email input */}
                                    <div className="mt-6 flex items-center rounded-full border border-white/10 bg-white/5 p-2">
                                        <input
                                            type="email"
                                            placeholder="Enter your email"
                                            className="h-12 flex-1 bg-transparent px-4 text-[15px] text-white outline-none placeholder:text-white/35"
                                        />
                                        <button className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-black transition-transform duration-300 hover:rotate-45">
                                            <ArrowUpRight size={18} />
                                        </button>
                                    </div>

                                    {/* Socials */}
                                    <div className="mt-8 flex items-center gap-4">
                                        {SOCIAL_ICONS.map((social) => (
                                            <SocialButton key={social.label} {...social} />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom — Legal */}
            <div className="py-8">
                <div className="w-full px-5 md:px-10 lg:px-16 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                    <p className="text-[15px] text-white/45">
                        © Copyright {new Date().getFullYear()}. All Rights Reserved by Vistahaven
                    </p>
                    <div className="flex flex-wrap items-center gap-4 sm:gap-8">
                        {LEGAL_LINKS.map((item) => (
                            <a
                                key={item}
                                href="#"
                                className="text-[15px] text-white/45 transition-colors duration-300 hover:text-white"
                            >
                                {item}
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
}