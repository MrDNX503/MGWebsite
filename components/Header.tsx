"use client";

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/lib/store/authStore'; // ← muy importante esta línea

export default function Header() {
  const { user, logout } = useAuthStore();
  
  // Debug temporal – quítalo después de probar
  console.log("Header → user:", user);

  const isAdmin = user?.role === 'admin';

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 w-full bg-white shadow-md z-50"
    >
      <nav className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-serif text-primary">
          MG MakeUp
        </Link>

        <ul className="flex space-x-6 items-center text-gray-800">
          <li><Link href="/servicios" className="hover:text-accent transition">Servicios</Link></li>
          <li><Link href="/galeria" className="hover:text-accent transition">Galería</Link></li>
          <li><Link href="/citas" className="hover:text-accent transition">Reservar Cita</Link></li>
          <li><Link href="/blog" className="hover:text-accent transition">Blog</Link></li>
          <li><Link href="/contacto" className="hover:text-accent transition">Contacto</Link></li>

          {isAdmin ? (
            <>
              <li>
                <Link
                  href="/admin"
                  className="font-semibold text-accent hover:text-accent-dark transition"
                >
                  Panel de Administración
                </Link>
              </li>
              <li>
                <button
                  onClick={() => {
                    logout();
                    console.log("Logout ejecutado");
                  }}
                  className="text-red-600 hover:text-red-800 font-medium transition"
                >
                  Cerrar sesión
                </button>
              </li>
            </>
          ) : user ? (
            // Para clientes normales (puedes expandir después)
            <li>
              <button
                onClick={logout}
                className="text-gray-700 hover:text-gray-900 font-medium transition"
              >
                Cerrar sesión
              </button>
            </li>
          ) : (
            <li>
              <Link
                href="/login"
                className="font-medium text-accent hover:text-accent-dark transition"
              >
                Iniciar sesión
              </Link>
            </li>
          )}
        </ul>
      </nav>
    </motion.header>
  );
}