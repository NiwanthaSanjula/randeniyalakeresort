"use client";

import { useRef, type MouseEvent } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Bed, Maximize, Waves, Sparkles, ArrowRight, Leaf, Compass, Wifi, Users } from "lucide-react";
import { useUpdateBooking } from "@/components/BookingProvider";
import { BOOKING_VILLAS } from "@/lib/booking";
import SectionLink from "@/components/SectionLink";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

// Added the 4th Family Cabin and the Day/Night image paths
const VILLAS = [
    {
        id: BOOKING_VILLAS[1].id,
        name: BOOKING_VILLAS[1].name,
        position: "18m from the shore",
        price: "$250",
        size: "65 sq.m",
        imageDay: "/cabin1Day.jpg",
        imageNight: "/cabin1Night.jpg",
        desc: "Set where the lily pads thin out, with a private stair straight down into the shallows and an open-air rain shower.",
        stats: [
            { icon: Maximize, label: "65 sq.m" },
            { icon: Waves, label: "Waterline" },
            { icon: Bed, label: "King suite" },
            { icon: Wifi, label: "Fast Wi-Fi" },
            { icon: Sparkles, label: "Eco-luxe" },
        ],
    },
    {
        id: BOOKING_VILLAS[2].id,
        name: BOOKING_VILLAS[2].name,
        position: "Suspended in nature",
        price: "$380",
        size: "85 sq.m",
        imageDay: "/cabin2Day.jpg",
        imageNight: "/cabin2Night.jpg",
        desc: "Raised on sustainable bamboo stilts above the treeline, offering total canopy privacy and a private plunge pool.",
        stats: [
            { icon: Maximize, label: "85 sq.m" },
            { icon: Waves, label: "Lake view" },
            { icon: Bed, label: "King suite" },
            { icon: Wifi, label: "Fast Wi-Fi" },
            { icon: Sparkles, label: "Plunge pool" },
        ],
    },
    {
        id: BOOKING_VILLAS[3].id,
        name: BOOKING_VILLAS[3].name,
        position: "Private cove · no neighbours",
        price: "$550",
        size: "120 sq.m",
        imageDay: "/cabin3Day.jpg",
        imageNight: "/cabin3Night.jpg",
        desc: "Our furthest villa from the main lodge — a full secluded cove to itself, with a floating yoga dock and zero-impact luxury.",
        stats: [
            { icon: Maximize, label: "120 sq.m" },
            { icon: Waves, label: "Private dock" },
            { icon: Bed, label: "Two suites" },
            { icon: Wifi, label: "Fast Wi-Fi" },
            { icon: Sparkles, label: "Zero-impact" },
        ],
    },
    {
        id: BOOKING_VILLAS[4].id,
        name: BOOKING_VILLAS[4].name,
        position: "Lakefront Estate",
        price: "$850",
        size: "180 sq.m",
        imageDay: "/cabin4Day.jpg",
        imageNight: "/cabin4Night.jpg",
        desc: "Designed for shared memories. Expansive multi-level living, dual master suites, and a massive lakeside dining deck.",
        stats: [
            { icon: Maximize, label: "180 sq.m" },
            { icon: Users, label: "Sleeps 6" },
            { icon: Bed, label: "Dual suites" },
            { icon: Wifi, label: "Fast Wi-Fi" },
            { icon: Sparkles, label: "Chef kitchen" },
        ],
    },
];

