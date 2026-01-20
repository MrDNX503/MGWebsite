"use client"; //
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Header() {
  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 w-full bg-white shadow-md z-50"
    >
      <nav className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-serif text-primary">MG MakeUp</Link>
        <ul className="flex space-x-6">
          <li><Link href="/servicios" className="hover:text-accent">Servicios</Link></li>
          <li><Link href="/galeria" className="hover:text-accent">Galería</Link></li>
          <li><Link href="/citas" className="hover:text-accent">Reservar Cita</Link></li>
          <li><Link href="/blog" className="hover:text-accent">Blog</Link></li>
          <li><Link href="/contacto" className="hover:text-accent">Contacto</Link></li>
          <li><Link href="/login" className="hover:text-accent">Login</Link></li>
        </ul>
      </nav>
    </motion.header>
  );
}