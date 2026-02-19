'use client';

import Link from 'next/link';
import { useState, useEffect, Suspense } from 'react'; // Añadido Suspense para Next.js
import { useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

interface GalleryItem {
  id: number;
  service_id: number | null;
  image_url: string;
  alt_text: string;
  services?: { name: string; slug: string } | null;
}

// Componente principal con envoltorio de Suspense (Requerido en Next.js al usar useSearchParams)
export default function GaleriaPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-neutral-950 flex items-center justify-center text-white">Cargando...</div>}>
      <GaleriaContent />
    </Suspense>
  );
}

function GaleriaContent() {
  const searchParams = useSearchParams();
  const servicioId = searchParams.get('servicioId');
  const servicioSlug = searchParams.get('servicio');

  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [serviceName, setServiceName] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGallery = async () => {
      setLoading(true);

      // Definimos la query
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

      if (servicioId) {
        query = query.eq('service_id', Number(servicioId));
      } else if (servicioSlug) {
        query = query.eq('services.slug', servicioSlug);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error al cargar galería:', error);
      }

      // FIX LÍNEAS 59-60: Casting de tipo explícito
      const typedData = data as unknown as GalleryItem[];
      setGallery(typedData || []);

      // Obtener nombre del servicio para el título
      if (typedData && typedData.length > 0 && typedData[0].services?.name) {
        setServiceName(typedData[0].services.name);
      } else if (servicioSlug) {
        setServiceName(servicioSlug.replace(/-/g, ' '));
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
      <h1 className="text-4xl md:text-5xl font-bold text-pink-500 text-center mb-12 capitalize">
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
              className="relative group rounded-xl overflow-hidden shadow-2xl bg-neutral-900 border border-neutral-800"
            >
              <img
                src={item.image_url}
                alt={item.alt_text || 'Imagen de galería'}
                className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5">
                <p className="text-lg font-semibold text-white">
                  {item.alt_text || 'Sin descripción'}
                </p>
                <p className="text-sm text-pink-400 mt-1 font-medium">
                  {item.services?.name || 'Servicio general'}
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