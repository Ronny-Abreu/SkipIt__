"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { Navbar } from "@/components/landing/Navbar";
import { LocationBanner } from "@/components/landing/LocationBanner";
import { BusinessStatus } from "@/components/landing/BusinessStatus";
import { Hero } from "@/components/landing/Hero";
import { DateSelector } from "@/components/landing/DateSelector";
import { FadeIn } from "@/components/ui/FadeIn";

// TODO: Obtener el barberId desde configuración o contexto
// Por ahora usamos un ID por defecto. En producción, esto debería venir de:
// - Una variable de entorno
// - Un contexto de configuración
// - Un parámetro de URL
const DEFAULT_BARBER_ID = "default-barber-id";

export default function Home() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const [selectedDate, setSelectedDate] = useState<Date>(today);
  const [showWhatsAppButton, setShowWhatsAppButton] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const staticStatusRef = useRef<HTMLDivElement>(null);
  // INSTANCIA B
  const isStaticVisible = useInView(staticStatusRef, {
    once: false,
    margin: "-90px 0px 0px 0px",
  });

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (heroRef.current) {
            const heroBottom = heroRef.current.offsetTop + heroRef.current.offsetHeight;

            setShowWhatsAppButton(window.scrollY + window.innerHeight > heroBottom + 50);
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest('a[href^="#"]') as HTMLAnchorElement;

      if (link && link.hash && link.hash !== '#') {
        e.preventDefault();
        const targetId = link.hash.substring(1);
        const targetElement = document.getElementById(targetId);

        if (targetElement) {
          const navbarHeight = 64;
          const padding = 16;
          const offsetTop = targetElement.offsetTop - navbarHeight - padding;

          window.scrollTo({
            top: Math.max(0, offsetTop),
            behavior: 'smooth'
          });
        }
      }
    };

    if (typeof window !== 'undefined') {
      if (window.location.hash) {
        const targetId = window.location.hash.substring(1);
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
          setTimeout(() => {
            const navbarHeight = 64;
            const padding = 16;
            const offsetTop = targetElement.offsetTop - navbarHeight - padding;
            window.scrollTo({
              top: Math.max(0, offsetTop),
              behavior: 'smooth'
            });
          }, 100);
        }
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    document.addEventListener("click", handleAnchorClick);
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("click", handleAnchorClick);
    };
  }, []);

  const handleReserveClick = () => {
    // TODO: Navegar a la página de reserva con la fecha seleccionada
    console.log("Reservar cita para:", selectedDate);
  };

  const handleViewShiftsClick = () => {
    // TODO: Navegar a la página de turnos
    console.log("Ver turnos");
  };

  return (
    <main className="relative min-h-screen bg-white">
      <Navbar />
      <LocationBanner />

      <AnimatePresence>
        {!isStaticVisible && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="fixed top-4 left-0 right-0 mx-auto w-fit z-50 md:hidden"
          >
            <BusinessStatus
              barberId={DEFAULT_BARBER_ID}
              variant="fixed"
              className=""
            />
          </motion.div>
        )}
      </AnimatePresence>

      <div ref={heroRef} className="relative">
        <Hero barberId={DEFAULT_BARBER_ID} />

        <div
          ref={staticStatusRef}
          className="absolute top-14 left-0 w-full h-10 pointer-events-none bg-transparent md:hidden"
          aria-hidden="true"
        />
      </div>

      {/* Mobile: Sección de Reserva */}
      <div className="block md:hidden bg-white">
        <DateSelector selectedDate={selectedDate} onDateChange={setSelectedDate} />

        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
          <FadeIn>
            <div className="flex flex-row gap-4">
              <motion.button
                onClick={handleReserveClick}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 whitespace-nowrap rounded-full bg-zinc-900 px-6 py-3 text-base font-semibold text-white shadow-xl transition-shadow hover:shadow-2xl"
              >
                Reservar Cita
              </motion.button>
              <motion.button
                onClick={handleViewShiftsClick}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 whitespace-nowrap rounded-full border border-zinc-200 bg-transparent px-6 py-3 text-base font-semibold text-zinc-900 transition-colors hover:bg-zinc-100"
              >
                Ver Turnos
              </motion.button>
            </div>
          </FadeIn>
        </div>
      </div>

      {/* Desktop: Date Selector */}
      <div className="hidden md:block">
        <DateSelector selectedDate={selectedDate} onDateChange={setSelectedDate} />
      </div>

      {/* Content Section */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="space-y-8">
            {/* Desktop: CTAs Row */}
            <div className="hidden md:flex flex-row gap-4">
              <motion.button
                onClick={handleReserveClick}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 whitespace-nowrap rounded-full bg-zinc-900 px-6 py-3 text-base font-semibold text-white shadow-xl transition-shadow hover:shadow-2xl"
              >
                Reservar Cita
              </motion.button>
              <motion.button
                onClick={handleViewShiftsClick}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 whitespace-nowrap rounded-full border border-zinc-200 bg-transparent px-6 py-3 text-base font-semibold text-zinc-900 transition-colors hover:bg-zinc-100"
              >
                Ver Turnos
              </motion.button>
            </div>

            <FadeIn delay={0.1}>
              <div className="mt-16 text-center">
                <h2 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
                  Tu estilo, nuestra pasión
                </h2>
                <p className="mt-4 text-lg text-zinc-500">
                  Reserva tu cita y disfruta de un servicio de calidad
                </p>
              </div>
            </FadeIn>
          </div>
        </FadeIn>
      </div>

      {/* Sección Horarios */}
      <section id="horarios" className="scroll-mt-20 py-16 bg-zinc-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
                Horarios
              </h2>
              <p className="mt-4 text-lg text-zinc-500">
                Consulta nuestros horarios de atención
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Sección Servicios */}
      <section id="servicios" className="scroll-mt-20 py-16 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
                Servicios
              </h2>
              <p className="mt-4 text-lg text-zinc-500">
                Conoce todos nuestros servicios disponibles
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Botón WhatsApp Flotante (Mobile) */}
      <AnimatePresence>
        {showWhatsAppButton && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed bottom-6 right-6 z-50 block md:hidden"
          >
            <a
              href="https://wa.me/18098541714"
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] shadow-lg transition-transform hover:scale-110"
            >
              <MessageCircle className="h-7 w-7 text-white" />
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
