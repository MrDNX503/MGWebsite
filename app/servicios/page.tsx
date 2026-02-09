'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';

interface Service {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: number;
  thumbnail_url?: string;
}

export default function ServiciosPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      const { data } = await supabase.from('services').select('*').eq('is_active', true).order('id');
      setServices(data || []);
      setLoading(false);
    };
    fetchServices();
  }, []);

  if (loading) return <div className="min-h-screen bg-neutral-950 flex items-center justify-center text-white">Cargando servicios...</div>;

  return (
    <div className="min-h-screen bg-neutral-950 p-8 text-white">
      <h1 className="text-4xl font-bold text-pink-500 text-center mb-12">Nuestros Servicios</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {services.map((service) => (
          <div key={service.id} className="bg-neutral-900 rounded-lg shadow-xl overflow-hidden transform hover:scale-105 transition">
            {service.thumbnail_url && (
              <img src={service.thumbnail_url} alt={service.name} className="w-full h-48 object-cover" />
            )}
            <div className="p-6">
              <h2 className="text-2xl font-bold text-pink-500 mb-2">{service.name}</h2>
              <p className="text-neutral-300 mb-4">{service.description}</p>
              <p className="text-lg font-semibold mb-4">Precio: ${service.price}</p>
              <Link
                href={`/galeria?servicioId=${service.id}`}  // ← Cambia a servicioId + ID numérico
                className="block bg-pink-600 text-white py-2 px-4 rounded text-center hover:bg-pink-700 transition"
              >
                Ver Galería
              </Link>
            </div>
          </div>
        ))}
      </div>
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