export default function VillasCreativeResponsive() {
    const updateBooking = useUpdateBooking();
    const sectionRef = useRef<HTMLDivElement>(null);
    const trackRef = useRef<HTMLDivElement>(null);
    const waterFillRef = useRef<HTMLDivElement>(null);
    const markerRef = useRef<HTMLDivElement>(null);
    const hintRef = useRef<HTMLDivElement>(null);

    function reserveVilla(event: MouseEvent<HTMLAnchorElement>, villa: string) {
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
        updateBooking((current) => ({ ...current, villa }));
        requestAnimationFrame(() => {
            document.getElementById("booking-firstName")?.focus({ preventScroll: true });
        });
    }

    useGSAP(
        () => {
            // MatchMedia handles responsive GSAP animations safely
            const mm = gsap.matchMedia();

            // 1. Universal Entrance Animations (Header text fade in)
            gsap.from(".reveal-item", {
                y: 40,
                opacity: 0,
                duration: 1,
                stagger: 0.15,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top 80%",
                }
            });

            // 2. Desktop-Only Logic (Horizontal Scroll & Pinning)
            mm.add("(min-width: 768px)", () => {
                const track = trackRef.current;
                if (!track) return;

                const getScrollAmount = () => {
                    const trackWidth = track.scrollWidth;
                    return -(trackWidth - window.innerWidth);
                };

                const tween = gsap.to(track, {
                    x: getScrollAmount,
                    ease: "none",
                });

                ScrollTrigger.create({
                    trigger: sectionRef.current,
                    start: "top top",
                    end: () => `+=${Math.abs(getScrollAmount())}`,
                    pin: true,
                    animation: tween,
                    scrub: 1,
                    invalidateOnRefresh: true,
                    onUpdate: (self) => {
                        // Drive the progress bar indicator
                        if (waterFillRef.current) waterFillRef.current.style.width = `${self.progress * 100}%`;
                        if (markerRef.current) markerRef.current.style.left = `${self.progress * 100}%`;

                        // Fade hint badge on scroll
                        if (hintRef.current) {
                            gsap.to(hintRef.current, {
                                opacity: self.progress > 0.03 ? 0 : 1,
                                duration: 0.4,
                                overwrite: "auto",
                            });
                        }
                    },
                });
            });

            // 3. Mobile-Only Logic (Vertical Scroll Fade-ins)
            mm.add("(max-width: 767px)", () => {
                const cards = gsap.utils.toArray<Element>(".villa-card");
                cards.forEach((card) => {
                    gsap.from(card, {
                        y: 50,
                        opacity: 0,
                        duration: 0.8,
                        ease: "power2.out",
                        scrollTrigger: {
                            trigger: card,
                            start: "top 85%",
                        }
                    });
                });
            });

            return () => mm.revert(); // Clean up context on unmount
        },
        { scope: sectionRef }
    );

    return (
        <div id="villas" className="scroll-mt-24">
        {/* Clipping prevents focus from scrolling the gallery separately from its animation. */}
        <section
            ref={sectionRef}
            className="relative w-full min-h-screen bg-slate-50 overflow-clip select-none py-20 md:py-0"
        >
            {/* Desktop Scroll Hint Badge */}
            <div
                ref={hintRef}
                className="hidden md:flex absolute top-8 right-10 z-30 items-center gap-2 px-4 py-2 rounded-full bg-white/60 border border-slate-200 backdrop-blur-md pointer-events-none shadow-sm"
            >
                <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">
                    Scroll to explore
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-primary-600" />
            </div>

            {/* Main Track (Flex-col on mobile, flex-row/w-max on desktop) */}
            <div
                ref={trackRef}
                className="flex flex-col md:flex-row md:h-screen md:w-max md:items-center px-4 md:px-24 gap-16 md:gap-0"
            >
                {/* Intro Header Block */}
                <div className="w-full md:w-[45vw] shrink-0 md:pr-24 pl-2 md:pl-0">
                    <div className="reveal-item flex items-center gap-3 mb-6">
                        <Leaf className="w-4 h-4 text-primary-600" />
                        <span className="text-primary-700 font-bold tracking-widest text-xs uppercase">
                            The Collection
                        </span>
                    </div>
                    <h2 className="reveal-item text-5xl md:text-7xl lg:text-8xl font-black uppercase tracking-tight text-slate-900 leading-[0.95] mb-8">
                        Wake beside <br />
                        <span className="text-primary-600 italic font-serif font-light pr-2">the water</span>
                    </h2>
                    <p className="reveal-item text-slate-600 leading-relaxed md:text-lg border-l-2 border-primary-200 pl-6 max-w-md">
                        Every sanctuary keeps a different distance from the lake — from the shallows by the dock to a secluded cove that belongs to no one else. Explore the collection to find yours.
                    </p>
                </div>

                {/* Villa Cards Loop */}
                {VILLAS.map((villa) => (
                    <div
                        key={villa.id}
                        className="villa-card group relative w-full md:w-[65vw] h-[75vh] md:h-[80vh] shrink-0 md:mx-8 rounded-[2.5rem] overflow-hidden shadow-2xl"
                    >
                        {/* 1. Default Day Image (Background) */}
                        <img
                            src={villa.imageDay}
                            alt={`${villa.name} Day View`}
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000"
                        />

                        {/* 2. Night Image (Fades in on hover) */}
                        <img
                            src={villa.imageNight}
                            alt={`${villa.name} Night View`}
                            className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-all duration-800"
                        />

                        {/* 3. Dark Gradient overlay for better text readability */}
                        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/10 to-transparent pointer-events-none" />

                        {/* Top Left Badge */}
                        <span className="absolute top-6 left-6 md:top-8 md:left-8 px-4 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-white/50 text-[10px] font-bold uppercase tracking-widest text-primary-900 shadow-lg z-10">
                            {villa.position}
                        </span>

                        {/* 4. The Floating Ticket Details Container */}
                        <div className="absolute bottom-4 left-4 right-4 md:bottom-6 md:left-6 md:right-6 bg-white/95 backdrop-blur-xl rounded-3xl px-5 py-5 md:px-8 md:py-6 flex flex-col md:flex-row md:items-center gap-5 shadow-2xl border border-white/50 transition-transform duration-500 group-hover:-translate-y-2 z-20">

                            {/* Left Text Block */}
                            <div className="flex-1">
                                <h3 className="text-2xl md:text-3xl font-serif font-bold text-slate-900 leading-none mb-3">
                                    {villa.name}
                                </h3>
                                <p className="text-xs md:text-sm text-slate-500 leading-relaxed mb-4 max-w-md">
                                    {villa.desc}
                                </p>
                                {/* 5 Amenities Array */}
                                <div className="flex flex-wrap gap-x-4 md:gap-x-6 gap-y-2">
                                    {villa.stats.map((stat, i) => (
                                        <div key={i} className="flex items-center gap-1.5 md:gap-2">
                                            <stat.icon className="w-3.5 h-3.5 md:w-4 md:h-4 text-primary-500" />
                                            <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-wider text-slate-500">
                                                {stat.label}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Ticket Dashed Divider (Hidden on Mobile) */}
                            <div className="hidden md:block relative w-px self-stretch mx-2">
                                <div className="absolute inset-0 border-l-2 border-dashed border-slate-200" />
                                {/* Cutouts that match the background of the image to look transparent */}
                                <div className="absolute -top-8.75 -left-1.75 w-4 h-4 rounded-full bg-slate-300 shadow-inner opacity-50" />
                                <div className="absolute -bottom-8.75 -left-1.75 w-4 h-4 rounded-full bg-slate-300 shadow-inner opacity-50" />
                            </div>

                            {/* Mobile Divider */}
                            <div className="md:hidden border-t-2 border-dashed border-slate-200 my-1" />

                            {/* Price + CTA Button */}
                            <div className="flex md:flex-col items-center md:items-start justify-between md:w-36 shrink-0">
                                <div>
                                    <span className="block text-[9px] uppercase tracking-widest text-slate-400 font-bold mb-0.5">
                                        Starting From
                                    </span>
                                    <span className="text-2xl font-serif font-black text-slate-900">
                                        {villa.price}
                                        <span className="text-xs font-sans font-medium text-slate-400"> / night</span>
                                    </span>
                                </div>
                                <SectionLink
                                    href="#reservation"
                                    aria-label={`Reserve ${villa.name}`}
                                    onClick={(event) => reserveVilla(event, villa.id)}
                                    className="group/btn flex items-center gap-2 px-5 py-2.5 md:mt-4 md:w-full justify-center bg-slate-900 hover:bg-primary-600 rounded-xl transition-colors shadow-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-600"
                                >
                                    <span className="text-xs font-bold uppercase tracking-wider text-white">
                                        Reserve
                                    </span>
                                    <ArrowRight className="w-3.5 h-3.5 text-primary-400 group-hover/btn:text-white group-hover/btn:translate-x-1 transition-all" />
                                </SectionLink>
                            </div>

                        </div>
                    </div>
                ))}

                {/* Final spacer for desktop to scroll smoothly off-screen */}
                <div className="hidden md:block w-[10vw] shrink-0" />
            </div>

            {/* Desktop-Only Bottom Progress Track */}
            <div className="hidden md:block absolute bottom-8 left-0 right-0 px-24 z-20 pointer-events-none">
                <div className="relative h-1 w-full bg-slate-200 rounded-full">
                    <div
                        ref={waterFillRef}
                        className="absolute inset-y-0 left-0 bg-primary-600 rounded-full"
                        style={{ width: "0%" }}
                    />
                    <div
                        ref={markerRef}
                        className="absolute -top-2.5 -translate-x-1/2 text-primary-600 bg-slate-50 rounded-full p-0.5"
                        style={{ left: "0%" }}
                    >
                        <Compass className="w-5 h-5" />
                    </div>
                </div>
            </div>
        </section>
        </div>
    );
}
