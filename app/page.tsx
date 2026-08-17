import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import AboutSection from "@/components/AboutSection";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-stone-50 font-sans selection:bg-accent selection:text-stone-950">
      <Navbar />
      <main className="grow">
        <Hero />
        <AboutSection />
      </main>
    </div>
  );
}
