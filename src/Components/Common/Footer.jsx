import { MapPin, Phone, Mail, ArrowUpRight } from "lucide-react";
import LOGO from "../../assets/m.png";

// ─── Constants ────────────────────────────────────────────────────────────────

const NAV_LINKS = {
    "Quick Links": ["Contact Us", "Student Support", "Utility Services"],
    "Properties": ["Flat", "Villa", "Penthouse"],
    "More Properties": ["Studio Apartment","Office Space", "Warehouse", "Shop" ],
};

const LEGAL_LINKS = ["Privacy Policy", "Terms & Conditions", "Cookie Policy"];

const CONTACT_ITEMS = [
    { icon: Phone, text: "+91 98730 85801", href: "tel:+919873085801" },
    { icon: Phone, text: "+91 92896 84801", href: "tel:+919289684801" },
    { icon: Mail, text: "mehtaestatesncr@gmail.com", href: "mailto:mehtaestatesncr@gmail.com" },
    { icon: MapPin, text: "Tower A, Sector 62, Noida, Uttar Pradesh 201309, India", multiline: true },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function ContactItem({ icon: Icon, text, multiline, href }) {
    const Element = href ? "a" : "div";
    return (
        <Element
            href={href}
            className={`flex ${multiline ? "items-start" : "items-center"} gap-4 ${href ? "hover:text-white group/contact" : ""}`}
        >
            <div className={`${multiline ? "mt-1" : ""} flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 transition-colors duration-300 group-hover/contact:border-white/30`}>
                <Icon size={17} />
            </div>
            <span className="text-[17px] leading-[1.8] text-white transition-colors duration-300 group-hover/contact:text-white">
                {text}
            </span>
        </Element>
    );
}

function NavColumn({ title, links }) {
    return (
        <div>
            <h3 className="text-[20px] font-bold text-white">{title}</h3>
            <div className="mt-7 space-y-4">
                {links.map((item) => (
                    <a
                        key={item}
                        href="#"
                        className="block text-[16px] text-white transition-all duration-300 hover:text-white/80 hover:translate-x-1"
                    >
                        {item}
                    </a>
                ))}
            </div>
        </div>
    );
}

// ─── Social Buttons ───────────────────────────────────────────────────────────

function FacebookButton() {
    return (
        <a
            href="https://facebook.com"
            target="_blank"
            rel="noreferrer"
            aria-label="Facebook"
            className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white text-[#1877F2] shadow-sm transition-all duration-300 hover:-translate-y-1"
        >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
        </a>
    );
}

function InstagramButton() {
    return (
        <a
            href="https://instagram.com"
            target="_blank"
            rel="noreferrer"
            aria-label="Instagram"
            className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white text-[#E4405F] shadow-sm transition-all duration-300 hover:-translate-y-1"
        >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
            </svg>
        </a>
    );
}

function GoogleSocialButton() {
    return (
        <a
            href="https://google.com"
            target="_blank"
            rel="noreferrer"
            aria-label="Google Business Profile"
            className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1"
        >
            <svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
        </a>
    );
}

function YoutubeButton() {
    return (
        <a
            href="https://youtube.com"
            target="_blank"
            rel="noreferrer"
            aria-label="YouTube"
            className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white text-[#FF0000] shadow-sm transition-all duration-300 hover:-translate-y-1"
        >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
            </svg>
        </a>
    );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function Footer() {
    return (
        <footer className="relative bg-[#171717] text-white font-['Satoshi'] overflow-hidden">

            {/* Background Watermark Logo — ONLY on large screens (lg+), hidden on mobile */}
            <div className="absolute inset-0 top-5 pointer-events-none select-none z-0 hidden lg:flex items-end justify-center overflow-hidden">
                <img
                    src={LOGO}
                    alt=""
                    className="w-[45%] max-w-[550px] h-auto object-contain opacity-[0.]  mb-0"
                />
                <div className="absolute inset-0 bg-black/10" />
            </div>

            {/* Main content wrapper */}
            <div className="relative z-10">
                {/* Top section */}
                <div className="border-b border-white/10">
                    <div className="w-full px-5 md:px-10 lg:px-16 lg:py-20">
                        <div className="grid grid-cols-1 gap-16 lg:grid-cols-12">

                           {/* Left — Brand Content */}
                        <div className="lg:col-span-5 pt-0 lg:pt-1">

                            {/* Mobile pe: logo image | Large screen pe: text heading */}
                           <img
                                src={LOGO}
                                alt="Mehta Estates"
                                className="block lg:hidden h-40 w-auto object-contain"
                            />
                            <h3 className="hidden lg:block text-[20px] font-bold text-white tracking-wide">
                                Mehta Estates
                            </h3>

                            <p className="lg:mt-7 max-w-[500px] text-[17px] leading-[1.9] text-white">
                                Discover premium apartments, luxury villas, commercial spaces
                                and investment-ready properties across India's fastest growing cities.
                            </p>

                            <div className="mt-10 space-y-5">
                                {CONTACT_ITEMS.map((item, index) => (
                                    <ContactItem key={`${item.text}-${index}`} {...item} />
                                ))}
                            </div>
                        </div>

                            {/* Right — Links + Newsletter */}
                            <div className="lg:col-span-7">
                                <div className="grid grid-cols-2 gap-10 lg:grid-cols-4">

                                    {Object.entries(NAV_LINKS).map(([title, links]) => (
                                        <NavColumn key={title} title={title} links={links} />
                                    ))}

                                    {/* Newsletter System */}
                                    <div className="col-span-2 sm:col-span-1 lg:col-span-1">
                                        <h3 className="text-[20px] font-bold text-white">Stay Updated</h3>

                                        <p className="mt-6 text-[15px] leading-[1.8] text-white">
                                            Get the latest property updates and investment opportunities.
                                        </p>

                                        <div className="mt-6 flex items-center rounded-full border border-white/10 bg-white/5 p-2">
                                            <input
                                                type="email"
                                                placeholder="Enter your email"
                                                className="h-12 flex-1 bg-transparent px-4 text-[15px] text-white outline-none placeholder:text-white/45"
                                            />
                                            <button className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-black transition-transform duration-300 hover:rotate-45">
                                                <ArrowUpRight size={18} />
                                            </button>
                                        </div>

                                        <div className="mt-8 flex flex-nowrap items-center gap-3">
                                            <FacebookButton />
                                            <InstagramButton />
                                            <GoogleSocialButton />
                                            <YoutubeButton />
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>

                {/* Bottom — Legal Layout */}
                <div className="py-8">
                    <div className="w-full px-5 md:px-10 lg:px-16 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                        <p className="text-[15px] text-white">
                            © Copyright {new Date().getFullYear()}. All Rights Reserved by Mehta Estates
                        </p>
                        <div className="flex flex-wrap items-center gap-4 sm:gap-8">
                            {LEGAL_LINKS.map((item) => (
                                <a
                                    key={item}
                                    href="#"
                                    className="text-[15px] text-white transition-colors duration-300 hover:text-white/80"
                                >
                                    {item}
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}

// import { MapPin, Phone, Mail, ArrowUpRight } from "lucide-react";
// import LOGO from "../../assets/logo1.png";

// // ─── Constants ────────────────────────────────────────────────────────────────

// const NAV_LINKS = {
//     "Quick Links": ["Contact Us", "Student Support", "Utility Services"],
//     "Properties": ["Flat", "Villa", "Penthouse", "Studio Apartment"],
//     "More Properties": ["Office Space", "Shop", "Warehouse"],
// };

// const LEGAL_LINKS = ["Privacy Policy", "Terms & Conditions", "Cookie Policy"];

// const CONTACT_ITEMS = [
//     { icon: Phone, text: "+91 98730 85801", href: "tel:+919873085801" },
//     { icon: Phone, text: "+91 92896 84801", href: "tel:+919289684801" },
//     { icon: Mail, text: "mehtaestatesncr@gmail.com", href: "mailto:mehtaestatesncr@gmail.com" },
//     { icon: MapPin, text: "Tower A, Sector 62, Noida, Uttar Pradesh 201309, India", multiline: true },
// ];

// // ─── Sub-components ───────────────────────────────────────────────────────────

// function ContactItem({ icon: Icon, text, multiline, href }) {
//     const Element = href ? "a" : "div";
//     return (
//         <Element
//             href={href}
//             className={`flex ${multiline ? "items-start" : "items-center"} gap-4 ${href ? "hover:text-white group/contact" : ""}`}
//         >
//             <div className={`${multiline ? "mt-1" : ""} flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 transition-colors duration-300 group-hover/contact:border-white/30`}>
//                 <Icon size={17} />
//             </div>
//             <span className="text-[17px] leading-[1.8] text-white transition-colors duration-300 group-hover/contact:text-white">
//                 {text}
//             </span>
//         </Element>
//     );
// }

// function NavColumn({ title, links }) {
//     return (
//         <div>
//             <h3 className="text-[20px] font-bold text-white">{title}</h3>
//             <div className="mt-7 space-y-4">
//                 {links.map((item) => (
//                     <a
//                         key={item}
//                         href="#"
//                         className="block text-[16px] text-white transition-all duration-300 hover:text-white/80 hover:translate-x-1"
//                     >
//                         {item}
//                     </a>
//                 ))}
//             </div>
//         </div>
//     );
// }

// // ─── Social Buttons ───────────────────────────────────────────────────────────

// function FacebookButton() {
//     return (
//         <a
//             href="https://facebook.com"
//             target="_blank"
//             rel="noreferrer"
//             aria-label="Facebook"
//             className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white text-[#1877F2] shadow-sm transition-all duration-300 hover:-translate-y-1"
//         >
//             <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
//                 <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
//             </svg>
//         </a>
//     );
// }

// // ... (Baaki saare social buttons bina kisi change ke same hain)
// function InstagramButton() {
//     return (
//         <a
//             href="https://instagram.com"
//             target="_blank"
//             rel="noreferrer"
//             aria-label="Instagram"
//             className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white text-[#E4405F] shadow-sm transition-all duration-300 hover:-translate-y-1"
//         >
//             <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
//                 <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
//             </svg>
//         </a>
//     );
// }

// function GoogleSocialButton() {
//     return (
//         <a
//             href="https://google.com"
//             target="_blank"
//             rel="noreferrer"
//             aria-label="Google Business Profile"
//             className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1"
//         >
//             <svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                 <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
//                 <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
//                 <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
//                 <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
//             </svg>
//         </a>
//     );
// }

// function YoutubeButton() {
//     return (
//             <a 
//             href="https://youtube.com"
//             target="_blank"
//             rel="noreferrer"
//             aria-label="YouTube"
//             className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white text-[#FF0000] shadow-sm transition-all duration-300 hover:-translate-y-1"
//         >
//             <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
//                 <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
//             </svg>
//         </a>
//     );
// }

// // ─── Main Component ───────────────────────────────────────────────────────────

// export default function Footer() {
//     return (
//         <footer className="relative bg-[#171717] text-white font-['Satoshi'] overflow-hidden">
            
//             {/* Background Watermark Logo & Overlay setup */}
//             <div className="absolute inset-0 pointer-events-none select-none z-0 flex items-center justify-center overflow-hidden">
//                 {/* Background image container */}
//                 <img 
//                     src={LOGO} 
//                     alt="" 
//                     className="w-[80%] md:w-[50%] max-w-[600px] h-auto object-contain opacity-[0.08] mix-blend-lighten"
//                 />
//                 {/* Soft backdrop overlay to mix nicely with the text */}
//                 <div className="absolute inset-0 bg-black/20" />
//             </div>

//             {/* Main content wrapper with relative z-index so it stays above bg-logo */}
//             <div className="relative z-10">
//                 {/* Top section */}
//                 <div className="border-b border-white/10">
//                     <div className="w-full px-5 md:px-10 lg:px-16 py-20">
//                         <div className="grid grid-cols-1 gap-16 lg:grid-cols-12">

//                             {/* Left — Brand + Contact */}
//                             <div className="lg:col-span-5">
//                                 {/* Regular Top-Left Logo */}
//                                 <div className="flex items-center justify-start">
//                                     <img src={LOGO} alt="Mehta Estates" className="h-24 md:h-28 w-auto object-contain max-w-full" />
//                                 </div>

//                                 {/* Description */}
//                                 <p className="mt-8 max-w-[500px] text-[17px] leading-[1.9] text-white">
//                                     Discover premium apartments, luxury villas, commercial spaces
//                                     and investment-ready properties across India's fastest growing cities.
//                                 </p>

//                                 {/* Contact Details Panel */}
//                                 <div className="mt-10 space-y-5">
//                                     {CONTACT_ITEMS.map((item, index) => (
//                                         <ContactItem key={`${item.text}-${index}`} {...item} />
//                                     ))}
//                                 </div>
//                             </div>

//                             {/* Right — Links + Newsletter */}
//                             <div className="lg:col-span-7">
//                                 <div className="grid grid-cols-2 gap-10 lg:grid-cols-4">

//                                     {/* Nav columns */}
//                                     {Object.entries(NAV_LINKS).map(([title, links]) => (
//                                         <NavColumn key={title} title={title} links={links} />
//                                     ))}

//                                     {/* Newsletter System */}
//                                     <div className="col-span-2 sm:col-span-1 lg:col-span-1">
//                                         <h3 className="text-[20px] font-bold text-white">Stay Updated</h3>

//                                         <p className="mt-6 text-[15px] leading-[1.8] text-white">
//                                             Get the latest property updates and investment opportunities.
//                                         </p>

//                                         {/* Email input field */}
//                                         <div className="mt-6 flex items-center rounded-full border border-white/10 bg-white/5 p-2">
//                                             <input
//                                                 type="email"
//                                                 placeholder="Enter your email"
//                                                 className="h-12 flex-1 bg-transparent px-4 text-[15px] text-white outline-none placeholder:text-white/45"
//                                             />
//                                             <button className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-black transition-transform duration-300 hover:rotate-45">
//                                                 <ArrowUpRight size={18} />
//                                             </button>
//                                         </div>

//                                         {/* Social icons — all 4 in one flex row */}
//                                         <div className="mt-8 flex flex-nowrap items-center gap-3">
//                                             <FacebookButton />
//                                             <InstagramButton />
//                                             <GoogleSocialButton />
//                                             <YoutubeButton />
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>

//                         </div>
//                     </div>
//                 </div>

//                 {/* Bottom — Legal Layout */}
//                 <div className="py-8">
//                     <div className="w-full px-5 md:px-10 lg:px-16 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
//                         <p className="text-[15px] text-white">
//                             © Copyright {new Date().getFullYear()}. All Rights Reserved by Mehta Estates
//                         </p>
//                         <div className="flex flex-wrap items-center gap-4 sm:gap-8">
//                             {LEGAL_LINKS.map((item) => (
//                                 <a
//                                     key={item}
//                                     href="#"
//                                     className="text-[15px] text-white transition-colors duration-300 hover:text-white/80"
//                                 >
//                                     {item}
//                                 </a>
//                             ))}
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </footer>
//     );
// }

// import { MapPin, Phone, Mail, ArrowUpRight } from "lucide-react";
// import LOGO from "../../assets/logo1.png";

// // ─── Constants ────────────────────────────────────────────────────────────────

// const NAV_LINKS = {
//     "Quick Links": ["Contact Us", "Student Support", "Utility Services"],
//     "Properties": ["Flat", "Villa", "Penthouse", "Studio Apartment"],
//     "More Properties": ["Office Space", "Shop", "Warehouse"],
// };

// const LEGAL_LINKS = ["Privacy Policy", "Terms & Conditions", "Cookie Policy"];

// const CONTACT_ITEMS = [
//     { icon: Phone, text: "+91 98730 85801", href: "tel:+919873085801" },
//     { icon: Phone, text: "+91 92896 84801", href: "tel:+919289684801" },
//     { icon: Mail, text: "mehtaestatesncr@gmail.com", href: "mailto:mehtaestatesncr@gmail.com" },
//     { icon: MapPin, text: "Tower A, Sector 62, Noida, Uttar Pradesh 201309, India", multiline: true },
// ];

// // ─── Sub-components ───────────────────────────────────────────────────────────

// function ContactItem({ icon: Icon, text, multiline, href }) {
//     const Element = href ? "a" : "div";
//     return (
//         <Element
//             href={href}
//             className={`flex ${multiline ? "items-start" : "items-center"} gap-4 ${href ? "hover:text-white group/contact" : ""}`}
//         >
//             <div className={`${multiline ? "mt-1" : ""} flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 transition-colors duration-300 group-hover/contact:border-white/30`}>
//                 <Icon size={17} />
//             </div>
//             <span className="text-[17px] leading-[1.8] text-white transition-colors duration-300 group-hover/contact:text-white">
//                 {text}
//             </span>
//         </Element>
//     );
// }

// function NavColumn({ title, links }) {
//     return (
//         <div>
//             <h3 className="text-[20px] font-bold text-white">{title}</h3>
//             <div className="mt-7 space-y-4">
//                 {links.map((item) => (
//                     <a
//                         key={item}
//                         href="#"
//                         className="block text-[16px] text-white transition-all duration-300 hover:text-white/80 hover:translate-x-1"
//                     >
//                         {item}
//                     </a>
//                 ))}
//             </div>
//         </div>
//     );
// }

// // ─── Social Buttons ───────────────────────────────────────────────────────────

// function FacebookButton() {
//     return (
//         <a
//             href="https://facebook.com"
//             target="_blank"
//             rel="noreferrer"
//             aria-label="Facebook"
//             className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white text-[#1877F2] shadow-sm transition-all duration-300 hover:-translate-y-1"
//         >
//             <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
//                 <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
//             </svg>
//         </a>
//     );
// }

// function InstagramButton() {
//     return (
//         <a
//             href="https://instagram.com"
//             target="_blank"
//             rel="noreferrer"
//             aria-label="Instagram"
//             className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white text-[#E4405F] shadow-sm transition-all duration-300 hover:-translate-y-1"
//         >
//             <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
//                 <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
//             </svg>
//         </a>
//     );
// }

// function GoogleSocialButton() {
//     return (
//         <a
//             href="https://google.com"
//             target="_blank"
//             rel="noreferrer"
//             aria-label="Google Business Profile"
//             className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1"
//         >
//             <svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                 <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
//                 <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
//                 <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
//                 <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
//             </svg>
//         </a>
//     );
// }

// function YoutubeButton() {
//     return (
//             <a 
//             href="https://youtube.com"
//             target="_blank"
//             rel="noreferrer"
//             aria-label="YouTube"
//             className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white text-[#FF0000] shadow-sm transition-all duration-300 hover:-translate-y-1"
//         >
//             <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
//                 <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
//             </svg>
//         </a>
//     );
// }

// // ─── Main Component ───────────────────────────────────────────────────────────

// export default function Footer() {
//     return (
//         <footer className="bg-black text-white font-['Satoshi'] overflow-hidden">
//             {/* Top section */}
//             <div className="border-b border-white/10">
//                 <div className="w-full px-5 md:px-10 lg:px-16 py-20">
//                     <div className="grid grid-cols-1 gap-16 lg:grid-cols-12">

//                         {/* Left — Brand + Contact */}
//                         <div className="lg:col-span-5">
//                             {/* Logo — Enhanced size container for wide high-resolution branding */}
//                             <div className="flex items-center justify-start">
//                                 <img src={LOGO} alt="Mehta Estates" className="h-24 md:h-28 w-auto object-contain max-w-full" />
//                             </div>

//                         {/* Description */}
//                             <p className="mt-8 max-w-[500px] text-[17px] leading-[1.9] text-white">
//                                 Discover premium apartments, luxury villas, commercial spaces
//                                 and investment-ready properties across India's fastest growing cities.
//                             </p>

//                             {/* Contact Details Panel */}
//                             <div className="mt-10 space-y-5">
//                                 {CONTACT_ITEMS.map((item, index) => (
//                                     <ContactItem key={`${item.text}-${index}`} {...item} />
//                                 ))}
//                             </div>
//                         </div>

//                         {/* Right — Links + Newsletter */}
//                         <div className="lg:col-span-7">
//                             <div className="grid grid-cols-2 gap-10 lg:grid-cols-4">

//                                 {/* Nav columns */}
//                                 {Object.entries(NAV_LINKS).map(([title, links]) => (
//                                     <NavColumn key={title} title={title} links={links} />
//                                 ))}

//                                 {/* Newsletter System */}
//                                 <div className="col-span-2 sm:col-span-1 lg:col-span-1">
//                                     <h3 className="text-[20px] font-bold text-white">Stay Updated</h3>

//                                     <p className="mt-6 text-[15px] leading-[1.8] text-white">
//                                         Get the latest property updates and investment opportunities.
//                                     </p>

//                                     {/* Email input field */}
//                                     <div className="mt-6 flex items-center rounded-full border border-white/10 bg-white/5 p-2">
//                                         <input
//                                             type="email"
//                                             placeholder="Enter your email"
//                                             className="h-12 flex-1 bg-transparent px-4 text-[15px] text-white outline-none placeholder:text-white/45"
//                                         />
//                                         <button className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-black transition-transform duration-300 hover:rotate-45">
//                                             <ArrowUpRight size={18} />
//                                         </button>
//                                     </div>

//                                     {/* Social icons — all 4 in one flex row */}
//                                     <div className="mt-8 flex flex-nowrap items-center gap-3">
//                                         <FacebookButton />
//                                         <InstagramButton />
//                                         <GoogleSocialButton />
//                                         <YoutubeButton />
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>

//                     </div>
//                 </div>
//             </div>

//             {/* Bottom — Legal Layout */}
//             <div className="py-8">
//                 <div className="w-full px-5 md:px-10 lg:px-16 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
//                     <p className="text-[15px] text-white">
//                         © Copyright {new Date().getFullYear()}. All Rights Reserved by Mehta Estates
//                     </p>
//                     <div className="flex flex-wrap items-center gap-4 sm:gap-8">
//                         {LEGAL_LINKS.map((item) => (
//                             <a
//                                 key={item}
//                                 href="#"
//                                 className="text-[15px] text-white transition-colors duration-300 hover:text-white/80"
//                             >
//                                 {item}
//                             </a>
//                         ))}
//                     </div>
//                 </div>
//             </div>
//         </footer>
//     );
// }

// import { MapPin, Phone, Mail, ArrowUpRight, Building2 } from "lucide-react";
// import LOGO from "../../assets/logo1.png";

// // ─── Constants ────────────────────────────────────────────────────────────────

// const NAV_LINKS = {
//     Company: ["About Us", "Careers", "Our Agents", "Blog", "Contact"],
//     Properties: ["Apartments", "Luxury Villas", "Builder Floors", "Commercial", "Plots"],
//     "Top Cities": ["Delhi NCR", "Mumbai", "Bangalore", "Pune", "Hyderabad"],
// };

// const SOCIAL_ICONS = [
//     {
//         label: "Facebook",
//         path: "M22 12.07C22 6.477 17.523 2 12 2S2 6.477 2 12.07c0 5.019 3.657 9.182 8.438 9.93v-7.03H7.898v-2.9h2.54V9.845c0-2.52 1.492-3.913 3.777-3.913 1.095 0 2.24.198 2.24.198v2.476h-1.262c-1.243 0-1.63.777-1.63 1.572v1.887h2.773l-.443 2.9h-2.33V22c4.78-.748 8.437-4.911 8.437-9.93z",
//     },
//     {
//         label: "LinkedIn",
//         path: "M4.983 3.5C4.983 4.604 4.104 5.5 3 5.5S1.017 4.604 1.017 3.5 1.896 1.5 3 1.5s1.983.896 1.983 2zM1.5 8h3V22h-3V8zm7.5 0h2.877v1.909h.041c.401-.761 1.379-1.562 2.84-1.562 3.037 0 3.6 2 3.6 4.59V22h-3v-6.364c0-1.518-.027-3.472-2.116-3.472-2.117 0-2.442 1.654-2.442 3.36V22h-3V8z",
//     },
//     {
//         label: "YouTube",
//         path: "M23.498 6.186a2.997 2.997 0 0 0-2.11-2.12C19.506 3.5 12 3.5 12 3.5s-7.506 0-9.388.566a2.997 2.997 0 0 0-2.11 2.12C0 8.083 0 12 0 12s0 3.917.502 5.814a2.997 2.997 0 0 0 2.11 2.12C4.494 20.5 12 20.5 12 20.5s7.506 0 9.388-.566a2.997 2.997 0 0 0 2.11-2.12C24 15.917 24 12 24 12s0-3.917-.502-5.814zM9.75 15.568v-7.136L15.818 12 9.75 15.568z",
//     },
// ];

// const LEGAL_LINKS = ["Privacy Policy", "Terms & Conditions", "Cookie Policy"];

// const CONTACT_ITEMS = [
//     { icon: Phone, text: "+91 98765 43210" },
//     { icon: Mail, text: "info@vistahaven.com" },
//     { icon: MapPin, text: "Tower A, Sector 62, Noida, Uttar Pradesh 201309, India", multiline: true },
// ];

// // ─── Sub-components ───────────────────────────────────────────────────────────

// function ContactItem({ icon: Icon, text, multiline }) {
//     return (
//         <div className={`flex ${multiline ? "items-start" : "items-center"} gap-4`}>
//             <div className={`${multiline ? "mt-1" : ""} flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5`}>
//                 <Icon size={17} />
//             </div>
//             <span className="text-[17px] leading-[1.8] text-white/75">{text}</span>
//         </div>
//     );
// }

// function NavColumn({ title, links }) {
//     return (
//         <div>
//             <h3 className="text-[20px] font-bold">{title}</h3>
//             <div className="mt-7 space-y-4">
//                 {links.map((item) => (
//                     <a
//                         key={item}
//                         href="#"
//                         className="block text-[16px] text-white/55 transition-all duration-300 hover:text-white hover:translate-x-1"
//                     >
//                         {item}
//                     </a>
//                 ))}
//             </div>
//         </div>
//     );
// }

// function SocialButton({ label, path }) {
//     return (
//         <button
//             aria-label={label}
//             className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition-all duration-300 hover:bg-white hover:text-black hover:-translate-y-1"
//         >
//             <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
//                 <path d={path} />
//             </svg>
//         </button>
//     );
// }

// // ─── Main Component ───────────────────────────────────────────────────────────

// export default function Footer() {
//     return (
//         <footer className="bg-black text-white font-['Satoshi'] overflow-hidden">

//             {/* Top section */}
//             <div className="border-b border-white/10">
//                 <div className="w-full px-5 md:px-10 lg:px-16 py-20">
//                     <div className="grid grid-cols-1 gap-16 lg:grid-cols-12">

//                         {/* Left — Brand + Contact */}
//                         <div className="lg:col-span-5">

//                             {/* Logo */}
//                             <div className="flex items-center">
//                                 <img src={LOGO} alt="Vistahaven" className="h-16 w-auto object-contain brightness-0 invert" />
//                             </div>

//                             {/* Description */}
//                             <p className="mt-8 max-w-[500px] text-[17px] leading-[1.9] text-white/55">
//                                 Discover premium apartments, luxury villas, commercial spaces
//                                 and investment-ready properties across India's fastest growing cities.
//                             </p>

//                             {/* Contact */}
//                             <div className="mt-10 space-y-5">
//                                 {CONTACT_ITEMS.map((item) => (
//                                     <ContactItem key={item.text} {...item} />
//                                 ))}
//                             </div>
//                         </div>

//                         {/* Right — Links + Newsletter */}
//                         <div className="lg:col-span-7">
//                             <div className="grid grid-cols-2 gap-10 lg:grid-cols-4">

//                                 {/* Nav columns */}
//                                 {Object.entries(NAV_LINKS).map(([title, links]) => (
//                                     <NavColumn key={title} title={title} links={links} />
//                                 ))}

//                                 {/* Newsletter */}
//                                 <div>
//                                     <h3 className="text-[20px] font-bold">Stay Updated</h3>

//                                     <p className="mt-6 text-[15px] leading-[1.8] text-white/55">
//                                         Get the latest property updates and investment opportunities.
//                                     </p>

//                                     {/* Email input */}
//                                     <div className="mt-6 flex items-center rounded-full border border-white/10 bg-white/5 p-2">
//                                         <input
//                                             type="email"
//                                             placeholder="Enter your email"
//                                             className="h-12 flex-1 bg-transparent px-4 text-[15px] text-white outline-none placeholder:text-white/35"
//                                         />
//                                         <button className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-black transition-transform duration-300 hover:rotate-45">
//                                             <ArrowUpRight size={18} />
//                                         </button>
//                                     </div>

//                                     {/* Socials */}
//                                     <div className="mt-8 flex items-center gap-4">
//                                         {SOCIAL_ICONS.map((social) => (
//                                             <SocialButton key={social.label} {...social} />
//                                         ))}
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             {/* Bottom — Legal */}
//             <div className="py-8">
//                 <div className="w-full px-5 md:px-10 lg:px-16 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
//                     <p className="text-[15px] text-white/45">
//                         © Copyright {new Date().getFullYear()}. All Rights Reserved by Vistahaven
//                     </p>
//                     <div className="flex flex-wrap items-center gap-4 sm:gap-8">
//                         {LEGAL_LINKS.map((item) => (
//                             <a
//                                 key={item}
//                                 href="#"
//                                 className="text-[15px] text-white/45 transition-colors duration-300 hover:text-white"
//                             >
//                                 {item}
//                             </a>
//                         ))}
//                     </div>
//                 </div>
//             </div>
//         </footer>
//     );
// }