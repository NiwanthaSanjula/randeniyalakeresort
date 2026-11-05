"use client";

import { Mail, Phone, MapPin, ArrowUp, Compass } from "lucide-react";
import Image from "next/image";
import { useLenis } from "lenis/react";
import SectionLink from "@/components/SectionLink";

export default function Footer({ privacyPolicyUrl, termsOfServiceUrl }: { privacyPolicyUrl?: string; termsOfServiceUrl?: string }) {
    const lenis = useLenis();
    const scrollToTop = () => {
        if (lenis) {
            lenis.scrollTo(window.scrollY, { immediate: true });
            lenis.scrollTo(0);
            return;
        }
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    return (
        <footer className="relative w-full bg-stone-950 text-stone-400 overflow-hidden pt-32 pb-12 z-0">
            {/* Top Fade Transition from the white Contact section above */}

            {/* Background Image with Fading Black Layer */}
            <div className="absolute inset-0 z-0 pointer-events-none select-none">
                <img
                    src="/cabin3Night.jpg"
                    alt="Footer Background"
                    className="w-full h-full object-cover opacity-55 transition-transform duration-10000 ease-out scale-105 hover:scale-100"
                />
                {/* Gradient overlays to create depth and guarantee high text readability */}
                <div className="absolute inset-0 bg-linear-to-t from-stone-950 via-stone-950/70 to-stone-950/20" />
                <div className="absolute inset-y-0 left-0 w-1/3 bg-linear-to-r from-stone-950/60 to-transparent" />
            </div>

            <div className="max-w-7xl mx-auto w-full px-6 sm:px-8 lg:px-12 relative z-20">
                {/* --- MAIN GRID --- */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 pb-20 border-b border-stone-800/60">

                    {/* Brand & Description (Column Span: 4) */}
                    <div className="lg:col-span-4 flex flex-col gap-6">
                        <SectionLink href="#home" className="inline-block w-max">
                            <Image
                                src="/randeniyaLogo.png"
                                alt="Randeniya Lake Resort Logo"
                                width={180}
                                height={54}
                                className="h-12 w-auto object-contain filter brightness-0 invert"
                            />
                        </SectionLink>
                        <p className="text-stone-400 font-light text-sm leading-relaxed max-w-sm">
                            An architectural sanctuary nestled on the edge of Randeniya Wewa. Experience sustainable eco-luxe living, guided by the rhythms of Sri Lanka&apos;s raw natural beauty.
                        </p>
                        {/* Contact shortcut */}
                        <div className="flex items-center gap-4 mt-2">
                            <SectionLink
                                href="#contact"
                                aria-label="Contact and directions"
                                className="w-10 h-10 rounded-full border border-stone-800 flex items-center justify-center text-stone-400 hover:text-amber-400 hover:border-amber-400/50 hover:bg-stone-900/50 transition-all duration-300"
                            >
                                <Compass className="w-4 h-4" />
                            </SectionLink>
                        </div>
                    </div>

                    {/* Quick Navigation Links (Column Span: 2.5) */}
                    <div className="lg:col-span-3 lg:pl-8 flex flex-col gap-6">
                        <h4 className="text-white text-xs font-bold uppercase tracking-[0.2em] font-sans">
                            Explore
                        </h4>
                        <nav className="flex flex-col gap-3">
                            {[
                                { label: "Home", href: "#home" },
                                { label: "Our Story", href: "#about" },
                                { label: "Rooms & Suites", href: "#villas" },
                                { label: "Experiences", href: "#experiences" },
                                { label: "Testimonials", href: "#testimonials" },
                            ].map((link) => (
                                <SectionLink
                                    key={link.label}
                                    href={link.href}
                                    className="text-stone-400 hover:text-amber-400 text-sm font-light transition-colors duration-300 w-max"
                                >
                                    {link.label}
                                </SectionLink>
                            ))}
                        </nav>
                    </div>

                    {/* Contact Details (Column Span: 2.5) */}
                    <div className="lg:col-span-3 flex flex-col gap-6">
                        <h4 className="text-white text-xs font-bold uppercase tracking-[0.2em] font-sans">
                            Contact
                        </h4>
                        <div className="flex flex-col gap-4 text-sm font-light">
                            <a
                                href="tel:+94771234567"
                                className="flex items-center gap-3 text-stone-400 hover:text-amber-400 transition-colors w-max"
                            >
                                <Phone className="w-4 h-4 text-primary-500" />
                                <span>+94 77 123 4567</span>
                            </a>
                            <a
                                href="mailto:concierge@randeniyalodge.com"
                                className="flex items-center gap-3 text-stone-400 hover:text-amber-400 transition-colors w-max"
                            >
                                <Mail className="w-4 h-4 text-primary-500" />
                                <span>concierge@randeniyalodge.com</span>
                            </a>
                            <div className="flex items-start gap-3 text-stone-400 max-w-xs">
                                <MapPin className="w-4 h-4 text-primary-500 shrink-0 mt-0.5" />
                                <span className="leading-relaxed">
                                    Lake Road, Randeniya, Galewela, Sri Lanka
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Eco-Pledge & Return to Top (Column Span: 2) */}
                    <div className="lg:col-span-2 flex flex-col justify-between items-start md:items-end gap-8 text-left md:text-right">
                        <div className="flex flex-col gap-3 items-start lg:items-end">
                            <span className="text-[10px] font-bold text-primary-500 uppercase tracking-widest bg-primary-950/40 border border-primary-900/50 rounded-full px-3 py-1">
                                Eco-Luxe Pledge
                            </span>
                            <p className="text-[11px] text-stone-500 leading-relaxed font-light mt-1">
                                100% sustainable design, zero-impact carbon operations.
                            </p>
                        </div>
                        {/* Scroll to Top Circle Button */}
                        <button
                            onClick={scrollToTop}
                            className="group/btn w-12 h-12 rounded-full bg-stone-900 hover:bg-primary-600 border border-stone-850 flex items-center justify-center text-stone-300 hover:text-white transition-all duration-300 cursor-pointer shadow-lg hover:shadow-primary-950/30"
                            aria-label="Scroll to top"
                        >
                            <ArrowUp className="w-5 h-5 transition-transform duration-300 group-hover/btn:-translate-y-1" />
                        </button>
                    </div>

                </div>

                {/* --- BOTTOM SECTION --- */}
                <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-light text-stone-500">
                    <p>© {new Date().getFullYear()} Randeniya Lake Resort. All rights reserved.</p>
                    {(privacyPolicyUrl || termsOfServiceUrl) && (
                        <div className="flex items-center gap-6">
                            {privacyPolicyUrl && <a href={privacyPolicyUrl} className="hover:text-stone-400 transition-colors">Privacy Policy</a>}
                            {termsOfServiceUrl && <a href={termsOfServiceUrl} className="hover:text-stone-400 transition-colors">Terms of Service</a>}
                        </div>
                    )}
                </div>
            </div>
        </footer>
    );
}
