"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { X, ChevronRight } from "lucide-react";
import { BusinessStatus } from "@/components/landing/BusinessStatus";

const menuItems = [
  { label: "Acceder", href: "/login" },
  { label: "Registrarse", href: "/register" },
  { label: "Dirección", href: "#direccion" },
  { label: "Contactos", href: "#contactos" },
  { label: "En espera", href: "#en-espera" },
  { label: "Agendar cita", href: "/agendar-cita" },
  { label: "Sobre nosotros", href: "#sobre-nosotros" },
  { label: "Soporte", href: "#soporte" },
];

interface NavbarProps {
  barberId?: string;
}

export const Navbar = ({ barberId = "default-barber-id" }: NavbarProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      <nav className="sticky top-0 z-50 bg-zinc-50/80 backdrop-blur-sm shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">

            <Link href="/" className="flex items-center">
              <span className="text-2xl font-bold text-zinc-900 tracking-tight">
                <span className="inline-block -rotate-12 origin-center">V</span>
                <span className="inline-block rotate-12 origin-center">K</span>
              </span>
            </Link>

            {/* BusinessStatus  */}
            <div className="hidden md:flex md:flex-1 md:items-center md:justify-center">
              <BusinessStatus barberId={barberId} variant="desktop-static" />
            </div>

            {/* Desktop Menu Button */}
            <button
              onClick={toggleMobileMenu}
              className="hidden md:flex items-center justify-center p-2 text-zinc-900 transition-colors hover:text-zinc-600"
              aria-label="Toggle menu"
            >
              <AnimatePresence mode="wait">
                {isMobileMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ opacity: 0, rotate: -90 }}
                    animate={{ opacity: 1, rotate: 0 }}
                    exit={{ opacity: 0, rotate: 90 }}
                    transition={{ duration: 0.3 }}
                  >
                    <X className="h-6 w-6" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex flex-col gap-1.5"
                  >
                    <span className="block h-0.5 w-6 bg-zinc-900"></span>
                    <span className="block h-0.5 w-6 bg-zinc-900"></span>
                    <span className="block h-0.5 w-6 bg-zinc-900"></span>
                  </motion.div>
                )}
              </AnimatePresence>
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMobileMenu}
              className="md:hidden flex items-center justify-center p-2 text-zinc-900 transition-colors hover:text-zinc-600"
              aria-label="Toggle menu"
            >
              <AnimatePresence mode="wait">
                {isMobileMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ opacity: 0, rotate: -90 }}
                    animate={{ opacity: 1, rotate: 0 }}
                    exit={{ opacity: 0, rotate: 90 }}
                    transition={{ duration: 0.3 }}
                  >
                    <X className="h-6 w-6" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex flex-col gap-1.5"
                  >
                    <span className="block h-0.5 w-6 bg-zinc-900"></span>
                    <span className="block h-0.5 w-6 bg-zinc-900"></span>
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile & Desktop Menu (Sheet/Drawer) */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <MobileMenu
            items={menuItems}
            onClose={() => setIsMobileMenuOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
};

interface MobileMenuProps {
  items: typeof menuItems;
  onClose: () => void;
}

const MobileMenu = ({ items, onClose }: MobileMenuProps) => {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-0 z-[100] h-full w-full bg-black"
    >
      <div className="flex justify-end pr-4 pt-6 pb-4 relative z-[101] md:pr-8 md:pt-8">
        <motion.button
          onClick={onClose}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="flex items-center justify-center p-2 text-white transition-colors hover:text-zinc-400 relative z-[101]"
          aria-label="Close menu"
        >
          <X className="h-6 w-6" />
        </motion.button>
      </div>

      {/* Menu Items */}
      <nav className="flex flex-col pl-10 pr-6 py-8">
        {items.map((item, index) => (
          <motion.div
            key={item.href}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{
              duration: 0.5,
              delay: index * 0.08,
              ease: [0.22, 1, 0.36, 1],
            }}
            onMouseEnter={() => setHoveredItem(item.href)}
            onMouseLeave={() => setHoveredItem(null)}
          >
            <Link
              href={item.href}
              onClick={onClose}
              className="group flex items-center justify-between py-2 text-3xl font-semibold text-white transition-colors hover:text-zinc-400"
            >
              <span>{item.label}</span>
              <motion.div
                initial={{ opacity: 0, x: -8 }}
                animate={{
                  opacity: hoveredItem === item.href ? 1 : 0,
                  x: hoveredItem === item.href ? 0 : -8,
                }}
                transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                className="text-zinc-400"
              >
                <ChevronRight className="h-5 w-5" strokeWidth={2} />
              </motion.div>
            </Link>
          </motion.div>
        ))}
      </nav>
    </motion.div>
  );
};
