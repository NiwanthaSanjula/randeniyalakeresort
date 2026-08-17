"use client";

import { useState, useEffect, useRef } from "react";
import { Star, Compass, Wind } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register ScrollTrigger on client-side
gsap.registerPlugin(ScrollTrigger);

const HEADLINES = [
  "FIND YOUR PEACE",
  "ESCAPE THE NOISE",
  "SEEK THE WILD"
];

export default function Hero() {
  const [textIndex, setTextIndex] = useState(0);
  
  // Outer containers (controlled by ScrollTrigger)
  const containerRef = useRef<HTMLDivElement>(null);
  const skyRef = useRef<HTMLImageElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const villaRef = useRef<HTMLImageElement>(null);
  const descOuterRef = useRef<HTMLDivElement>(null);
  const cardsOuterRef = useRef<HTMLDivElement>(null);

  // Inner wrappers (controlled by Initial Entrance Timeline)
  const descInnerRef = useRef<HTMLDivElement>(null);
  const cardsInnerRef = useRef<HTMLDivElement>(null);

  /**
   * GSAP hook for initial entrance animations and scroll-based parallax.
   */
  useGSAP(() => {
    // 1. INITIAL POSITION SETUP FOR LOAD-IN
    // Hide inner UI components to prepare for staggered load-in
    gsap.set([descInnerRef.current, cardsInnerRef.current], { opacity: 0, y: 30 });
    
    // Set up display text position (starting slightly lower to slide up)
    gsap.set(textRef.current, { opacity: 0, y: 120, scale: 0.92 });
    
    // Zoom in background sky for Ken Burns effect
    gsap.set(skyRef.current, { scale: 1.15, opacity: 0 });
    
    // Position foreground villa offset for reveal
    gsap.set(villaRef.current, { y: 60, opacity: 0 });

    // 2. ENTRANCE TIMELINE
    const entranceTimeline = gsap.timeline({ delay: 0.1 });

    entranceTimeline
      .to(skyRef.current, {
        opacity: 1,
        scale: 1,
        duration: 1.8,
        ease: "power3.out",
      })
      .to(villaRef.current, {
        opacity: 1,
        y: 0,
        duration: 1.6,
        ease: "power4.out",
      }, "-=1.3")
      .to(textRef.current, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1.5,
        ease: "power4.out",
      }, "-=1.1")
      .to([descInnerRef.current, cardsInnerRef.current], {
        opacity: 1,
        y: 0,
        duration: 1.0,
        stagger: 0.15,
        ease: "power3.out",
      }, "-=0.6");

    // 3. MORE POWERFUL PARALLAX SCROLL TIMELINE (Linked to scrollbar position)
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
      // Sky moves down faster to emphasize height/distance (35% speed)
      .to(skyRef.current, {
        yPercent: 35,
        ease: "none",
      }, 0)
      // Display text moves up significantly faster (65% speed) to create deep separation
      .to(textRef.current, {
        yPercent: -65,
        scale: 0.90,
        ease: "none",
      }, 0)
      // Foreground villa moves up slowly (12% speed), keeping layered overlap visible
      .to(villaRef.current, {
        yPercent: -12,
        ease: "none",
      }, 0)
      // Fade out the outer overlay description and cards as the page scrolls down
      .to([descOuterRef.current, cardsOuterRef.current], {
        opacity: 0,
        yPercent: -20,
        ease: "none",
      }, 0);

  }, { scope: containerRef });

  /**
   * Effect to auto-rotate display headings with vertical sliding transitions.
   */
  useEffect(() => {
    const textSelector = textRef.current?.querySelector("h1");
    
    const interval = setInterval(() => {
      const nextIndex = (textIndex + 1) % HEADLINES.length;

      if (textSelector) {
        // Slide current phrase up and fade out
        gsap.to(textSelector, {
          y: -50,
          opacity: 0,
          duration: 0.5,
          ease: "power2.in",
          onComplete: () => {
            setTextIndex(nextIndex);
            // Pre-position next phrase below viewport
            gsap.set(textSelector, { y: 50 });
            // Slide in next phrase
            gsap.to(textSelector, {
              y: 0,
              opacity: 1,
              duration: 0.75,
              ease: "power2.out",
            });
          }
        });
      } else {
        setTextIndex(nextIndex);
      }
    }, 4500); // Transitions every 4.5 seconds

    return () => clearInterval(interval);
  }, [textIndex]);

  return (
    <section
      ref={containerRef}
      id="home"
      className="relative w-full min-h-[950px] md:min-h-0 md:h-screen overflow-hidden bg-stone-50 select-none flex flex-col justify-end"
    >
      {/* LAYER 1: SKY BACKGROUND (Bottom-most Layer) */}
      <img
        ref={skyRef}
        src="/hero_sky.jpg"
        alt="Highland Sky"
        className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none z-0"
      />

      {/* LAYER 2: ROTATING BIG TEXT (Middle Layer behind Villa) */}
      <div
        ref={textRef}
        className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 mt-[-20vh] md:mt-[-15vh]"
      >
        <h1 className="font-display text-white text-[15vw] sm:text-[18vw] md:text-[12vw] leading-none tracking-[0.05em] text-center uppercase select-none whitespace-nowrap drop-shadow-2xl">
          {HEADLINES[textIndex]}
        </h1>
      </div>

      {/* LAYER 3: FOREGROUND VILLAS CUTOUT (Top-middle Layer) */}
      <img
        ref={villaRef}
        src="/hero_villa_II.png"
        alt="Mountain Villas"
        className="absolute -bottom-20 left-0 w-full h-full object-cover object-bottom pointer-events-none select-none z-20"
      />

      {/* LAYER 4: BOTTOM GRADIENT OVERLAY (Blends hills base into white #about section) */}
      <div className="absolute bottom-0 left-0 right-0 h-[30vh] bg-gradient-to-t from-stone-50 via-stone-50/50 to-transparent pointer-events-none z-25" />

      {/* LAYER 5: TEXT & CARDS UI OVERLAYS (Top-most Layers, side-by-side flex layout) */}
      <div className="relative z-30 flex flex-col md:flex-row justify-between items-end gap-8 px-6 md:px-12 pb-12 w-full">
        
        {/* Left Column: Description & Eco-Card */}
        <div
          ref={descOuterRef}
          className="flex flex-col space-y-4 w-full md:max-w-md text-left"
        >
          {/* Inner wrapper targets entrance animation separately to avoid scrub conflicts */}
          <div ref={descInnerRef} className="space-y-4">
            <div className="h-[3px] w-12 bg-accent rounded" />
            <p className="text-zinc-100 md:text-zinc-200 font-sans font-light text-sm sm:text-base leading-relaxed drop-shadow-md">
              Disconnect from the noise. Discover our architecturally designed A-frame cabins hidden within the central highlands. Your secluded mountain sanctuary awaits, surrounded by thousand-year-old redwood pines, soothing natural geothermal springs, and endless paths of raw mountain hiking trails.
            </p>

            {/* Bottom Left Card: Eco details */}
            <div className="w-full p-4 rounded-2xl bg-white/95 backdrop-blur-md shadow-2xl border border-white/20 flex flex-col justify-between transition-all duration-300 hover:scale-[1.02] cursor-pointer text-zinc-950">
              <div className="flex items-center space-x-2 text-zinc-900 mb-1">
                <Compass className="w-4 h-4 text-accent animate-spin-slow" />
                <span className="text-[10px] font-bold uppercase tracking-wider font-sans text-zinc-500">100% Eco-Sanctuary</span>
              </div>
              <h3 className="font-serif text-sm font-semibold text-zinc-950">LEED Gold Certified</h3>
              <p className="text-[11px] text-zinc-600 font-sans font-light mt-1">Powered entirely by local geothermal reserves and solar power grids.</p>
            </div>
          </div>
        </div>

        {/* Right Column: Two stacked cards */}
        <div
          ref={cardsOuterRef}
          className="flex flex-col space-y-4 w-full md:w-64"
        >
          {/* Inner wrapper targets entrance animation separately to avoid scrub conflicts */}
          <div ref={cardsInnerRef} className="space-y-4">
            
            {/* Card 1: Weather Details */}
            <div className="w-full p-4 rounded-2xl bg-white/95 backdrop-blur-md shadow-2xl border border-white/20 flex flex-col justify-between transition-all duration-300 hover:scale-[1.02] cursor-pointer text-zinc-950">
              <div className="flex items-center space-x-2 text-zinc-900 mb-1">
                <Wind className="w-4 h-4 text-accent" />
                <span className="text-[10px] font-bold uppercase tracking-wider font-sans text-zinc-500">Weather & Air Quality</span>
              </div>
              <h3 className="font-serif text-sm font-semibold text-zinc-950">Big Sur Highlands</h3>
              <p className="text-[11px] text-zinc-600 font-sans font-light mt-1">74°F / 23°C • PM2.5: Excellent. Crisp mountain breezes with full hiking visibility.</p>
            </div>

            {/* Card 2: Suite Availability */}
            <div className="w-full p-4 rounded-2xl bg-white/95 backdrop-blur-md shadow-2xl border border-white/20 flex flex-col justify-between transition-all duration-300 hover:scale-[1.02] text-zinc-950">
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-[9px] uppercase tracking-widest text-zinc-500 block font-medium">Availability</span>
                  <span className="text-lg font-serif font-bold text-zinc-900">Only 2 Left<span className="text-xs text-zinc-500 font-sans font-light"> / August</span></span>
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
