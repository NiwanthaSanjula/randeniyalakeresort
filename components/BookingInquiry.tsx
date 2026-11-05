"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ReservationForm from "@/components/ReservationForm";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

export default function BookingSimpleModern() {
    const containerRef = useRef<HTMLDivElement>(null);

    useGSAP(
        () => {
            gsap.to(".bg-massive-text", {
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: 1,
                },
                y: 100,
            });
        },
        { scope: containerRef }
    );

    return (
        <section
            id="contact"
            ref={containerRef}
            className="relative w-full bg-white py-24 md:py-32 z-0 border-t border-slate-100 overflow-hidden"
        >
            {/* Massive Background Text Watermark */}
            <div className="bg-massive-text absolute top-0 left-1/2 -translate-x-1/2 text-[18vw] font-display font-black leading-none tracking-widest text-slate-200/60 select-none whitespace-nowrap -z-10 pointer-events-none">
                CONTACT
            </div>

            <div className="max-w-7xl mx-auto w-full px-4 sm:px-8 lg:px-12 relative z-10">

                {/* --- HEADER --- */}
                <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
                    <div className="w-full md:w-1/2">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="h-px w-8 bg-primary-500" />
                            <span className="text-primary-600 font-bold tracking-[0.25em] text-xs uppercase">
                                Begin Your Journey
                            </span>
                        </div>
                        <h2 className="text-4xl md:text-5xl lg:text-7xl font-black uppercase tracking-tight text-slate-900 leading-[1.05]">
                            Reserve <br />
                            <span className="text-primary-600 italic font-serif font-light pr-2">Your Sanctuary</span>
                        </h2>
                    </div>

                    <div className="w-full md:w-1/3">
                        <p className="text-slate-600 leading-relaxed font-light border-l border-primary-500 pl-6">
                            Submit your desired dates below. Our dedicated concierge team will contact you within 24 hours to craft your bespoke Sri Lankan itinerary.
                        </p>
                    </div>
                </div>

                {/* --- SIMPLE MODERN 2-COLUMN GRID --- */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">

                    {/* --- LEFT COLUMN: VISUAL & MAP --- */}
                    <div className="lg:col-span-5 flex flex-col gap-8 w-full">

                        {/* Cinematic Image Frame */}
                        <div className="relative w-full h-105 lg:h-120 overflow-hidden bg-slate-900 shadow-2xl rounded-[2.5rem] group">
                            <img
                                src="/ContactCover.jpg"
                                alt="Luxury Eco Lodge Sunset"
                                className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1.2s] ease-in-out"
                            />
                            {/* Night view fades in on hover */}
                            <img
                                src="/ContactCoverNight.png"
                                alt="Luxury Eco Lodge Night"
                                className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-all duration-[1.2s] ease-in-out"
                            />
                            {/* Museum-frame corner brackets */}
                            {["top-6 left-6 border-t border-l", "top-6 right-6 border-t border-r", "bottom-6 left-6 border-b border-l", "bottom-6 right-6 border-b border-r"].map((pos) => (
                                <div key={pos} className={`absolute w-8 h-8 border-primary-400/80 z-10 ${pos}`} />
                            ))}
                            <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent pointer-events-none" />
                            <div className="absolute bottom-8 left-8 text-white">
                                <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-primary-400 mb-1">
                                    Central Province, Sri Lanka
                                </p>
                                <h3 className="text-2xl font-serif font-bold">
                                    Randeniya Lake Lodge
                                </h3>
                            </div>
                        </div>

                        {/* Interactive Map Banner */}
                        <div className="relative w-full h-60 rounded-4xl overflow-hidden border border-slate-200 bg-slate-100 shadow-sm group">
                            <div className="absolute inset-0 z-10 transition-all duration-700 grayscale-[0.5] contrast-115 opacity-90 group-hover:grayscale-0 group-hover:opacity-100">
                                <iframe
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7636.145552082115!2d80.65095490954748!3d7.909722404931427!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3afca4e86253aab1%3A0x8aad0918f60149e1!2sRandeniya%20Wewa!5e1!3m2!1sen!2slk!4v1787039794926!5m2!1sen!2slk"
                                    className="w-full h-full border-0"
                                    allowFullScreen={false}
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                />
                            </div>
                            <div className="absolute top-4 left-4 z-20 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full border border-slate-200 text-[9px] font-bold uppercase tracking-widest text-slate-900 pointer-events-none shadow-sm">
                                Randeniya Wewa
                            </div>
                        </div>

                    </div>

                    {/* --- RIGHT COLUMN: MODERN BOX FORM --- */}
                    <div className="lg:col-span-7 bg-slate-50 border border-slate-200/80 rounded-[2.5rem] p-8 md:p-12 shadow-xl shadow-slate-900/5">
                        <ReservationForm />
                    </div>

                </div>

            </div>
        </section>
    );
}
