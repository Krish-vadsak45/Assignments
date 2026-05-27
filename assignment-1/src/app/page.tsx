"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import Hero from "@/components/Hero";
import ScrollAnimation from "@/components/ScrollAnimation";

export default function Home() {
  useEffect(() => {
    const lenis = new Lenis();

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);
    
    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <main className="bg-black text-white min-h-screen selection:bg-gray-800 selection:text-white pb-32">
      <Hero />
      <ScrollAnimation />
    </main>
  );
}
