"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
    Waves,
    Coffee,
    Droplets,
    Flame
} from "lucide-react";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

const EXPERIENCES = [
    {
        id: 1,
        tagline: "The Water's Edge",
        title: "Misty Kayaking",
        desc: "Glide across the glassy morning water before the world wakes up. We provide premium cedar kayaks for you to explore the hidden coves, lotus beds, and silent shallows at your own pace.",
        icon: Waves,
        image: "/featureKayak.jpg",
    },
    {
        id: 2,
        tagline: "Morning Rituals",
        title: "Floating Breakfast",
        desc: "Start your day immersed in the shallows. We serve freshly brewed Ceylon tea, tropical fruits, and warm pastries on a woven bamboo raft, delivered directly to your private plunge pool or the lake's edge.",
        icon: Coffee,
        image: "/floatingBrakfastII.jpg",
    },
    {
        id: 3,
        tagline: "Holistic Restoration",
        title: "Lakeside Ayurveda",
        desc: "Rebalance your energy in our open-air bamboo pavilion. Our expert practitioners use ancient Sri Lankan Ayurvedic techniques and warm herbal oils, all set to the natural, calming soundtrack of the lake.",
        icon: Droplets,
        image: "/AyurvedaService.jpg",
    },
    {
        id: 4,
        tagline: "Farm to Fire",
        title: "Clay Pot Masterclass",
        desc: "Discover the vibrant secrets of Sri Lankan cuisine. Forage for fresh herbs in our organic garden, then join our executive chef in an open-air jungle kitchen to master traditional clay pot cooking over a crackling wood fire.",
        icon: Flame, // Or Utensils
        image: "/srilankanCooking.jpg",
    }
];

