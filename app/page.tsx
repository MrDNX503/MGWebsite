"use client"; //
import { motion } from 'framer-motion';

export default function Home() {
  // Datos de servicios (luego lo conectas a Supabase)
  const services = [
    {
      title: 'Maquillaje para Bodas',
      description: 'Transforma tu día especial en un cuento de hadas con un look radiante y duradero que resalte tu belleza natural.',
      image: '/bodas.jpeg',
      galleryLink: '/galeria/bodas',
    },
    {
      title: 'Maquillaje para 15 Años',
      description: 'Celebra tu transición a la adultez con un maquillaje fresco y glamoroso que capture la esencia de tu juventud y elegancia.',
      image: '/15age.jpeg',
      galleryLink: '/galeria/quince',
    },
    {
      title: 'Maquillaje para Eventos Especiales',
      description: 'Brilla en cualquier ocasión con un estilo personalizado que combina tendencias modernas y toques únicos para impresionar.',
      image: '/eventosEspeciales.jpeg',
      galleryLink: '/galeria/eventos',
    },
    {
      title: 'Maquillaje para Fotos',
      description: 'Consigue fotos perfectas con un maquillaje impecable que resalte tus rasgos bajo cualquier luz, ideal para sesiones profesionales.',
      image: '/fotos.jpeg',
      galleryLink: '/galeria/fotos',
    },
    {
      title: 'Maquillaje Artístico',
      description: 'Libera tu creatividad con diseños audaces y coloridos que convierten tu rostro en una obra de arte viva y expresiva.',
      image: '/artistico.jpeg',
      galleryLink: '/galeria/artistico',
    },
  ];

  // Datos de testimonios (6 comentarios)
  const testimonials = [
    { quote: '¡Increíble! Me sentí como una estrella en mi boda.', author: 'Ana R.' },
    { quote: 'El maquillaje duró toda la noche, perfecto para mi fiesta de 15.', author: 'Sofía M.' },
    { quote: 'Profesionalismo y creatividad en cada detalle. ¡Recomendado!', author: 'Laura P.' },
    { quote: 'Mi sesión de fotos salió espectacular gracias a MG MakeUp.', author: 'Carla T.' },
    { quote: 'Arte puro en mi rostro para el carnaval. ¡Asombroso!', author: 'Elena G.' },
    { quote: 'Atención personalizada y resultados impresionantes. Volveré.', author: 'María L.' },
  ];

  return (
    <main className="pt-20">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="relative h-screen flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: 'url(/hero-image.jpg)' }}
      >
        <div className="absolute inset-0 bg-black opacity-40"></div>
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="relative z-10 text-center text-white"
        >
          <h1 className="text-6xl font-serif mb-4">Maquillaje Profesional para Tu Momento Especial</h1>
          <p className="text-xl font-sans mb-8">Descubre la belleza que mereces</p>
          <a
  href="/citas"
  className="
    inline-block
    bg-buttonRed               
    text-white                 
    font-sans font-medium text-lg  
    px-10 py-5                 
    rounded-full               
    shadow-xl                  
    hover:bg-red-600           
    hover:shadow-2xl           
    hover:scale-105            
    transition-all duration-300 ease-in-out 
    focus:outline-none focus:ring-4 focus:ring-red-300 focus:ring-opacity-50 
  "
>
            Reservar Cita
          </a>
        </motion.div>
      </motion.section>

      {/* Sección Servicios Destacados */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-serif text-center mb-12 text-black">Nuestros Servicios</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8"> {/* 5 columnas en grande */}
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ scale: 0.9, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-neutral p-6 rounded shadow hover:shadow-lg transition"
              >
                <img src={service.image} alt={service.title} className="w-full h-48 object-cover mb-4 rounded text-black" /> {/* Tamaño fijo */}
                <h3 className="text-2xl font-serif mb-2 text-black">{service.title}</h3>
                <p className="mb-4 text-black">{service.description}</p>
                <a href={service.galleryLink} className="text-accent hover:underline text-black">Ver galería</a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Sección Testimonios - Carrusel horizontal animado */}
      <section className="py-16 bg-neutral overflow-hidden">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-serif text-center mb-12">Lo que Dicen Nuestras Clientas</h2>
          <motion.div
            className="flex space-x-8"
            animate={{ x: [0, -testimonials.length * 300] }} // Desplazamiento a la derecha (ajusta ancho)
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          >
            {testimonials.concat(testimonials).map((testimonial, index) => ( // Duplico para loop infinito
              <motion.blockquote
                key={index}
                className="bg-white p-6 rounded shadow min-w-[300px]"
              >
                <p className="mb-4 italic text-black">"{testimonial.quote}"</p>
                <cite className="text-right block font-bold text-black">- {testimonial.author}</cite>
              </motion.blockquote>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Botón flotante WhatsApp */}
      <a href="https://wa.me/tu-numero" className="fixed bottom-4 right-4 bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600">WhatsApp</a>
    </main>
  );
}