"use client"; //
import { motion } from 'framer-motion';

export default function Home() {
  return (
    <main className="pt-20"> {/* Padding top para header fixed */}
      {/* Hero Section - Full screen con imagen y texto overlay */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="relative h-screen flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: 'url(/hero-image.jpg)' }} // Placeholder: sube una imagen a public/
      >
        <div className="absolute inset-0 bg-black opacity-40"></div> {/* Overlay oscuro */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="relative z-10 text-center text-white"
        >
          <h1 className="text-6xl font-serif mb-4">Maquillaje Profesional para Tu Momento Especial</h1>
          <p className="text-xl font-sans mb-8">Descubre la belleza que mereces</p>
          <a href="/citas" className="bg-accent text-white px-6 py-3 rounded hover:bg-opacity-80 transition">Reservar Cita</a>
        </motion.div>
      </motion.section>

      {/* Sección Servicios Destacados */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-serif text-center mb-12">Nuestros Servicios</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Tarjeta 1 */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="bg-neutral p-6 rounded shadow hover:shadow-lg transition"
            >
              <img src="file.svg" alt="Maquillaje Novia" className="w-full h-48 object-cover mb-4" />
              <h3 className="text-2xl font-serif mb-2">Maquillaje de Novia</h3>
              <p className="mb-4">Elegante y duradero para tu día especial.</p>
              <a href="/servicios/novia" className="text-accent hover:underline">Ver más</a>
            </motion.div>
            {/* Repite para otras tarjetas */}
          </div>
        </div>
      </section>

      {/* Sección Testimonios */}
      <section className="py-16 bg-neutral">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-serif text-center mb-12">Lo que Dicen Nuestras Clientas</h2>
          <div className="flex flex-col md:flex-row space-y-8 md:space-y-0 md:space-x-8">
            {/* Testimonio 1 */}
            <motion.blockquote
              initial={{ x: -50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="bg-white p-6 rounded shadow"
            >
              <p className="mb-4">"¡Increíble! Me sentí como una estrella."</p>
              <cite className="text-right block">- Ana R.</cite>
            </motion.blockquote>
            {/* Repite para más */}
          </div>
        </div>
      </section>

      {/* Botón flotante WhatsApp (agrega en layout si quieres global) */}
      <a href="https://wa.me/tu-numero" className="fixed bottom-4 right-4 bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600">WhatsApp</a>
    </main>
  );
}