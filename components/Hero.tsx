"use client";

import { useState, useEffect, useRef } from "react";
import { Star, Compass, Wind } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Safe client-side registration of ScrollTrigger to prevent SSR/hydration crashes
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Updated headlines to match the serene lake concept
const HEADLINES = [
  "STILL THE MIND",
  "MEET THE WATER",
  "FIND YOUR EDGE"
];

export default function Hero() {
  const [textIndex, setTextIndex] = useState(0);

  // Container References
  const containerRef = useRef<HTMLDivElement>(null);

  // Outer Wrappers (Strictly animated by ScrollTrigger scrub timeline)
  const skyOuterRef = useRef<HTMLDivElement>(null);
  const textOuterRef = useRef<HTMLDivElement>(null);
  const villaOuterRef = useRef<HTMLDivElement>(null);
  const descOuterRef = useRef<HTMLDivElement>(null);
  const cardsOuterRef = useRef<HTMLDivElement>(null);

  // Inner Elements (Strictly animated by Initial Entrance Timeline)
  const skyRef = useRef<HTMLImageElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const villaRef = useRef<HTMLImageElement>(null);
  const descInnerRef = useRef<HTMLDivElement>(null);
  const cardsInnerRef = useRef<HTMLDivElement>(null);

  /**
   * GSAP Hook to orchestrate load-in entrance animations and scroll-based parallax.
   * Uses separate nested wrapper selectors to completely eliminate target value conflicts.
   */
  useGSAP(() => {
    // 1. INITIAL SCENE POSITIONS
    // Hide UI components for clean staggered entry
    gsap.set([descInnerRef.current, cardsInnerRef.current], { opacity: 0, y: 40 });

    // Position inner text container lower to slide it up
    gsap.set(textRef.current, { opacity: 0, y: 100, scale: 0.95 });

    // Zoom in background image for entrance reveal
    gsap.set(skyRef.current, { scale: 1.15, opacity: 0 });

    // Drop foreground villa slightly lower
    gsap.set(villaRef.current, { y: 80, opacity: 0 });

    // 2. ENTRANCE REVEAL TIMELINE
    const entranceTimeline = gsap.timeline({ delay: 0.15 });

    entranceTimeline
      .to(skyRef.current, {
        opacity: 1,
        scale: 1,
        duration: 1.6,
        ease: "power3.out",
      })
      .to(villaRef.current, {
        opacity: 1,
        y: 0,
        duration: 1.4,
        ease: "power4.out",
      }, "-=1.1")
      .to(textRef.current, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1.3,
        ease: "power4.out",
      }, "-=0.9")
      .to([descInnerRef.current, cardsInnerRef.current], {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.12,
        ease: "power3.out",
      }, "-=0.5");

    // 3. SCROLL-LINKED PARALLAX TIMELINE
    // Targets outer wrappers only, ensuring zero collision with inner entrance states
    const parallaxTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "bottom top",
        scrub: true,
        invalidateOnRefresh: true,
      },
    });

    parallaxTimeline
      // Sky moves down at 35% velocity
      .to(skyOuterRef.current, {
        yPercent: 35,
        ease: "none",
      }, 0)
      // Display text moves up rapidly at 65% velocity
      .to(textOuterRef.current, {
        yPercent: -65,
        ease: "none",
      }, 0)
      // Foreground villa moves up slowly at 12% velocity
      .to(villaOuterRef.current, {
        yPercent: -12,
        ease: "none",
      }, 0)
      // Fade out left/right overlay card wrapper columns
      .to([descOuterRef.current, cardsOuterRef.current], {
        opacity: 0,
        yPercent: -15,
        ease: "none",
      }, 0);

  }, { scope: containerRef });

  /**
   * Interval timer to cycle through display heading phrases.
   * Animates the inner h1 tag with clean slide-up/down crossfades.
   */
  useEffect(() => {
    const textSelector = textRef.current?.querySelector("h1");

    const interval = setInterval(() => {
      const nextIndex = (textIndex + 1) % HEADLINES.length;

      if (textSelector) {
        // Slide out current phrase up and fade out
        gsap.to(textSelector, {
          y: -40,
          opacity: 0,
          duration: 0.45,
          ease: "power2.in",
          onComplete: () => {
            setTextIndex(nextIndex);
            // Position next phrase below
            gsap.set(textSelector, { y: 40 });
            // Slide in new phrase
            gsap.to(textSelector, {
              y: 0,
              opacity: 1,
              duration: 0.7,
              ease: "power2.out",
            });
          }
        });
      } else {
        setTextIndex(nextIndex);
      }
    }, 4500);

    return () => clearInterval(interval);
  }, [textIndex]);

  return (
    <section
      ref={containerRef}
      id="home"
      className="relative w-full min-h-dvh md:min-h-0 md:h-screen overflow-hidden bg-stone-50 select-none flex flex-col justify-end"
    >
      {/* LAYER 1: SKY BACKGROUND OUTER WRAPPER */}
      <div ref={skyOuterRef} className="absolute inset-0 w-full h-full pointer-events-none select-none z-0">
        <img
          ref={skyRef}
          src="/hero_sky.jpg" // Make sure to swap this with a beautiful sky/lake backdrop
          alt="Lakeside Sky"
          className="w-full h-full object-cover"
        />
      </div>

      {/* LAYER 2: BIG HEADING TEXT OUTER WRAPPER */}
      <div
        ref={textOuterRef}
        className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 mt-[-20vh] md:mt-[-15vh]"
      >
        <div ref={textRef} className="w-full text-center">
          <h1 className="font-display mb-25 md:mb-45 text-[16vw] sm:text-[18vw] md:text-[14vw] leading-none tracking-wider uppercase drop-shadow-2xl bg-linear-to-b from-white via-white/80 to-transparent bg-clip-text text-transparent">
            {HEADLINES[textIndex]}
          </h1>
        </div>
      </div>

      {/* LAYER 3: FOREGROUND VILLAS OUTER WRAPPER */}
      <div ref={villaOuterRef} className="absolute inset-0 w-full h-full pointer-events-none select-none z-20">
        <img
          ref={villaRef}
          src="/hero_resort.png" // Make sure this image matches the bamboo/lake architecture
          alt="Lakefront Villas"
          className="absolute bottom-10 md:-bottom-25 left-0 w-full h-full object-cover object-bottom"
        />
      </div>

      {/* LAYER 4: BOTTOM GRADIENT OVERLAY */}
      <div className="absolute bottom-0 left-0 right-0 h-[30vh] bg-linear-to-t from-stone-50 via-stone-50/50 to-transparent pointer-events-none z-20" />

      {/* LAYER 5: TEXT & CARDS UI OVERLAYS */}
      <div className="relative max-w-7xl mx-auto z-30 flex flex-col md:flex-row justify-between items-end gap-8 px-6 md:px-12 pb-12 w-full">

        {/* Left Column: Description & Eco-Card Wrapper */}
        <div
          ref={descOuterRef}
          className="flex flex-col space-y-4 w-full md:max-w-md text-left"
        >
          {/* Inner target for initial entrance timeline */}
          <div ref={descInnerRef} className="space-y-4">
            <div className="h-1 w-12 bg-emerald-600 rounded" />
            <p className="text-zinc-100 md:text-zinc-200 font-sans font-bold text-sm sm:text-base leading-relaxed drop-shadow-md">
              Disconnect from the noise. Discover our architecturally designed lakefront villas perched perfectly on the water's edge. Your serene sanctuary awaits, surrounded by lush tropical canopy, mirrored waters, and the gentle rhythm of nature.
            </p>

            {/* Bottom Left Card: Eco Details */}
            <div className="w-full p-4 rounded-2xl bg-white/95 border-l-4 border-l-emerald-600 backdrop-blur-md shadow-2xl border border-white/20 flex flex-col justify-between transition-all duration-300 hover:scale-[1.02] cursor-pointer text-zinc-950">
              <div className="flex items-center space-x-2 text-zinc-900 mb-1">
                <Compass className="w-4 h-4 text-emerald-600 animate-spin-slow" />
                <span className="text-[10px] font-bold uppercase tracking-wider font-sans text-stone-500">Eco-Luxe Design</span>
              </div>
              <h3 className="font-serif text-sm font-semibold text-zinc-950">Sustainable Retreat</h3>
              <p className="text-[11px] text-zinc-600 font-sans font-light mt-1">Constructed with locally sourced bamboo and powered by solar, preserving the delicate balance of our tranquil lake ecosystem.</p>
            </div>
          </div>
        </div>

        {/* Right Column: Two stacked cards Wrapper */}
        <div
          ref={cardsOuterRef}
          className="flex flex-col space-y-4 w-full md:w-64"
        >
          {/* Inner target for initial entrance timeline */}
          <div ref={cardsInnerRef} className="space-y-4">

            {/* Card 1: Weather Details */}
            <div className="w-full p-4 rounded-2xl bg-white/95 border-l-4 border-l-emerald-600 backdrop-blur-md shadow-2xl border border-white/20 flex flex-col justify-between transition-all duration-300 hover:scale-[1.02] cursor-pointer text-zinc-950">
              <div className="flex items-center space-x-2 text-zinc-900 mb-1">
                <Wind className="w-4 h-4 text-emerald-600" />
                <span className="text-[10px] font-bold uppercase tracking-wider font-sans text-stone-500">Lakeside Climate</span>
              </div>
              <h3 className="font-serif text-sm font-semibold text-zinc-950">Tranquil Waters</h3>
              <p className="text-[11px] text-zinc-600 font-sans font-light mt-1">28°C / 82°F • Gentle water breezes and clear skies. Perfect conditions for morning kayaking or a sunset deck lounge.</p>
            </div>

            {/* Card 2: Suite Availability */}
            <div className="w-full p-4 rounded-2xl bg-white/95 border-l-4 border-l-emerald-600 backdrop-blur-md shadow-2xl border border-white/20 flex flex-col justify-between transition-all duration-300 hover:scale-[1.02] text-zinc-950">
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-[9px] uppercase tracking-widest text-zinc-500 block font-medium">Availability</span>
                  <span className="text-lg font-serif font-bold text-zinc-900">Only 2 Left<span className="text-xs text-zinc-500 font-sans font-light"> / September</span></span>
                </div>
                <a
                  href="#contact"
                  className="px-4 py-2.5 bg-zinc-950 hover:bg-zinc-800 text-white text-[10px] font-semibold uppercase tracking-wider rounded-lg transition-colors font-sans"
                >
                  Reserve Stay
                </a>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}