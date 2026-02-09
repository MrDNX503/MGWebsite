'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useAuthStore } from '@/lib/store/authStore';

export default function AdminBlogConfig() {
  const { user } = useAuthStore();
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!user?.id) return;

    const fetchUsername = async () => {
      setLoading(true);
      const { data } = await supabase
        .from('profiles')
        .select('instagram_username')
        .eq('id', user.id)
        .single();

      if (data?.instagram_username) {
        setUsername(data.instagram_username);
      }
      setLoading(false);
    };

    fetchUsername();
  }, [user]);

  const handleSave = async () => {
    if (!user?.id) return;

    setError(null);
    setSuccess(false);

    const trimmed = username.trim();
    const { error } = await supabase
      .from('profiles')
      .update({ instagram_username: trimmed || null })
      .eq('id', user.id);

    if (error) {
      setError(error.message);
    } else {
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    }
  };

  if (loading) return <div className="p-8 text-center">Cargando...</div>;

  return (
    <div className="min-h-screen bg-neutral-950 p-8 text-white">
      <h1 className="text-4xl font-bold text-pink-500 mb-8">Configuración de Instagram</h1>

      {error && <p className="text-red-500 mb-6 bg-red-950/50 p-4 rounded">{error}</p>}
      {success && <p className="text-green-400 mb-6 bg-green-950/50 p-4 rounded animate-pulse">¡Username guardado!</p>}

      <div className="bg-neutral-900 p-8 rounded-xl max-w-lg mx-auto border border-neutral-800">
        <label className="block text-neutral-300 font-medium mb-3">
          Username de Instagram (sin @)
        </label>
        <div className="flex items-center gap-3 mb-6">
          <span className="text-2xl text-neutral-400">@</span>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="ejemplo: mgmakeup_sv"
            className="flex-1 p-4 bg-neutral-800 border border-neutral-700 rounded-lg text-white focus:border-pink-500 focus:ring-1 focus:ring-pink-500 outline-none"
          />
        </div>

        <p className="text-sm text-neutral-500 mb-8">
          Este username se usará para mostrar tu feed en la página Blog pública.
        </p>

        <div className="flex justify-end gap-4">
          <button
            onClick={() => setUsername('')}
            className="px-6 py-3 bg-neutral-700 hover:bg-neutral-600 rounded-lg transition"
          >
            Limpiar
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-3 bg-pink-600 hover:bg-pink-700 rounded-lg font-medium transition"
          >
            Guardar Username
          </button>
        </div>
      </div>
    </div>
  );
}