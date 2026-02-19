"use client";

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '@/lib/store/authStore';
import { Menu, X } from 'lucide-react'; // Usa lucide-react para iconos (instala si no lo tienes: npm i lucide-react)

export default function Header() {
  const { user, logout } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);

  const isAdmin = user?.role === 'admin';

  const navLinks = [
    { href: '/servicios', label: 'Servicios' },
    { href: '/galeria', label: 'Galería' },
    { href: '/citas', label: 'Reservar Cita' },
    { href: '/blog', label: 'Blog' },
    { href: '/contacto', label: 'Contacto' },
  ];

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 w-full bg-neutral-950/90 backdrop-blur-md shadow-lg z-50 text-white"
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="text-2xl md:text-3xl font-serif text-rose-500 hover:text-rose-400 transition">
            MG MakeUp
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-neutral-300 hover:text-rose-400 transition font-medium"
              >
                {link.label}
              </Link>
            ))}

            {isAdmin ? (
              <>
                <Link
                  href="/admin"
                  className="font-semibold text-rose-500 hover:text-rose-400 transition"
                >
                  Panel Admin
                </Link>
                <button
                  onClick={logout}
                  className="text-red-400 hover:text-red-300 font-medium transition"
                >
                  Cerrar sesión
                </button>
              </>
            ) : user ? (
              <button
                onClick={logout}
                className="text-neutral-300 hover:text-white font-medium transition"
              >
                Cerrar sesión
              </button>
            ) : (
              <Link
                href="/login"
                className="font-medium text-rose-500 hover:text-rose-400 transition"
              >
                Iniciar sesión
              </Link>
            )}
          </div>

          {/* Hamburger Button - Mobile */}
          <button
            onClick={toggleMenu}
            className="md:hidden text-white focus:outline-none"
            aria-label="Toggle menú"
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu - Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-neutral-900 border-t border-neutral-800 overflow-hidden"
          >
            <div className="px-4 py-6 flex flex-col space-y-6">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={toggleMenu}
                  className="text-lg text-neutral-200 hover:text-rose-400 transition"
                >
                  {link.label}
                </Link>
              ))}

              {isAdmin ? (
                <>
                  <Link
                    href="/admin"
                    onClick={toggleMenu}
                    className="text-lg font-semibold text-rose-500 hover:text-rose-400"
                  >
                    Panel de Administración
                  </Link>
                  <button
                    onClick={() => { logout(); toggleMenu(); }}
                    className="text-lg text-red-400 hover:text-red-300 text-left"
                  >
                    Cerrar sesión
                  </button>
                </>
              ) : user ? (
                <button
                  onClick={() => { logout(); toggleMenu(); }}
                  className="text-lg text-neutral-200 hover:text-white text-left"
                >
                  Cerrar sesión
                </button>
              ) : (
                <Link
                  href="/login"
                  onClick={toggleMenu}
                  className="text-lg font-medium text-rose-500 hover:text-rose-400"
                >
                  Iniciar sesión
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}