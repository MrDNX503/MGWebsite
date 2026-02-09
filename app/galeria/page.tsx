'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';


interface GalleryItem {
  id: number;
  service_id: number | null;
  image_url: string;
  alt_text: string;
  services?: { name: string; slug: string } | null;
}

export default function GaleriaPage() {
  const searchParams = useSearchParams();
  const servicioId = searchParams.get('servicioId'); // ← nuevo: filtro por ID
  const servicioSlug = searchParams.get('servicio'); // opcional, para compatibilidad

  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [serviceName, setServiceName] = useState<string>(''); // para título
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGallery = async () => {
      setLoading(true);

      let query = supabase
        .from('gallery')
        .select(`
          id,
          image_url,
          alt_text,
          service_id,
          services!left (name, slug)
        `)
        .order('id');

      // Prioridad: filtrar por ID si existe
      if (servicioId) {
        query = query.eq('service_id', Number(servicioId));
      }
      // Fallback: filtrar por slug si no hay ID
      else if (servicioSlug) {
        query = query.eq('services.slug', servicioSlug);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error al cargar galería:', error);
      }

      setGallery(data || []);

      // Obtener nombre del servicio para el título (del primer item o fallback)
      if (data && data.length > 0 && data[0].services?.name) {
        setServiceName(data[0].services.name);
      } else if (servicioSlug) {
        setServiceName(servicioSlug.replace(/-/g, ' ')); // humanizar slug
      }

      setLoading(false);
    };

    fetchGallery();
  }, [servicioId, servicioSlug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center text-white">
        Cargando galería...
      </div>
    );
  }

  const title = servicioId || servicioSlug
    ? `Galería de ${serviceName || 'Servicio seleccionado'}`
    : 'Toda la Galería';

  return (
    <div className="min-h-screen bg-neutral-950 p-8 text-white">
      <h1 className="text-4xl md:text-5xl font-bold text-pink-500 text-center mb-12">
        {title}
      </h1>

      {gallery.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-2xl text-neutral-400 mb-4">
            {servicioId || servicioSlug
              ? `Aún no hay fotos para este servicio`
              : 'No hay imágenes en la galería todavía'}
          </p>
          <p className="text-neutral-500">
            La maquilladora puede agregarlas desde el panel de administración.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {gallery.map((item) => (
            <div
              key={item.id}
              className="relative group rounded-xl overflow-hidden shadow-2xl bg-neutral-900"
            >
              <img
                src={item.image_url}
                alt={item.alt_text || 'Imagen de galería'}
                className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5">
                <p className="text-lg font-semibold text-white drop-shadow-md">
                  {item.alt_text || 'Sin descripción'}
                </p>
                <p className="text-sm text-neutral-300 mt-1 drop-shadow">
                  {item.services?.name || 'Servicio no asociado'}
                </p>
              </div>
            </div>
          ))}
        </div>
        
      )}
      <div className="mt-16 text-center">
  <Link
    href="/citas"
    className="inline-block bg-pink-600 hover:bg-pink-700 text-white font-bold text-lg px-10 py-5 rounded-full shadow-xl transition-all duration-300 transform hover:scale-105"
  >
    ¿Te gustó lo que viste? ¡Agenda tu cita!
  </Link>
</div>
    </div>
  );
}
