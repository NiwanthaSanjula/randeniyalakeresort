"use client";

import { useRef } from "react";
import { Compass, Star, ShieldCheck, Leaf, Trees, Award } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function AboutSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // 1. Parallax for the massive background "OUR STORY" text
      gsap.to(".bg-massive-text", {
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
        y: 100,
      });

      // 2. Reveal Header Elements
      gsap.from(".header-reveal", {
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
        },
        y: 40,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: "power3.out",
      });

      // 3. Staggered reveal for the bento grid cards
      gsap.from(".bento-card", {
        scrollTrigger: {
          trigger: ".bento-wrapper",
          start: "top 80%",
        },
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power4.out",
      });
    },
    { scope: containerRef }
  );

  return (
    <section
      ref={containerRef}
      id="about"
      className="relative min-h-dvh max-w-7xl mx-auto w-full bg-slate-50 py-24 px-4 sm:px-8 lg:px-12 overflow-hidden z-0 flex flex-col justify-center"
    >
      {/* Massive Background Text (Light Theme Watermark) */}
      <div className="bg-massive-text absolute top-0 left-1/2 -translate-x-1/2 text-[18vw] font-display font-black leading-none tracking-widest text-slate-200/60 select-none whitespace-nowrap -z-10 pointer-events-none">
        OUR STORY
      </div>

      <div className="max-w-7xl mx-auto w-full relative z-10">

        {/* --- TOP HEADER SECTION --- */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-10">
          <div className="w-full md:w-3/5 header-reveal">
            <div className="flex items-center gap-4 mb-4">
              <div className="h-px w-12 bg-primary-600" />
              <span className="text-primary-700 font-bold tracking-widest text-sm uppercase">
                Est. 2026
              </span>
            </div>
            <h2 className="text-5xl md:text-7xl font-black leading-[1.05] uppercase tracking-tight text-slate-900">
              Crafting <br />
              <span className="text-primary-600 italic font-serif pr-2">Lakeside</span> <br />
              Serenity
            </h2>
          </div>

          <div className="w-full md:w-2/5 pb-2 header-reveal">
            <p className="text-slate-600 leading-relaxed text-sm md:text-base border-l-3 border-primary-500 pl-6">
              What started as a vision for sustainable luxury hidden in nature has grown into a haven for peace seekers. True hospitality is our passion, blending raw natural beauty, eco-friendly bamboo architecture, and memories shared by the water.
            </p>
          </div>
        </div>

        {/* --- BENTO GRID SECTION --- */}
        <div className="bento-wrapper grid grid-cols-1 lg:grid-cols-12 gap-4">

          {/* Left Column: Large Highlight Card (Matches the Chef Image) */}
          <div className="bento-card lg:col-span-5 rounded-xl overflow-hidden relative shadow-lg group min-h-100 lg:min-h-150 bg-slate-200">
            {/* Replace src with your building/resort image */}
            <Image
              src="/aboutSunriseNew.jpg"
              alt="Bamboo Architecture"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              priority // Add this ONLY to the main hero/top images so they load instantly
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 p-8 w-full">
              <span className="text-amber-400 text-[10px] font-bold tracking-widest uppercase block mb-2">
                Our Sanctuary
              </span>
              <h3 className="text-white text-2xl md:text-3xl font-bold leading-tight">
                Where every sunrise <br /> tells a story
              </h3>
            </div>
          </div>

          {/* Right Column: Grid Details */}
          <div className="lg:col-span-7 flex flex-col gap-4">

            {/* Top Row: Split Images & Badges (Matches Salad & Yellow Badge) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 h-auto sm:h-64">

              {/* Image Card */}
              <div className="bento-card rounded-xl overflow-hidden relative shadow-md group bg-slate-200 min-h-50 sm:min-h-0">
                {/* Replace src with food/lake activity image */}
                <Image
                  src="/freshExperianceAboutBG.jpg"
                  alt="Fresh Experiences"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-linear-to-t from-slate-900/70 to-transparent" />
                <div className="absolute bottom-5 left-5">
                  <span className="text-white font-bold text-sm tracking-wide">Fresh Experiences</span>
                </div>
              </div>

              {/* Badge Card (Using Emerald for light theme elegance with orbital text rotation) */}
              <div className="bento-card rounded-xl bg-primary-600 p-8 flex items-center justify-center shadow-md relative overflow-hidden text-center min-h-50 sm:min-h-0 group cursor-pointer">
                {/* Decorative concentric thin rings */}

                <div className="absolute w-40 h-40 border border-primary-500/50 rounded-full scale-105 transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute w-48 h-48 border border-primary-500/50 rounded-full scale-110 transition-transform duration-700 group-hover:scale-115" />

                {/* Spinning Circular Text Orbit (Enlarged to 82px radius to prevent center overlap) */}
                <div className="absolute inset-0 flex items-center justify-center animate-spin-slow pointer-events-none select-none scale-100 group-hover:scale-105 transition-transform duration-700 z-0">
                  <svg className="w-full h-full max-w-52.5 max-h-52.5" viewBox="0 0 200 200">
                    <path
                      id="ecoTextCirclePath"
                      d="M 100,100 m -82,0 a 82,82 0 1,1 164,0 a 82,82 0 1,1 -164,0"
                      fill="none"
                    />
                    <text className="text-[7.5px] font-sans font-bold uppercase tracking-[0.27em] fill-primary-200/50">
                      <textPath href="#ecoTextCirclePath" startOffset="0%">
                        ECO-LUXE DESIGN • EST. 2026 • 100% SUSTAINABLE •
                      </textPath>
                    </text>
                  </svg>
                </div>

                {/* Center Content */}
                <div className="relative z-10 flex flex-col items-center">
                  <Leaf className="text-primary-200 w-8 h-8 mb-2 transform group-hover:scale-110 transition-transform duration-500" />
                  <h4 className="text-4xl lg:text-5xl font-black text-white leading-none">100%</h4>
                  <p className="text-primary-950 font-bold tracking-widest uppercase text-[10px] mt-2">
                    Eco-Luxe Design
                  </p>
                </div>
              </div>

            </div>

            {/* Middle Row: 3 Feature Cards (Matches Farm-to-Table, Master Chefs, etc.) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

              <div className="bento-card bg-white rounded-xl p-6 shadow-md border border-slate-100 flex flex-col hover:shadow-md transition-shadow relative overflow-hidden group">
                <Trees className="absolute -right-3.75 -bottom-5 w-24 h-24 text-amber-500/8 pointer-events-none select-none z-0 transform group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500" />
                <div className="relative z-10">
                  <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center mb-4">
                    <Trees className="w-5 h-5" />
                  </div>
                  <h5 className="font-bold text-slate-900 mb-1 text-sm lg:text-base">Guided Trails</h5>
                  <p className="text-[11px] lg:text-xs text-slate-500 leading-relaxed">
                    Every path traced to its origin. No shortcuts, just pure connection to nature.
                  </p>
                </div>
              </div>

              <div className="bento-card bg-white rounded-xl p-6 shadow-md border border-slate-100 flex flex-col hover:shadow-md transition-shadow relative overflow-hidden group">
                <ShieldCheck className="absolute -right-3.75 -bottom-5 w-24 h-24 text-primary-500/8 pointer-events-none select-none z-0 transform group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500" />
                <div className="relative z-10">
                  <div className="w-10 h-10 bg-primary-50 text-primary-600 rounded-xl flex items-center justify-center mb-4">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <h5 className="font-bold text-slate-900 mb-1 text-md lg:text-base">Zero Impact</h5>
                  <p className="text-[11px] lg:text-xs text-slate-500 leading-relaxed">
                    Our sanctuary is built with sustainable, zero-impact bamboo architecture.
                  </p>
                </div>
              </div>

              <div className="bento-card bg-white border-l-4 border-l-white rounded-xl p-6 shadow-md border border-slate-100 flex flex-col hover:shadow-md transition-shadow relative overflow-hidden group">
                <Star className="absolute -right-3.75 -bottom-5 w-24 h-24 text-blue-500/8 pointer-events-none select-none z-0 transform group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500" />
                <div className="relative z-10">
                  <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-4">
                    <Star className="w-5 h-5" />
                  </div>
                  <h5 className="font-bold text-slate-900 mb-1 text-sm lg:text-base">Timeless Comfort</h5>
                  <p className="text-[11px] lg:text-xs text-slate-500 leading-relaxed">
                    Rooted in local tradition, elevated with modern lakeside technique and amenities.
                  </p>
                </div>
              </div>

            </div>

            {/* Bottom Row: Stats Summary */}
            <div className="bento-card border-l-4 border-l-primary-500 bg-neutral-900 rounded-xl p-6 shadow-md border border-slate-100 flex flex-wrap justify-between items-center gap-4 text-center">
              <div className="flex-1 min-w-20">
                <h6 className="text-2xl lg:text-3xl font-black text-primary-600">12+</h6>
                <p className="text-[9px] lg:text-[10px] uppercase tracking-widest text-slate-400 font-bold mt-1">Luxury Villas</p>
              </div>
              <div className="w-px h-8 bg-slate-100 hidden sm:block" />

              <div className="flex-1 min-w-20">
                <h6 className="text-2xl lg:text-3xl font-black text-amber-500">20+</h6>
                <p className="text-[9px] lg:text-[10px] uppercase tracking-widest text-slate-400 font-bold mt-1">Acres of Nature</p>
              </div>
              <div className="w-px h-8 bg-slate-100 hidden sm:block" />

              <div className="flex-1 min-w-20">
                <h6 className="text-2xl lg:text-3xl font-black text-slate-300">5.0</h6>
                <p className="text-[9px] lg:text-[10px] uppercase tracking-widest text-slate-400 font-bold mt-1">Star Rating</p>
              </div>
              <div className="w-px h-8 bg-slate-100 hidden sm:block" />

              <div className="flex-1 min-w-20">
                <h6 className="text-2xl lg:text-3xl font-black text-slate-300">24/7</h6>
                <p className="text-[9px] lg:text-[10px] uppercase tracking-widest text-slate-400 font-bold mt-1">Concierge</p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}