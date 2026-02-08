'use client';

import Link from 'next/link';

// Datos de servicios (más adelante vendrán de Supabase)
const services = [
  {
    slug: 'bodas',
    title: 'Maquillaje para Bodas',
    description: 'Look impecable y duradero para que brilles en tu día más especial. Incluye prueba previa y retoques el día del evento.',
    image: '/bodas.jpeg',
    priceRange: 'Desde $80',
  },
  {
    slug: 'quince',
    title: 'Maquillaje para 15 Años',
    description: 'Estilo fresco, juvenil y glamoroso que captura la magia de esta transición única.',
    image: '/15age.jpeg',
    priceRange: 'Desde $60',
  },
  {
    slug: 'eventos',
    title: 'Maquillaje para Eventos Especiales',
    description: 'Personalizado para cualquier ocasión: graduaciones, cumpleaños, galas o noches importantes.',
    image: '/eventosEspeciales.jpeg',
    priceRange: 'Desde $50',
  },
  {
    slug: 'fotos',
    title: 'Maquillaje para Sesiones de Fotos',
    description: 'Resalta tus rasgos bajo cualquier iluminación. Ideal para book fotográfico, redes sociales o portafolio.',
    image: '/fotos.jpeg',
    priceRange: 'Desde $45',
  },
  {
    slug: 'artistico',
    title: 'Maquillaje Artístico',
    description: 'Diseños creativos y audaces: fantasía, editorial, cosplay o looks de impacto para eventos temáticos.',
    image: '/artistico.jpeg',
    priceRange: 'Desde $70',
  },
];

export default function ServiciosPage() {
  return (
    <div className="min-h-screen bg-black text-white px-4 py-16 pt-24">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-serif text-center mb-16">Nuestros Servicios</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8">
          {services.map((service) => (
            <div
              key={service.slug}
              className="bg-gray-900 rounded-2xl overflow-hidden shadow-2xl border border-gray-800 hover:border-accent transition-all duration-300 group"
            >
              <div className="relative h-64 overflow-hidden">
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              </div>

              <div className="p-6">
                <h3 className="text-2xl font-serif mb-3 text-accent group-hover:text-white transition-colors">
                  {service.title}
                </h3>
                <p className="text-gray-300 mb-4 line-clamp-3">
                  {service.description}
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-medium text-white">{service.priceRange}</span>
                  <Link
  href={`/galeria?servicio=${service.slug}`}
  className="bg-accent text-black font-semibold px-5 py-2 rounded-full hover:bg-white hover:text-black transition"
>
  Ver galería
</Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to action */}
        <div className="text-center mt-16">
          <Link
            href="/citas"
            className="inline-block bg-rose-600 text-white font-bold text-xl px-10 py-5 rounded-full shadow-2xl hover:bg-rose-700 hover:scale-105 transition-all duration-300"
          >
            ¡Reservar Cita Ahora!
          </Link>
        </div>
      </div>
    </div>
  );
}