import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

export default function ScrollAnimation() {
  const containerRef = useRef<HTMLDivElement>(null);
  const carRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      // Pin the container and animate the car
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=2000", // The amount of scrolling
          scrub: 1, // Smooth scrubbing
          pin: true,
        },
      });

      // Animate the car's scale and position
      tl.to(carRef.current, {
        scale: 2,
        x: "50vw",
        y: "20vh",
        rotation: 15,
        ease: "none",
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative h-screen w-full bg-black overflow-hidden flex items-center justify-center"
    >
      <div
        ref={carRef}
        className="absolute w-[300px] h-[150px] md:w-[600px] md:h-[300px]"
        style={{ left: "-10vw", top: "40vh" }}
      >
        <Image
          src="/car.png"
          alt="Sports Car"
          fill
          className="object-contain"
          priority
        />
      </div>
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent to-black/80 z-10" />
    </div>
  );
}
