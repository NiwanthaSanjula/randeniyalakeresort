"use client";

import { Bed, Star, Coffee, Shield, Wifi, Compass, Phone, Mail, MapPin } from "lucide-react";

/**
 * About Section: Renders the brand heritage and history details.
 * Converted to Light Theme: uses white background and stone-900/60 typography.
 */
export function About() {
  return (
    <section id="about" className="py-24 md:py-32 bg-white text-stone-900 relative">
      <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div className="space-y-6">
          <span className="text-accent text-xs font-semibold uppercase tracking-[0.3em] font-sans block">
            Our Heritage
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light tracking-wide leading-tight text-stone-950">
            Designed for the Discerning Traveler
          </h2>
          <p className="text-stone-600 font-sans font-light leading-relaxed">
            Founded with a vision to redefine modern luxury hospitality, Aura Resort & Spa combines local craftsmanship with timeless elegance. Every room, walkway, and garden is thoughtfully sculpted to create a seamless connection with the natural landscape.
          </p>
          <p className="text-stone-600 font-sans font-light leading-relaxed">
            Here, we honor the art of slow living. Whether you are walking through our private organic gardens or relaxing under our poolside canopies, your peace and privacy are our highest commitment.
          </p>
          <div className="pt-4">
            <a
              href="#rooms"
              className="inline-flex items-center space-x-2 text-accent border-b border-accent/30 hover:border-accent hover:text-amber-600 transition-all pb-1 text-sm uppercase tracking-widest font-semibold"
            >
              Discover Aura Experience
            </a>
          </div>
        </div>

        {/* Story Visuals */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-4">
            <div className="aspect-[3/4] rounded-2xl overflow-hidden border border-stone-200 relative group shadow-sm">
              <img
                src="/hero_slide_1.png"
                alt="Bespoke Design Room"
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/40 via-transparent to-transparent opacity-80" />
            </div>
            <div className="aspect-square rounded-2xl overflow-hidden border border-stone-200 relative group shadow-sm">
              <img
                src="/hero_slide_3.png"
                alt="Outdoor dining"
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/40 via-transparent to-transparent opacity-80" />
            </div>
          </div>
          <div className="space-y-4 pt-8">
            <div className="aspect-square rounded-2xl overflow-hidden border border-stone-200 relative group shadow-sm">
              <img
                src="/hero_slide_2.png"
                alt="Infinity Pool View"
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/40 via-transparent to-transparent opacity-80" />
            </div>
            <div className="aspect-[3/4] bg-stone-50 rounded-2xl border border-stone-200 p-8 flex flex-col justify-between shadow-sm">
              <Compass className="w-10 h-10 text-accent animate-spin-slow" />
              <div>
                <p className="font-serif text-3xl text-stone-950 font-light">120+</p>
                <p className="text-stone-500 text-xs uppercase tracking-widest mt-1">Acre Private Reserve</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * Rooms Section: Lists high-end suite categories.
 * Converted to Light Theme: uses stone-50 background and white luxury cards with warm stone-200 borders.
 */
export function Rooms() {
  const ROOMS_DATA = [
    {
      title: "Serene Garden Suite",
      description: "A private terrace overlooking our lush organic gardens with a marble soaking tub.",
      price: "$450",
      image: "/hero_slide_1.png",
      rating: "4.9",
      size: "65 m²",
    },
    {
      title: "Oceanfront Horizon Villa",
      description: "Direct infinity pool access and custom glass balcony panels facing the Pacific sunset.",
      price: "$750",
      image: "/hero_slide_2.png",
      rating: "5.0",
      size: "110 m²",
    },
    {
      title: "Royal Canopy Suite",
      description: "Elevated canopy living with standalone firepit and open-concept luxury layout.",
      price: "$950",
      image: "/hero_slide_3.png",
      rating: "4.9",
      size: "140 m²",
    },
  ];

  return (
    <section id="rooms" className="py-24 md:py-32 bg-stone-50 border-y border-stone-200 text-stone-900 relative">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <span className="text-accent text-xs font-semibold uppercase tracking-[0.3em] font-sans block">
            Refined Living
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light tracking-wide text-stone-950">
            Our Suites & Villas
          </h2>
          <p className="text-stone-600 font-sans font-light leading-relaxed">
            Crafted for ultimate sanctuary. Standard high-speed internet, premium butler services, and custom organic amenities come with every stay.
          </p>
        </div>

        {/* Room Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {ROOMS_DATA.map((room, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl overflow-hidden border border-stone-200/80 hover:border-accent/40 shadow-sm hover:shadow-md transition-all duration-300 group flex flex-col justify-between"
            >
              <div>
                {/* Room Image */}
                <div className="aspect-[4/3] overflow-hidden relative">
                  <img
                    src={room.image}
                    alt={room.title}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs text-stone-900 flex items-center space-x-1 border border-stone-200">
                    <Star size={12} className="fill-accent stroke-accent" />
                    <span className="font-semibold">{room.rating}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-3">
                  <h3 className="font-serif text-xl font-medium text-stone-950 group-hover:text-accent transition-colors duration-300">
                    {room.title}
                  </h3>
                  <p className="text-stone-600 font-sans font-light text-sm leading-relaxed">
                    {room.description}
                  </p>
                  <div className="flex items-center space-x-4 text-xs text-stone-500 font-sans">
                    <span className="flex items-center space-x-1">
                      <Bed size={14} className="text-stone-400" />
                      <span>1 King Bed</span>
                    </span>
                    <span>•</span>
                    <span>{room.size}</span>
                  </div>
                </div>
              </div>

              {/* Price and CTA */}
              <div className="p-6 border-t border-stone-100 flex items-center justify-between bg-stone-50/50">
                <div>
                  <span className="text-[9px] text-stone-500 block uppercase tracking-widest font-sans font-medium">From</span>
                  <span className="text-xl font-serif text-accent font-semibold">{room.price}</span>
                  <span className="text-xs text-stone-400">/night</span>
                </div>
                <a
                  href="#contact"
                  className="bg-stone-900 hover:bg-accent hover:text-stone-950 text-white text-xs font-semibold uppercase tracking-wider py-2.5 px-4 rounded-lg border border-stone-850 hover:border-accent transition-all duration-300"
                >
                  Book Now
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/**
 * Amenities Section: Highlights standard guest comforts.
 * Converted to Light Theme: uses clean white background and warm stone-50 details.
 */
export function Amenities() {
  const AMENITIES = [
    { icon: <Wifi size={24} />, title: "Fiber Wifi", desc: "Symmetrical gigabit connection coverage all across the resort grounds." },
    { icon: <Coffee size={24} />, title: "Bespoke Dining", desc: "Private butler dinners and farm-to-table breakfast crafted with organically sourced ingredients." },
    { icon: <Compass size={24} />, title: "Serene Spa", desc: "Holistic, traditional hot stone therapies and facials under the outdoor canopy." },
    { icon: <Shield size={24} />, title: "Secure Retreat", desc: "Strictly gated entry and dedicated safety teams ensuring complete digital and physical peace." },
  ];

  return (
    <section id="amenities" className="py-24 md:py-32 bg-white text-stone-900 relative">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <span className="text-accent text-xs font-semibold uppercase tracking-[0.3em] font-sans block">
            Exceptional Services
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light tracking-wide text-stone-950">
            Designed for Pure Comfort
          </h2>
          <p className="text-stone-600 font-sans font-light leading-relaxed">
            From arrival to departure, every service is tailored to deliver absolute tranquility. Enjoy the finest comforts in absolute privacy.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {AMENITIES.map((item, idx) => (
            <div
              key={idx}
              className="p-8 bg-stone-50 border border-stone-200/80 rounded-2xl hover:border-accent/25 transition-all duration-300 group hover:bg-stone-100/30 shadow-sm"
            >
              <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-accent mb-6 group-hover:scale-110 transition-transform border border-stone-200 shadow-sm">
                {item.icon}
              </div>
              <h3 className="font-serif text-lg font-medium mb-2 text-stone-950">{item.title}</h3>
              <p className="text-stone-600 font-sans font-light text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/**
 * Contact Section: Handles reservations inquiry form.
 * Converted to Light Theme: uses stone-50 background, white contact form card, and light input fields.
 * React selectdefaultValue warning fixed at line 321.
 */
export function Contact() {
  return (
    <section id="contact" className="py-24 md:py-32 bg-stone-50 border-t border-stone-200 text-stone-900 relative">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          
          {/* Info Side */}
          <div className="space-y-8">
            <div className="space-y-4">
              <span className="text-accent text-xs font-semibold uppercase tracking-[0.3em] font-sans block">
                Connect With Us
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light tracking-wide text-stone-950">
                Start Your Journey
              </h2>
              <p className="text-stone-600 font-sans font-light leading-relaxed max-w-md">
                Our reservations team is available 24/7 to design your custom itinerary or secure villa requests.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center text-accent border border-stone-200 shadow-sm mt-1">
                  <MapPin size={18} />
                </div>
                <div>
                  <h4 className="font-sans font-medium text-sm text-stone-950">Location</h4>
                  <p className="text-stone-600 font-sans font-light text-sm mt-1">102 Aura Vista Drive, Big Sur, California</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center text-accent border border-stone-200 shadow-sm mt-1">
                  <Phone size={18} />
                </div>
                <div>
                  <h4 className="font-sans font-medium text-sm text-stone-950">Reservations</h4>
                  <p className="text-stone-600 font-sans font-light text-sm mt-1">+1 (800) 555-AURA</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center text-accent border border-stone-200 shadow-sm mt-1">
                  <Mail size={18} />
                </div>
                <div>
                  <h4 className="font-sans font-medium text-sm text-stone-950">Email</h4>
                  <p className="text-stone-600 font-sans font-light text-sm mt-1">escape@aurabigsur.com</p>
                </div>
              </div>
            </div>
          </div>

          {/* Form Side */}
          <div className="bg-white p-8 rounded-2xl border border-stone-200/80 shadow-md text-stone-900">
            <h3 className="font-serif text-2xl font-light mb-6 text-stone-950">Request A Reservation</h3>
            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-stone-500 uppercase tracking-widest mb-1.5 block font-sans font-medium">First Name</label>
                  <input
                    type="text"
                    className="w-full bg-stone-50 border border-stone-200 focus:border-accent focus:outline-none rounded-lg p-3 text-sm text-stone-900 transition-all font-sans"
                    placeholder="John"
                  />
                </div>
                <div>
                  <label className="text-xs text-stone-500 uppercase tracking-widest mb-1.5 block font-sans font-medium">Last Name</label>
                  <input
                    type="text"
                    className="w-full bg-stone-50 border border-stone-200 focus:border-accent focus:outline-none rounded-lg p-3 text-sm text-stone-900 transition-all font-sans"
                    placeholder="Doe"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-stone-500 uppercase tracking-widest mb-1.5 block font-sans font-medium">Email Address</label>
                <input
                  type="email"
                  className="w-full bg-stone-50 border border-stone-200 focus:border-accent focus:outline-none rounded-lg p-3 text-sm text-stone-900 transition-all font-sans"
                  placeholder="john@example.com"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-stone-500 uppercase tracking-widest mb-1.5 block font-sans font-medium">Check-In</label>
                  <input
                    type="date"
                    className="w-full bg-stone-50 border border-stone-200 focus:border-accent focus:outline-none rounded-lg p-3 text-sm text-stone-900 transition-all font-sans"
                  />
                </div>
                <div>
                  <label className="text-xs text-stone-500 uppercase tracking-widest mb-1.5 block font-sans font-medium">Guests</label>
                  {/* Fixed react defaultValue select element warning */}
                  <select
                    defaultValue="2 Guests"
                    className="w-full bg-stone-50 border border-stone-200 focus:border-accent focus:outline-none rounded-lg p-3 text-sm text-stone-900 transition-all font-sans"
                  >
                    <option value="1 Guest">1 Guest</option>
                    <option value="2 Guests">2 Guests</option>
                    <option value="3 Guests">3 Guests</option>
                    <option value="4 Guests">4 Guests</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-stone-950 hover:bg-accent hover:text-zinc-950 text-white text-xs font-semibold uppercase tracking-wider rounded-lg transition-all duration-300 font-sans"
              >
                Send Request
              </button>
            </form>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="mt-24 pt-8 border-t border-stone-200 text-xs text-stone-500 font-sans flex flex-col md:flex-row items-center justify-between">
          <p>© {new Date().getFullYear()} Aura Resort & Spa. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-accent transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-accent transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-accent transition-colors">Sitemap</a>
          </div>
        </div>
      </div>
    </section>
  );
}
