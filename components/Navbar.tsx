"use client";

import { useState, useEffect } from "react";
import { Menu, X, ArrowRight } from "lucide-react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const NAV_LINKS = [
  { href: "#home", label: "Home" },
  { href: "#about", label: "Our Story" },
  { href: "#villas", label: "Rooms & Suites" },
  { href: "#experiences", label: "Experiences" },
  { href: "#testimonials", label: "Testimonials" },
  { href: "#contact", label: "Contact" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    const handleScroll = () => {
      // Background opacity change on scroll
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useGSAP(() => {
    const timer = setTimeout(() => {
      NAV_LINKS.forEach((link) => {
        const id = link.href.slice(1);
        const element = document.getElementById(id);
        if (element) {
          ScrollTrigger.create({
            trigger: element,
            start: "top 30%",
            end: "bottom 30%",
            onToggle: (self) => {
              if (self.isActive) {
                setActiveSection(id);
              }
            },
          });
        }
      });
      ScrollTrigger.refresh();
    }, 100);

    return () => clearTimeout(timer);
  });

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setIsOpen(false);
    const targetId = href.slice(1);
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      const offset = 80; // height of the navbar
      const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({
        top: targetPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 max-w-7xl mx-auto ${isScrolled
          ? "bg-stone-950/90 lg:bg-stone-950/45 lg:rounded-full backdrop-blur-md border-b border-stone-800/30 py-4 lg:mt-2"
          : "bg-transparent py-6"
          }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
          {/* Logo */}
          <a href="#home" className="flex items-center group">
            <Image
              src="/randeniyaLogo.png"
              alt="Randeniya Lake Resort Logo"
              width={160}
              height={48}
              className="h-10 w-auto object-contain transition-transform duration-300 group-hover:scale-105 filter brightness-100"
              priority
            />
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-8">
            {NAV_LINKS.map((link) => {
              const isActive = activeSection === link.href.slice(1);
              return (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleLinkClick(e, link.href)}
                  className={`relative text-xs tracking-widest uppercase font-bold text-white transition-colors duration-300 hover:text-primary`}
                >
                  {link.label}
                  {/* Underline transition */}
                  <span
                    className={`absolute -bottom-1.5 left-1/2 -translate-x-1/2 h-0.5 bg-primary transition-all duration-300 ${isActive ? "w-full opacity-100" : "w-0 opacity-0 hover:w-full hover:opacity-100"
                      }`}
                  />
                </a>
              );
            })}
          </nav>

          {/* Action Button */}
          <div className="hidden lg:block">
            <a
              href="#contact"
              onClick={(e) => handleLinkClick(e, "#contact")}
              className="inline-flex items-center space-x-2 bg-primary hover:bg-primary-600 text-white px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-300 transform hover:scale-105 shadow-sm shadow-black/50"
            >
              <span>Book A Stay</span>
              <ArrowRight size={14} />
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden text-zinc-300 hover:text-white transition-colors"
            aria-label="Toggle Menu"
          >
            {isOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer */}
      <div
        className={`fixed inset-0 bg-zinc-950/95 backdrop-blur-lg z-40 transition-all duration-500 lg:hidden ${isOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-full pointer-events-none"
          }`}
      >
        <nav className="flex flex-col items-center justify-center h-[calc(100vh-80px)] space-y-8 px-6 text-center">
          {NAV_LINKS.map((link) => {
            const isActive = activeSection === link.href.slice(1);
            return (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleLinkClick(e, link.href)}
                className={`text-2xl font-serif tracking-widest transition-colors ${isActive ? "text-primary" : "text-zinc-300 hover:text-white"
                  }`}
              >
                {link.label}
              </a>
            );
          })}
          <a
            href="#contact"
            onClick={(e) => handleLinkClick(e, "#contact")}
            className="mt-4 inline-flex items-center space-x-2 bg-primary text-white px-8 py-3.5 rounded-full text-sm font-semibold uppercase tracking-wider transition-all duration-300"
          >
            <span>Book A Stay</span>
            <ArrowRight size={16} />
          </a>
        </nav>
      </div>
    </>
  );
}
