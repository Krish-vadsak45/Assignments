"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      // Animate headline
      tl.fromTo(
        headlineRef.current,
        { opacity: 0, y: 50, scale: 0.9 },
        { opacity: 1, y: 0, scale: 1, duration: 1.2, delay: 0.2 }
      );

      // Stagger stats
      if (statsRef.current) {
        const statItems = statsRef.current.children;
        tl.fromTo(
          statItems,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.8, stagger: 0.2 },
          "-=0.6" // overlapping start
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative flex flex-col items-center justify-center min-h-screen bg-black text-white px-4 z-20"
    >
      <h1
        ref={headlineRef}
        className="text-4xl md:text-7xl lg:text-9xl font-bold tracking-[0.5em] md:tracking-[0.8em] text-center opacity-0"
        style={{ willChange: "transform, opacity" }}
      >
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-gray-200 to-gray-600">
          W E L C O M E
        </span>
        <br />
        <span className="text-2xl md:text-5xl lg:text-6xl text-gray-400 mt-4 block">
          I T Z   F I Z Z
        </span>
      </h1>

      <div
        ref={statsRef}
        className="mt-16 flex flex-col md:flex-row gap-8 md:gap-16 text-center"
      >
        <div className="opacity-0">
          <h2 className="text-4xl md:text-5xl font-extrabold text-[#00ffcc]">99%</h2>
          <p className="text-sm md:text-base text-gray-400 mt-2 tracking-widest uppercase">Performance</p>
        </div>
        <div className="opacity-0">
          <h2 className="text-4xl md:text-5xl font-extrabold text-[#ff00cc]">0.1s</h2>
          <p className="text-sm md:text-base text-gray-400 mt-2 tracking-widest uppercase">Interaction Delay</p>
        </div>
        <div className="opacity-0">
          <h2 className="text-4xl md:text-5xl font-extrabold text-[#ccff00]">60fps</h2>
          <p className="text-sm md:text-base text-gray-400 mt-2 tracking-widest uppercase">Smooth Scroll</p>
        </div>
      </div>
      
      {/* Scroll indicator */}
      <div className="absolute bottom-10 animate-bounce text-gray-500 text-sm tracking-widest">
        SCROLL TO EXPLORE ↓
      </div>
    </section>
  );
}