export default function ServicesFloatingParallax() {
    const containerRef = useRef<HTMLDivElement>(null);

    useGSAP(
        () => {
            const mm = gsap.matchMedia();

            // 0. Parallax for the massive background "EXPERIENCES" text
            gsap.to(".bg-massive-text", {
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top bottom",
                    end: "top top",
                    scrub: 1,
                },
                y: 180,
                ease: "none",
            });

            // 1. Universal Header Reveal
            gsap.fromTo(
                ".header-reveal",
                { y: 40, opacity: 0 },
                {
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: "top 85%",
                    },
                    y: 0,
                    opacity: 1,
                    duration: 1.2,
                    ease: "expo.out",
                    stagger: 0.15,
                }
            );


            // --- DESKTOP ANIMATIONS ---
            mm.add("(min-width: 768px)", () => {

                // Staggered Entrance for the massive desktop rows
                const rows = gsap.utils.toArray<HTMLElement>(".desktop-row");
                rows.forEach((row) => {
                    gsap.fromTo(
                        row,
                        { y: 100, opacity: 0 },
                        {
                            scrollTrigger: {
                                trigger: row,
                                start: "top 80%",
                            },
                            y: 0,
                            opacity: 1,
                            duration: 1.5,
                            ease: "expo.out",
                            clearProps: "all"
                        }
                    );
                });

                // The "Floating Text Box" Parallax Effect
                // The text box moves independently of the image as you scroll
                const textBlocks = gsap.utils.toArray<HTMLElement>(".floating-text-box");
                textBlocks.forEach((block) => {
                    gsap.fromTo(
                        block,
                        { y: 80 }, // Starts 80px lower
                        {
                            y: -80,  // Floats 80px higher as you scroll past
                            ease: "none",
                            scrollTrigger: {
                                trigger: block.parentElement, // Triggered by its row
                                start: "top bottom",
                                end: "bottom top",
                                scrub: 1, // Buttery smooth scrubbing
                            }
                        }
                    );
                });

                // Inner Image "Window" Parallax
                const images = gsap.utils.toArray<HTMLElement>(".desktop-parallax-img");
                images.forEach((img) => {
                    gsap.to(img, {
                        y: "15%",
                        ease: "none",
                        scrollTrigger: {
                            trigger: img.parentElement,
                            start: "top bottom",
                            end: "bottom top",
                            scrub: 1,
                        }
                    });
                });
            });

            // --- MOBILE ANIMATIONS ---
            mm.add("(max-width: 767px)", () => {
                // Clean fade-up for mobile cards
                const mobileCards = gsap.utils.toArray<HTMLElement>(".mobile-card");
                mobileCards.forEach((card) => {
                    gsap.fromTo(
                        card,
                        { y: 50, opacity: 0 },
                        {
                            y: 0,
                            opacity: 1,
                            duration: 1,
                            ease: "power3.out",
                            scrollTrigger: {
                                trigger: card,
                                start: "top 85%",
                            }
                        }
                    );

                    // Inner Image Parallax for mobile
                    const img = card.querySelector(".mobile-parallax-img");
                    if (img) {
                        gsap.to(img, {
                            y: "15%",
                            ease: "none",
                            scrollTrigger: {
                                trigger: card,
                                start: "top bottom",
                                end: "bottom top",
                                scrub: 1,
                            }
                        });
                    }
                });
            });

            return () => mm.revert();
        },
        { scope: containerRef }
    );

    return (
        <section
            ref={containerRef}
            id="experiences"
            className="relative w-full bg-white overflow-hidden py-24 md:py-32 z-0"
        >
            {/* Massive Background Text Watermark */}
            <div className="bg-massive-text absolute top-0 left-1/2 -translate-x-1/2 text-[18vw] font-display font-black leading-none tracking-widest text-slate-200/60 select-none whitespace-nowrap -z-10 pointer-events-none">
                EXPERIENCES
            </div>

            <div className="max-w-7xl mx-auto w-full px-4 md:px-12 relative z-10">

                {/* --- SECTION HEADER --- */}
                {/* Massive bottom margins (mb-24 md:mb-40) to guarantee it NEVER overlaps the cards */}
                <div className="flex flex-col items-center text-center header-reveal mb-24 md:mb-40">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="h-px w-8 bg-primary-600" />
                        <span className="text-primary-700 font-bold tracking-widest text-xs uppercase">
                            Curated For You
                        </span>
                        <div className="h-px w-8 bg-primary-600" />
                    </div>
                    <h2 className="text-4xl md:text-5xl lg:text-7xl font-black uppercase tracking-tight text-slate-900 leading-[1.05] max-w-3xl drop-shadow-sm">
                        More than just a <br />
                        <span className="text-primary-600 italic font-serif font-light pr-2">place to sleep</span>
                    </h2>
                </div>


                {/* ============================================== */}
                {/* --- DESKTOP LAYOUT (Floating Parallax) --- */}
                {/* ============================================== */}

                <div className="hidden md:flex flex-col gap-40 w-full">
                    {EXPERIENCES.map((exp, index) => {
                        const isEven = index % 2 === 0;

                        return (
                            <div
                                key={`desktop-${exp.id}`}
                                className="desktop-row relative w-full h-[75vh] flex items-center group"
                            >
                                {/* 1. Massive Image Container (Takes up 65% of the screen width) */}
                                {/* Positions itself on the left or right depending on the index */}
                                <div
                                    className={`absolute top-0 h-full w-[65%] rounded-[2.5rem] overflow-hidden shadow-2xl bg-slate-200 ${isEven ? 'right-0' : 'left-0'}`}
                                >
                                    <img
                                        src={exp.image}
                                        alt={exp.title}
                                        className="desktop-parallax-img absolute top-[-15%] left-0 w-full h-[130%] object-cover transition-transform duration-[1.5s] ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-black/5 transition-opacity duration-700 group-hover:opacity-0" />

                                    {/* Floating Giant Number inside the image */}
                                    <div className={`absolute bottom-8 ${isEven ? 'left-8' : 'right-8'} text-[8rem] font-bold font-serif text-white/40 leading-none pointer-events-none drop-shadow-2xl`}>
                                        0{index + 1}
                                    </div>
                                </div>

                                {/* 2. Floating Text Box (Takes up 45% of the screen width) */}
                                {/* Positions itself on the OPPOSITE side of the image, physically overlapping the image edge */}
                                <div
                                    className={`floating-text-box absolute z-10 w-[45%] p-12 lg:p-16 bg-white/95 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white flex flex-col ${isEven ? 'left-0' : 'right-0'}`}
                                >
                                    <div className="w-16 h-16 rounded-2xl bg-primary-50 text-primary-600 flex items-center justify-center mb-8 shadow-sm">
                                        <exp.icon className="w-8 h-8" strokeWidth={1.5} />
                                    </div>

                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="h-px w-8 bg-primary-600" />
                                        <span className="text-primary-700 font-bold tracking-[0.2em] text-[10px] uppercase">
                                            {exp.tagline}
                                        </span>
                                    </div>

                                    <h3 className="text-4xl lg:text-5xl font-serif font-bold text-slate-900 mb-6 leading-tight">
                                        {exp.title}
                                    </h3>

                                    <p className="text-slate-600 leading-relaxed font-light mb-10 max-w-lg">
                                        {exp.desc}
                                    </p>

                                </div>

                            </div>
                        );
                    })}
                </div>


                {/* ================================================== */}
                {/* --- MOBILE LAYOUT (Strict 1-Up, 1-Down Grid) --- */}
                {/* ================================================== */}

                <div className="md:hidden flex flex-col gap-16 w-full">
                    {EXPERIENCES.map((exp, index) => (
                        <div
                            key={`mobile-${exp.id}`}
                            className="mobile-card flex flex-col w-full shadow-2xl rounded-4xl bg-white overflow-hidden border border-slate-100"
                        >
                            {/* 1. Top Image Section */}
                            <div className="relative w-full h-[45vh] bg-slate-200 overflow-hidden">
                                <img
                                    src={exp.image}
                                    alt={exp.title}
                                    className="mobile-parallax-img absolute top-[-15%] left-0 w-full h-[130%] object-cover"
                                />
                                <div className="absolute top-4 left-4 w-10 h-10 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center shadow-md text-primary-700 font-bold font-mono text-xs border border-white">
                                    0{index + 1}
                                </div>
                            </div>

                            {/* 2. Bottom Text Section (No overlapping, strict document flow) */}
                            <div className="flex flex-col p-6 sm:p-8 bg-white">
                                <div className="w-12 h-12 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center mb-5 border border-primary-100">
                                    <exp.icon className="w-5 h-5" strokeWidth={1.5} />
                                </div>

                                <div className="flex items-center gap-3 mb-3">
                                    <div className="h-px w-6 bg-primary-600" />
                                    <span className="text-primary-700 font-bold tracking-[0.2em] text-[9px] uppercase">
                                        {exp.tagline}
                                    </span>
                                </div>

                                <h3 className="text-3xl font-serif font-bold text-slate-900 mb-4 leading-tight">
                                    {exp.title}
                                </h3>

                                <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-light mb-8">
                                    {exp.desc}
                                </p>

                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
}