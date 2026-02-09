'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function BlogPage() {
  const [username, setUsername] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminInstagram = async () => {
      // Buscamos el username del admin (asumimos solo hay uno o el primero con role 'admin')
      const { data } = await supabase
        .from('profiles')
        .select('instagram_username')
        .eq('role', 'admin')
        .limit(1)
        .single();

      if (data?.instagram_username) {
        setUsername(data.instagram_username);
      }
      setLoading(false);
    };

    fetchAdminInstagram();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center text-white">
        Cargando feed de Instagram...
      </div>
    );
  }

  if (!username) {
    return (
      <div className="min-h-screen bg-neutral-950 p-8 text-white text-center">
        <h1 className="text-4xl font-bold text-pink-500 mb-6">Blog & Instagram</h1>
        <p className="text-xl text-neutral-400">
          Aún no se ha configurado un perfil de Instagram.
        </p>
        <p className="text-neutral-500 mt-4">
          La maquilladora puede configurarlo desde el panel de administración.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 p-6 md:p-12 text-white">
      <h1 className="text-4xl md:text-5xl font-bold text-pink-500 text-center mb-10 md:mb-16">
        Blog & Instagram @{username}
      </h1>

      <div className="max-w-5xl mx-auto bg-neutral-900 rounded-2xl overflow-hidden shadow-2xl border border-neutral-800">
        <iframe
          src={`https://www.instagram.com/${username}/embed`}
          width="100%"
          height="900"
          frameBorder="0"
          scrolling="no"
          allowTransparency={true}
          className="bg-white"
          title="Instagram Feed"
        />
      </div>

      <p className="text-center text-neutral-500 mt-10 text-sm">
        Contenido sincronizado automáticamente desde Instagram.
        <br />
        Visita el perfil completo →{' '}
        <a
          href={`https://www.instagram.com/${username}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-pink-400 hover:text-pink-300 underline"
        >
          @{username}
        </a>
      </p>
    </div>
  );
}