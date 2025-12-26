"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ChevronDown, MapPin } from "lucide-react";
import { BusinessStatus } from "@/components/landing/BusinessStatus";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface HeroProps {
  barberId: string;
  onReserveClick?: () => void;
  onWaitClick?: () => void;
}

export const Hero = ({ barberId, onReserveClick, onWaitClick }: HeroProps) => {
  const heroRef = useRef<HTMLDivElement>(null);
  const textContainerRef = useRef<HTMLDivElement>(null);
  const welcomeTextRef = useRef<HTMLDivElement>(null);
  const buttonsContainerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const button1Ref = useRef<HTMLButtonElement>(null);
  const button2Ref = useRef<HTMLButtonElement>(null);
  const addressRef = useRef<HTMLAnchorElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);

  const BUSINESS_ADDRESS = "C. Libertad, Santo Domingo 10407";
  const GOOGLE_MAPS_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(BUSINESS_ADDRESS)}`;

  // Fase 1: Typewriter Effect
  useGSAP(() => {
    if (!welcomeTextRef.current) return;

    const text = "¡BIENVENIDO A\nVICKEY BARBER\nSHOP!";
    const words = text.split("\n");
    const element = welcomeTextRef.current;

    element.innerHTML = "";

    words.forEach((word, wordIndex) => {
      const wordDiv = document.createElement("div");
      wordDiv.className = "leading-tight";
      element.appendChild(wordDiv);

      word.split("").forEach((char, charIndex) => {
        const span = document.createElement("span");
        span.textContent = char === " " ? "\u00A0" : char;
        span.style.opacity = "0";
        wordDiv.appendChild(span);

        gsap.to(span, {
          opacity: 1,
          duration: 0.05,
          delay: wordIndex * 0.3 + charIndex * 0.05,
          ease: "none",
        });
      });
    });
  }, { scope: heroRef });

  // Fase 2: ScrollTrigger Animation
  useGSAP(() => {
    if (
      !heroRef.current ||
      !welcomeTextRef.current ||
      !titleRef.current ||
      !button1Ref.current ||
      !button2Ref.current ||
      !addressRef.current ||
      !logoRef.current
    )
      return;

    gsap.set(logoRef.current, {
      opacity: 0,
      scale: 25,
      xPercent: -50,
      yPercent: -50,
      top: "50%",
      left: "25%",
      position: "absolute",
    });

    gsap.set(titleRef.current, { opacity: 0, y: 20 });
    gsap.set(button1Ref.current, { opacity: 0, y: 20 });
    gsap.set(button2Ref.current, { opacity: 0, y: 20 });
    gsap.set(addressRef.current, { opacity: 0, y: 20 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: heroRef.current,
        start: "top top",
        end: "+=100%",
        pin: true,
        scrub: 1,
        anticipatePin: 1,
        markers: false,
      },
    });

    tl.to(welcomeTextRef.current, {
      opacity: 0,
      y: -50,
      duration: 0.5,
      ease: "power2.in",
    });


    tl.fromTo(
      logoRef.current,
      {
        scale: 25,
        opacity: 0,
        xPercent: -50,
        yPercent: -50,
        top: "50%",
        left: "25%",
        position: "absolute",
      },
      {
        scale: 1.5,
        opacity: 1,
        top: "-180px",
        xPercent: 0,
        yPercent: 0,
        left: 0,
        position: "absolute",
        ease: "power1.out",
        duration: 1.8,
      },
      "-=0.2"
    );

    tl.set(logoRef.current, {
      xPercent: 0,
      yPercent: 0,
    });

    // Título aparece debajo del logo
    tl.to(titleRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.4,
      ease: "power2.out",
    }, "-=0.2");

    tl.to(
      [button1Ref.current, button2Ref.current],
      {
        opacity: 1,
        y: 0,
        duration: 0.4,
        stagger: 0.1,
        ease: "power2.out",
      },
      "-=0.2"
    );

    tl.to(addressRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.4,
      ease: "power2.out",
    }, "-=0.1");

    return () => {
      ScrollTrigger.getAll().forEach(trigger => {
        if (trigger.vars.trigger === heroRef.current) {
          trigger.kill();
        }
      });
    };
  }, { scope: heroRef, dependencies: [] });

  return (
    <>
      {/* Mobile: Video Hero Section */}
      <div className="relative block md:hidden h-screen overflow-hidden isolate">
        {/* Fallback Background */}
        <div className="absolute inset-0 w-full h-full bg-gradient-to-b from-zinc-100 to-zinc-200 z-0" />

        {/* Video Background */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover z-[1]"
        >
          <source src="/videos/hero-mobile.mp4" type="video/mp4" />
        </video>

        <div className="absolute inset-0 bg-black/60 pointer-events-none z-[2]" />

        {/* Content Overlay */}
        <div className="relative z-30 flex h-full flex-col items-center justify-center px-4 py-0">
          <div className="absolute top-14 left-0 w-full flex justify-center z-50 pointer-events-none">
            <div className="pointer-events-auto relative">
              <BusinessStatus barberId={barberId} variant="hero" />
            </div>
          </div>

          {/* Botones de Acción */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 1.2,
              delay: 0.4,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="flex flex-row items-center justify-center gap-4 mt-60"
          >
            <Link
              href="#horarios"
              className="rounded-full border border-white bg-transparent px-6 py-3 text-white transition-all hover:bg-white hover:text-black"
            >
              <span className="font-medium">Horarios</span>
            </Link>
            <Link
              href="#servicios"
              className="rounded-full border border-white bg-transparent px-6 py-3 text-white transition-all hover:bg-white hover:text-black"
            >
              <span className="font-medium">Servicios</span>
            </Link>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              duration: 1.2,
              delay: 1.0,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="absolute bottom-40 left-1/2 -translate-x-1/2"
          >
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <ChevronDown className="h-6 w-6 text-white" />
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Desktop: Hero Section con GSAP Animations */}
      <div
        ref={heroRef}
        className="relative hidden md:flex min-h-screen flex-col items-center justify-center overflow-hidden"
      >
        <div className="relative w-full max-w-7xl mx-auto grid grid-cols-12 gap-8 items-center min-h-[90vh] px-4 py-20">

          <div
            ref={textContainerRef}
            className="col-span-6 flex flex-col justify-center items-start z-20 relative"
          >
            <div
              ref={welcomeTextRef}
              className="font-supreme text-7xl text-black leading-tight mb-8"
            />

            <div ref={buttonsContainerRef} className="w-full relative">
              <div
                ref={logoRef}
                className="absolute z-30 mb-6"
                style={{
                  opacity: 0,
                  transform: "scale(25)",
                  top: "-180px",
                  left: 0,
                }}
              >
                <span className="text-8xl md:text-9xl font-bold text-zinc-900 tracking-tight">
                  <span className="inline-block -rotate-12 origin-center">V</span>
                  <span className="inline-block rotate-12 origin-center">K</span>
                </span>
              </div>

              <h2
                ref={titleRef}
                className="font-supreme text-5xl text-black mb-8 opacity-0"
              >
                ¿QUÉ DESEAS HACER?
              </h2>
              <div className="flex flex-row gap-4 mb-4">
                <button
                  ref={button1Ref}
                  onClick={onReserveClick}
                  className="rounded-full bg-zinc-900 px-8 py-4 text-white text-lg font-semibold opacity-0 transition-all hover:bg-zinc-800"
                >
                  Reservar
                </button>
                <button
                  ref={button2Ref}
                  onClick={onWaitClick}
                  className="rounded-full border-2 border-zinc-300 bg-transparent px-8 py-4 text-zinc-900 text-lg font-semibold opacity-0 transition-all hover:bg-zinc-100"
                >
                  En Espera
                </button>
              </div>
              <a
                ref={addressRef}
                href={GOOGLE_MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-zinc-500 opacity-0 transition-colors hover:text-black ml-2"
              >
                <MapPin className="h-4 w-4 flex-shrink-0" />
                <span>{BUSINESS_ADDRESS}</span>
              </a>
            </div>
          </div>
        </div>

        {/* Imagen del Personaje del Hero */}
        <div
          className="absolute bottom-0 right-0 z-10 pointer-events-none"
          style={{
            bottom: 0,
            right: 0,
            margin: 0,
            padding: 0
          }}
        >
          <Image
            src="/images/personWithoutBackground2.png"
            alt="Personaje modelo"
            width={800}
            height={1200}
            className="object-contain"
            priority
            style={{
              height: '95vh',
              width: 'auto',
              maxHeight: '95vh',
              display: 'block'
            }}
          />
        </div>
      </div>
    </>
  );
};
