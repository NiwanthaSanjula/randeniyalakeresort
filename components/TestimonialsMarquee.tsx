"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Star } from "lucide-react";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

interface Testimonial {
    text: string;
    name: string;
    role: string;
    image: string;
}

const TESTIMONIALS = [
    {
        text: "The attention to detail here is unmatched. The bamboo architecture blends perfectly with nature without sacrificing a single modern comfort.",
        name: "James Thorne",
        role: "Architectural Digest",
        image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=200&auto=format&fit=crop"
    },
    {
        text: "The Floating Breakfast was an absolute dream. Waking up to the misty lake and warm Ceylon tea is a memory I will never forget.",
        name: "Emma Watson",
        role: "Travel Photographer",
        image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop"
    },
    {
        text: "Misty Kayaking at dawn is an absolute must. The water is like glass, and the surrounding canopy wildlife is simply stunning.",
        name: "Marcus Rossi",
        role: "Nature Enthusiast",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop"
    },
    {
        text: "We booked The Grand Sanctuary for our anniversary. The private deck dining under the stars was the most romantic experience.",
        name: "David & Sarah",
        role: "Honeymooners",
        image: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?q=80&w=200&auto=format&fit=crop"
    },
    {
        text: "From the zero-impact design to the incredibly hospitable staff, this place is a hidden luxury gem in Sri Lanka.",
        name: "Priya Menon",
        role: "Lifestyle Blogger",
        image: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=200&auto=format&fit=crop"
    },
    {
        text: "The Lakeside Ayurveda treatment completely reset my energy. Listening to the water while smelling the warm herbal oils was pure magic.",
        name: "Sophia Lin",
        role: "Wellness Retreat Guest",
        image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop"
    }
];

export default function TestimonialsSliding() {
    const containerRef = useRef<HTMLDivElement>(null);

    // Split the data to feed the two opposing rows
    const row1 = TESTIMONIALS.slice(0, 3);
    const row2 = TESTIMONIALS.slice(3, 6);

    useGSAP(
        () => {
            // Smooth reveal for the header text when scrolling down
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
                    ease: "power3.out",
                }
            );
        },
        { scope: containerRef }
    );

    const renderCard = (testimonial: Testimonial, index: number) => (
        <div
            key={index}
            className="bg-white border border-slate-200 hover:border-primary-300 rounded-3xl p-8 shrink-0 w-[320px] md:w-105 shadow-sm hover:shadow-xl hover:shadow-primary-900/5 transition-all duration-300 flex flex-col justify-between"
        >
            <div>
                <div className="flex gap-1 mb-5">
                    {Array(5).fill(0).map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-primary-500 text-primary-500" />
                    ))}
                </div>
                <p className="text-slate-700 text-base md:text-lg leading-relaxed font-light mb-8">
                    &ldquo;{testimonial.text}&rdquo;
                </p>
            </div>

            <div className="flex items-center gap-4">
                <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                    <p className="font-bold text-slate-900 text-sm md:text-base font-serif mb-0.5">
                        {testimonial.name}
                    </p>
                    <p className="text-primary-700 text-[10px] md:text-xs uppercase tracking-wider font-bold">
                        {testimonial.role}
                    </p>
                </div>
            </div>
        </div>
    );

    return (
        <section
            ref={containerRef}
            id="testimonials"
            className="relative w-full bg-[#FAFAFA] py-24 md:py-32 overflow-hidden"
        >
            {/* Pure CSS for the infinite seamless marquee */}
            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes scrollLeft {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                @keyframes scrollRight {
                    0% { transform: translateX(-50%); }
                    100% { transform: translateX(0); }
                }
                .track-left {
                    animation: scrollLeft 35s linear infinite;
                }
                .track-right {
                    animation: scrollRight 35s linear infinite;
                }
                /* Pauses the slider when the user hovers so they can read the card */
                .marquee-group:hover .track-left,
                .marquee-group:hover .track-right {
                    animation-play-state: paused;
                }
            `}} />

            <div className="w-full relative z-10 flex flex-col items-center">

                {/* --- HEADER --- */}
                <div className="flex flex-col items-center text-center header-reveal mb-16 md:mb-24 px-4">
                    <div className="inline-block bg-white border border-slate-200 rounded-full px-5 py-2 mb-6 shadow-sm">
                        <span className="text-xs font-bold tracking-widest text-primary-700 uppercase">
                            Guest Experiences
                        </span>
                    </div>
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-tight text-slate-900 leading-[1.05] max-w-3xl">
                        Stories from <br />
                        <span className="text-primary-600 italic font-serif font-light pr-2">the shoreline</span>
                    </h2>
                </div>

                {/* --- MARQUEE WRAPPER --- */}
                <div className="relative w-full flex flex-col gap-6 md:gap-8 marquee-group">

                    {/* Seamless Edge Gradients - Matches the #FAFAFA background perfectly */}
                    <div className="absolute left-0 top-0 bottom-0 w-16 md:w-48 bg-linear-to-r from-[#FAFAFA] to-transparent z-20 pointer-events-none" />
                    <div className="absolute right-0 top-0 bottom-0 w-16 md:w-48 bg-linear-to-l from-[#FAFAFA] to-transparent z-20 pointer-events-none" />

                    {/* TOP ROW (Scrolls Left) */}
                    <div className="flex w-[200vw]">
                        <div className="flex gap-6 md:gap-8 w-max track-left px-3 md:px-4">
                            {/* Duplicate the array elements to create the illusion of an infinite loop */}
                            {[...row1, ...row1, ...row1, ...row1].map((testimonial, index) =>
                                renderCard(testimonial, index)
                            )}
                        </div>
                    </div>

                    {/* BOTTOM ROW (Scrolls Right) */}
                    <div className="flex w-[200vw]">
                        <div className="flex gap-6 md:gap-8 w-max track-right px-3 md:px-4">
                            {[...row2, ...row2, ...row2, ...row2].map((testimonial, index) =>
                                renderCard(testimonial, index)
                            )}
                        </div>
                    </div>

                </div>

            </div>
        </section>
    );
}