"use client";

import { useState, useEffect } from "react";
import { Menu, X, ArrowRight } from "lucide-react";
import Image from "next/image";

const NAV_LINKS = [
  { href: "#home", label: "Home" },
  { href: "#about", label: "Our Story" },
  { href: "#rooms", label: "Rooms & Suites" },
  { href: "#amenities", label: "Amenities" },
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

      // Track active section
      const sections = NAV_LINKS.map(link => link.href.slice(1));
      let currentSection = "home";

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          // If the top of the section is near the top of the viewport
          if (rect.top <= 120 && rect.bottom >= 120) {
            currentSection = section;
            break;
          }
        }
      }
      setActiveSection(currentSection);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 max-w-7xl mx-auto ${isScrolled
        ? "bg-stone-950/45 rounded-full backdrop-blur-md border-b border-stone-800/30 py-4 mt-2"
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
        <nav className="hidden md:flex items-center space-x-8">
          {NAV_LINKS.map((link) => {
            const isActive = activeSection === link.href.slice(1);
            return (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleLinkClick(e, link.href)}
                className={`relative text-xs tracking-widest uppercase font-bold text-white transition-colors duration-300 hover:text-accent`}
              >
                {link.label}
                {/* Underline transition */}
                <span
                  className={`absolute -bottom-1.5 left-1/2 -translate-x-1/2 h-0.5 bg-accent transition-all duration-300 ${isActive ? "w-full opacity-100" : "w-0 opacity-0 hover:w-full hover:opacity-100"
                    }`}
                />
              </a>
            );
          })}
        </nav>

        {/* Action Button */}
        <div className="hidden md:block">
          <a
            href="#contact"
            onClick={(e) => handleLinkClick(e, "#contact")}
            className="inline-flex items-center space-x-2 bg-accent hover:bg-amber-400 text-zinc-950 px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-300 transform hover:scale-105"
          >
            <span>Book A Stay</span>
            <ArrowRight size={14} />
          </a>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-zinc-300 hover:text-white transition-colors"
          aria-label="Toggle Menu"
        >
          {isOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      <div
        className={`fixed inset-0 top-18.25 bg-zinc-950/95 backdrop-blur-lg z-40 transition-all duration-500 md:hidden ${isOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-full pointer-events-none"
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
                className={`text-2xl font-serif tracking-widest transition-colors ${isActive ? "text-accent" : "text-zinc-300 hover:text-white"
                  }`}
              >
                {link.label}
              </a>
            );
          })}
          <a
            href="#contact"
            onClick={(e) => handleLinkClick(e, "#contact")}
            className="mt-4 inline-flex items-center space-x-2 bg-accent text-zinc-950 px-8 py-3.5 rounded-full text-sm font-semibold uppercase tracking-wider transition-all duration-300"
          >
            <span>Book A Stay</span>
            <ArrowRight size={16} />
          </a>
        </nav>
      </div>
    </header>
  );
}
