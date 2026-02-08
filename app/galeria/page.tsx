'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

// Todas las fotos organizadas por servicio
const galleryData = {
  bodas: [
    '/galeria/bodas/bodas.jpeg',
    '/galeria/bodas/bodas-1.jpeg',
    // agrega aquí TODAS las que subiste (una línea por foto)
  ],
  quince: [
    '/galeria/quince/15age.jpeg',
    '/galeria/quince/15age-1.jpeg',
    '/galeria/quince/15age-2.jpeg',
    '/galeria/quince/15age-3.jpeg',
    '/galeria/quince/15age-5.jpeg',
    '/galeria/quince/15age-6.jpeg',
    // todas las de 15 años
  ],
  eventos: [
    '/galeria/eventos/eventosEspeciales.jpeg',
    '/galeria/eventos/eventosEspeciales-1.jpeg',
    '/galeria/eventos/eventosEspeciales-2.jpeg',
    '/galeria/eventos/eventosEspeciales-3.jpeg',
    '/galeria/eventos/eventosEspeciales-4.jpeg',
    '/galeria/eventos/eventosEspeciales-5.jpeg',
    // todas las de eventos
  ],
  fotos: [
    '/galeria/fotos/fotos.jpeg',
    '/galeria/fotos/fotos-1.jpeg',
    '/galeria/fotos/fotos-2.jpeg',
    '/galeria/fotos/fotos-3.jpeg',
    '/galeria/fotos/fotos-4.jpeg',
    '/galeria/fotos/fotos-5.jpeg',
    '/galeria/fotos/fotos-6.jpeg',
    '/galeria/fotos/fotos-7.jpeg',
    '/galeria/fotos/fotos-8.jpeg',
    // todas las de fotos
  ],
  artistico: [
    '/galeria/artistico/artistico-1.jpeg',
    '/galeria/artistico/artistico-2.jpeg',
    '/galeria/artistico/artistico-3.jpeg',
    '/galeria/artistico/artistico-4.jpeg',
    '/galeria/artistico/artistico-5.jpeg',
    '/galeria/artistico/artistico-6.jpeg',
    '/galeria/artistico/artistico-7.jpeg',
    '/galeria/artistico/artistico-8.jpeg',
    '/galeria/artistico/artistico-9.jpeg',
    '/galeria/artistico/artistico-10.jpeg',
    '/galeria/artistico/artistico-11.jpeg',
    '/galeria/artistico/artistico-12.jpeg',
    '/galeria/artistico/artistico-13.jpeg',
    '/galeria/artistico/artistico-14.jpeg',
    '/galeria/artistico/artistico-15.jpeg',
    '/galeria/artistico/artistico-16.jpeg',
    // todas las de artístico
  ],
};

// Títulos bonitos para la galería
const serviceTitles = {
  bodas: 'Maquillaje para Bodas',
  quince: 'Maquillaje para 15 Años',
  eventos: 'Maquillaje para Eventos Especiales',
  fotos: 'Maquillaje para Sesiones de Fotos',
  artistico: 'Maquillaje Artístico',
};

export default function GaleriaPage() {
  const searchParams = useSearchParams();
  const servicio = searchParams.get('servicio') || '';

  const fotos = galleryData[servicio as keyof typeof galleryData] || Object.values(galleryData).flat();
  const titulo = serviceTitles[servicio as keyof typeof serviceTitles] || 'Toda la Galería';

  return (
    <div className="min-h-screen bg-black text-white px-4 py-16 pt-24">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-serif mb-4">
            Galería {titulo && `- ${titulo}`}
          </h1>
          <Link href="/servicios" className="text-rose-400 hover:text-white text-lg">
            ← Volver a Servicios
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
  {fotos.map((src, i) => (
    <div
        key={i}
        className="group relative overflow-hidden rounded-2xl shadow-2xl border border-gray-800 cursor-pointer aspect-[3/4]"
        >
        <Image
            src={src}
            alt={`Foto ${i + 1} de ${titulo}`}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
            <p className="text-white font-medium">Ver en grande</p>
        </div>
        </div>
    ))}
    </div>

        {/* Botón reserva */}
        <div className="text-center mt-16">
          <Link
            href={`/citas?servicio=${servicio}`}
            className="inline-block bg-rose-600 hover:bg-rose-700 text-white font-bold text-2xl px-12 py-6 rounded-full shadow-2xl hover:scale-105 transition-all duration-300"
          >
            ¡Reservar Cita Ahora!
          </Link>
        </div>
      </div>
    </div>
  );
}