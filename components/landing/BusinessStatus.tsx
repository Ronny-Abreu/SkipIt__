"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { isBusinessOpen } from "@/lib/utils/businessStatus";
import { getSchedule } from "@/lib/firebase/schedule";
import type { WeeklySchedule } from "@/types/schedule";

interface BusinessStatusProps {
  barberId: string;
  variant?: "hero" | "fixed";
  className?: string;
}

export const BusinessStatus = ({ barberId, variant = "hero", className = "" }: BusinessStatusProps) => {
  const [isOpen, setIsOpen] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const schedule = await getSchedule(barberId);
        const open = isBusinessOpen(schedule);
        setIsOpen(open);
      } catch (error) {
        console.error("Error al verificar estado del negocio:", error);
        setIsOpen(false);
      } finally {
        setLoading(false);
      }
    };

    checkStatus();
    const interval = setInterval(checkStatus, 60000);
    return () => clearInterval(interval);
  }, [barberId]);

  if (loading) {
    return null;
  }

  if (isOpen === null) {
    return null;
  }

  const baseClasses = variant === "fixed"
    ? (className.trim() === "" ? "relative z-10" : "fixed left-1/2 -translate-x-1/2 z-50 md:hidden")
    : "relative z-30 md:absolute md:top-[200px] md:left-[calc(50%-60px)] md:z-50";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.0, ease: [0.22, 1, 0.36, 1] }}
      className={`${baseClasses} ${className}`}
    >
      <div className="flex items-center gap-2 rounded-full bg-white/70 px-4 py-2 shadow-xl backdrop-blur-md">
        <motion.div
          animate={isOpen ? { scale: [1, 1.2, 1] } : {}}
          transition={{
            duration: 2,
            repeat: isOpen ? Infinity : 0,
            ease: "easeInOut",
          }}
          className={`h-2 w-2 rounded-full ${isOpen ? "bg-emerald-500" : "bg-zinc-400"
            }`}
        />
        <span className="text-sm font-medium text-zinc-900">
          {isOpen ? "Abierto ahora" : "Cerrado"}
        </span>
      </div>
    </motion.div>
  );
};
