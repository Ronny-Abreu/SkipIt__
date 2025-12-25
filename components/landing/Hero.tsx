"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ChevronDown, Clock, Scissors, MessageCircle } from "lucide-react";
import { BusinessStatus } from "@/components/landing/BusinessStatus";

interface HeroProps {
  barberId: string;
}

export const Hero = ({ barberId }: HeroProps) => {

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
            className="flex flex-row items-center justify-center gap-4 mt-32"
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

      {/* Desktop: Hero Section */}
      <div className="relative hidden md:flex min-h-[60vh] flex-col items-center justify-center px-4 py-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 1.4,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="relative z-10"
        >
          <div className="relative h-56 w-56 sm:h-64 sm:w-64 md:h-80 md:w-80 lg:h-96 lg:w-96">
            <Image
              src="/images/logoVK-BARBER.png"
              alt="Logo VK Barber"
              fill
              className="object-contain"
              priority
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 1.2,
            delay: 0.4,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="mt-8 text-center"
        >
          <p className="text-lg font-medium text-black sm:text-xl">
            Reserva tu cita de forma rápida y sencilla
          </p>
        </motion.div>

        {/* Info Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 1.2,
            delay: 0.6,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm sm:gap-8"
        >
          <Link
            href="#horarios"
            className="flex items-center gap-2 transition-colors"
          >
            <Clock className="h-4 w-4 text-black" />
            <span className="bg-gradient-to-r from-amber-600 via-amber-700 to-amber-600 bg-clip-text text-transparent font-medium">
              Horarios
            </span>
          </Link>
          <Link
            href="#servicios"
            className="flex items-center gap-2 transition-colors"
          >
            <Scissors className="h-4 w-4 text-black" />
            <span className="bg-gradient-to-r from-amber-600 via-amber-700 to-amber-600 bg-clip-text text-transparent font-medium">
              Servicios
            </span>
          </Link>
          <Link
            href="https://wa.me/1234567890"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 transition-colors"
          >
            <MessageCircle className="h-4 w-4 text-black" />
            <span className="bg-gradient-to-r from-amber-600 via-amber-700 to-amber-600 bg-clip-text text-transparent font-medium">
              Contáctanos
            </span>
          </Link>
        </motion.div>
      </div>
    </>
  );
};
