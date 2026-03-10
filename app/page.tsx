"use client";

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';
import NextImage from 'next/image';

interface Service {
  id: number;
  name: string;
  slug: string;
  description: string;
  thumbnail_url?: string | null;
  price?: number;       // opcional, no lo mostramos en home
  is_active?: boolean;  // para filtrar en query
}

export default function Home() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);

      // Fetch servicios activos (igual que en /servicios)
      const { data: servicesData, error } = await supabase
        .from('services')
        .select('id, name, slug, description, thumbnail_url')
        .eq('is_active', true)
        .order('id', { ascending: true });

      if (error) {
        console.error('Error al cargar servicios:', error);
      } else {
        setServices(servicesData || []);
      }

      setLoading(false);
    }

    fetchData();
  }, []);

  const whatsappLink = `https://wa.me/50369388836?text=¡Hola!%20Me%20gustaría%20consultar%20sobre%20servicios%20de%20maquillaje%20con%20MG%20MakeUp%20😊`;

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-300 pt-16 sm:pt-20 md:pt-24">
  {/* Hero Section */}
  <motion.section
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 1 }}
    className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center bg-cover bg-center bg-fixed"  // Ajusta -4rem si navbar >80px
    style={{ backgroundImage: 'url(/hero-image.jpg)' }}
  >
    <div className="absolute inset-0 bg-black/65"></div>
    <motion.div
      initial={{ y: 30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.5, duration: 0.9 }}
      className="relative z-10 text-center px-6 max-w-5xl mx-auto py-8 md:py-0"  // padding extra en mobile si hace falta
    >
      <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif text-white font-bold mb-6 leading-tight tracking-tight">
        Maquillaje Profesional para Tu Momento Especial
      </h1>
      <p className="text-lg sm:text-xl md:text-2xl font-sans mb-10 text-neutral-200 max-w-3xl mx-auto">
        Resalta tu belleza natural con looks únicos, duraderos y personalizados
      </p>
      <Link
        href="/citas"
        className="inline-block bg-rose-600 text-white font-sans font-semibold text-base sm:text-lg md:text-xl px-8 sm:px-10 py-4 sm:py-5 rounded-full shadow-xl hover:bg-rose-700 hover:shadow-2xl hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-rose-500/50"
      >
        Reservar Cita Ahora
      </Link>
    </motion.div>
  </motion.section>

      {/* Servicios Destacados */}
      <section className="py-16 md:py-20 bg-neutral-900">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-center mb-12 md:mb-16 text-white">
            Nuestros Servicios
          </h2>

          {loading ? (
            <div className="text-center text-neutral-400 animate-pulse py-12">
              Cargando servicios...
            </div>
          ) : services.length === 0 ? (
            <div className="text-center text-neutral-500 py-12">
              Aún no hay servicios activos publicados
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
              {services.map((service, idx) => (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: idx * 0.08 }}
                  className="bg-neutral-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:scale-[1.03] transition-all duration-300 flex flex-col"
                >
                  {service.thumbnail_url ? (
                    <img
                      src={service.thumbnail_url}
                      alt={service.name}
                      className="w-full h-56 sm:h-64 object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-56 sm:h-64 bg-neutral-700 flex items-center justify-center text-neutral-500">
                      Sin imagen
                    </div>
                  )}
                  <div className="p-5 sm:p-6 flex flex-col flex-grow">
                    <h3 className="text-xl sm:text-2xl font-serif text-white mb-3">
                      {service.name}
                    </h3>
                    <p className="text-neutral-400 mb-6 line-clamp-3 flex-grow">
                      {service.description}
                    </p>
                    <Link
                      href={service.slug ? `/galeria?servicio=${service.slug}` : `/galeria?servicioId=${service.id}`}
                      className="mt-auto text-rose-500 hover:text-rose-400 font-medium transition-colors inline-block"
                    >
                      Ver galería →
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Testimonios (sin cambios por ahora) */}
      <section className="py-16 md:py-20 bg-neutral-950">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-center mb-12 md:mb-16 text-white">
            Lo que Dicen Nuestras Clientas
          </h2>

          <div className="overflow-hidden">
            <motion.div
              className="flex space-x-6"
              animate={{ x: [0, -1200] }}
              transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
            >
              {[...testimonials, ...testimonials].map((t, i) => (
                <div
                  key={i}
                  className="bg-neutral-800 p-6 sm:p-8 rounded-2xl shadow-lg min-w-[300px] sm:min-w-[340px] md:min-w-[420px] flex-shrink-0"
                >
                  <p className="italic text-neutral-200 mb-5 sm:mb-6 text-base sm:text-lg">
                    "{t.quote}"
                  </p>
                  <cite className="text-right block font-semibold text-rose-400 text-sm sm:text-base">
                    - {t.author}
                  </cite>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Botón flotante WhatsApp */}
      <a
        href={whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 bg-[#25D366] p-4 rounded-full shadow-2xl hover:bg-[#128C7E] transition-all hover:scale-110 flex items-center justify-center"
        aria-label="Contactar por WhatsApp"
      >
        <NextImage 
          src="/whatsapp-icon.png" // Asegúrate de que el nombre coincida con tu archivo en /public
          alt="WhatsApp"
          width={32} 
          height={32}
        />
      </a>
    </main>
  );
}

// Testimonios estáticos
const testimonials = [
  { quote: '¡Increíble! Me sentí como una estrella en mi boda.', author: 'Ana R.' },
  { quote: 'El maquillaje duró toda la noche, perfecto para mi fiesta de 15.', author: 'Sofía M.' },
  { quote: 'Profesionalismo y creatividad en cada detalle. ¡Recomendado!', author: 'Laura P.' },
  { quote: 'Mi sesión de fotos salió espectacular gracias a MG MakeUp.', author: 'Carla T.' },
  { quote: 'Arte puro en mi rostro para el carnaval. ¡Asombroso!', author: 'Elena G.' },
  { quote: 'Atención personalizada y resultados impresionantes. Volveré.', author: 'María L.' },
];