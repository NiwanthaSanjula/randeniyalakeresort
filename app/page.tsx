import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import AboutSection from "@/components/AboutSection";
import VillasShowcase from "@/components/VillasShowcase";
import ServicesGrid from "@/components/ServicesGrid";
import TestimonialsMarquee from "@/components/TestimonialsMarquee";
import BookingInquiry from "@/components/BookingInquiry";
import Footer from "@/components/Footer";
import BookingProvider from "@/components/BookingProvider";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-stone-50 font-sans selection:bg-accent selection:text-stone-950">
      <Navbar />
      <main className="grow">
        <Hero />
        <AboutSection />
        <BookingProvider>
          <VillasShowcase />
          <ServicesGrid />
          <TestimonialsMarquee />
          <BookingInquiry />
        </BookingProvider>
        <Footer
          privacyPolicyUrl={process.env.PRIVACY_POLICY_URL}
          termsOfServiceUrl={process.env.TERMS_OF_SERVICE_URL}
        />
      </main>
    </div>
  );
}
