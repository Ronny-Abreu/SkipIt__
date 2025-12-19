"use client";

import { useState } from "react";
import { motion } from "framer-motion";
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

  const handleReserveClick = () => {
    // TODO: Navegar a la página de reserva con la fecha seleccionada
    console.log("Reservar cita para:", selectedDate);
  };

  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      <div className="bg-white">
        <BusinessStatus barberId={DEFAULT_BARBER_ID} />
      </div>

      {/* Hero Section */}
      <Hero barberId={DEFAULT_BARBER_ID} />

      {/* Date Selector - Sticky */}
      <DateSelector selectedDate={selectedDate} onDateChange={setSelectedDate} />

      {/* Content Section */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="space-y-8">
            <motion.button
              onClick={handleReserveClick}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full rounded-full bg-zinc-900 px-8 py-4 text-lg font-semibold text-white shadow-xl transition-shadow hover:shadow-2xl sm:px-12 sm:py-5 sm:text-xl"
            >
              Reservar Cita
            </motion.button>

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
    </main>
  );
}
