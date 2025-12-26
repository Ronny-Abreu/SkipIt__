"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { Navbar } from "@/components/landing/Navbar";
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
      <Navbar barberId={DEFAULT_BARBER_ID} />

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
        <Hero 
          barberId={DEFAULT_BARBER_ID} 
          onReserveClick={handleReserveClick}
          onWaitClick={handleViewShiftsClick}
        />

        <div
          ref={staticStatusRef}
          className="absolute top-14 left-0 w-full h-10 pointer-events-none bg-transparent md:hidden"
          aria-hidden="true"
        />
      </div>

      {/* Date Selector - Fuera del Hero */}
      <div className="bg-white">
        <DateSelector selectedDate={selectedDate} onDateChange={setSelectedDate} />
      </div>

      {/* Mobile: Sección de Reserva */}
      <div className="block md:hidden bg-white">
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
              aria-label="Contactar por WhatsApp"
            >
              {/* Logo oficial de WhatsApp */}
              <svg
                className="h-7 w-7 text-white"
                fill="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
              </svg>
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
