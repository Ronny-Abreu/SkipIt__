"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, MapPin } from "lucide-react";

const BUSINESS_ADDRESS = "C. Libertad, Santo Domingo 10407";
const GOOGLE_MAPS_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(BUSINESS_ADDRESS)}`;

export const LocationBanner = () => {
  const [isVisible, setIsVisible] = useState(true);

  const handleClose = () => {
    setIsVisible(false);
  };

  const handleAddressClick = () => {
    window.open(GOOGLE_MAPS_URL, "_blank", "noopener,noreferrer");
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{
            duration: 0.4,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="overflow-hidden bg-gradient-to-r from-amber-400/90 via-amber-500/90 to-amber-400/90 backdrop-blur-md border-b border-amber-300/50 pt-2"
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between py-3">
              <button
                onClick={handleAddressClick}
                className="flex flex-1 items-center gap-2 text-left text-sm font-medium text-zinc-900 transition-colors hover:text-zinc-700 hover:underline underline-offset-4 cursor-pointer"
              >
                <MapPin className="h-4 w-4 flex-shrink-0" />
                <span>{BUSINESS_ADDRESS}</span>
              </button>
              <button
                onClick={handleClose}
                className="ml-4 flex items-center justify-center p-1 text-zinc-700 transition-colors hover:text-zinc-900"
                aria-label="Cerrar banner"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
