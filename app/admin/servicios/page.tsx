'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useAuthStore } from '@/lib/store/authStore';

interface Service {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: number | null;
  duration_minutes: number | null;
  thumbnail_url?: string | null;
}

export default function AdminServicios() {
  const { user } = useAuthStore();
  const [services, setServices] = useState<Service[]>([]);
  const [formData, setFormData] = useState<Partial<Service>>({});
  const [file, setFile] = useState<File | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('id', { ascending: true });
      if (error) setError(error.message);
      else setServices(data || []);
      setLoading(false);
    };
    fetchServices();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'price' || name === 'duration_minutes' ? (value ? Number(value) : null) : value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setFile(e.target.files[0]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (!formData.name?.trim()) {
      setError('El nombre es obligatorio');
      return;
    }

    // Generar slug automático y único
    let baseSlug = formData.name
      .trim()
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    let slug = baseSlug || 'servicio';
    let counter = 1;

    while (true) {
      const { data: existing } = await supabase
        .from('services')
        .select('id')
        .eq('slug', slug)
        .neq('id', editingId || 0)
        .limit(1);

      if (!existing?.length) break;
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    let payload = { ...formData, slug };

    // Subir miniatura si hay archivo
    if (file) {
      const fileName = `${Date.now()}-${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from('gallery-images')
        .upload(`thumbnails/${fileName}`, file);

      if (uploadError) {
        setError(`Error al subir imagen: ${uploadError.message}`);
        return;
      }

      const { data: urlData } = supabase.storage.from('gallery-images').getPublicUrl(`thumbnails/${fileName}`);
      payload.thumbnail_url = urlData.publicUrl;
    }

    // Guardar
    if (editingId) {
      const { error } = await supabase.from('services').update(payload).eq('id', editingId);
      if (error) {
        setError(error.message);
      } else {
        setServices(services.map(s => s.id === editingId ? { ...s, ...payload } : s));
        setSuccessMessage('Servicio actualizado con éxito');
        resetForm();
      }
    } else {
      const { data, error } = await supabase.from('services').insert(payload).select();
      if (error) {
        setError(error.message);
      } else if (data?.[0]) {
        setServices([...services, data[0]]);
        setSuccessMessage('Servicio agregado con éxito');
        resetForm();
      }
    }
  };

  const handleDelete = async (id: number, thumbnailUrl?: string | null) => {
    if (!confirm('¿Seguro que quieres eliminar este servicio?')) return;

    if (thumbnailUrl) {
      const filePath = thumbnailUrl.split('/').slice(-2).join('/');
      await supabase.storage.from('gallery-images').remove([filePath]);
    }

    const { error } = await supabase.from('services').delete().eq('id', id);
    if (error) {
      setError(error.message);
    } else {
      setServices(services.filter(s => s.id !== id));
      setSuccessMessage('Servicio eliminado con éxito');
    }
  };

  const startEdit = (service: Service) => {
    setFormData({
      name: service.name,
      description: service.description || '',
      price: service.price,
      duration_minutes: service.duration_minutes,
      thumbnail_url: service.thumbnail_url || undefined,
    });
    setEditingId(service.id);
    setFile(null);
  };

  const resetForm = () => {
    setFormData({});
    setFile(null);
    setEditingId(null);
  };

  if (!user || user.role !== 'admin') return <div className="text-center p-8 text-red-400">Acceso denegado</div>;
  if (loading) return <div className="text-center p-8">Cargando servicios...</div>;

  return (
    <div className="min-h-screen bg-neutral-950 p-6 md:p-8 text-white">
      <h1 className="text-3xl md:text-4xl font-bold text-pink-500 mb-8 text-center md:text-left">
        Gestión de Servicios
      </h1>

      {error && <p className="text-red-500 mb-6 text-center bg-red-950/50 p-4 rounded-lg">{error}</p>}

      {successMessage && (
        <p className="text-green-400 mb-6 text-center bg-green-950/50 p-4 rounded-lg animate-pulse">
          {successMessage}
        </p>
      )}

      <form onSubmit={handleSubmit} className="bg-neutral-900 p-6 md:p-8 rounded-xl shadow-2xl mb-12 max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block mb-2 text-neutral-300 font-medium">Nombre *</label>
            <input
              name="name"
              value={formData.name || ''}
              onChange={handleChange}
              className="w-full p-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white focus:border-pink-500 focus:ring-1 focus:ring-pink-500 outline-none"
              required
            />
          </div>

          <div>
            <label className="block mb-2 text-neutral-300 font-medium">Precio ($)</label>
            <input
              name="price"
              type="number"
              step="0.01"
              value={formData.price ?? ''}
              onChange={handleChange}
              className="w-full p-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white focus:border-pink-500 focus:ring-1 focus:ring-pink-500 outline-none"
              placeholder="Ej: 120.00"
            />
          </div>

          <div>
            <label className="block mb-2 text-neutral-300 font-medium">Duración (minutos)</label>
            <input
              name="duration_minutes"
              type="number"
              value={formData.duration_minutes ?? ''}
              onChange={handleChange}
              className="w-full p-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white focus:border-pink-500 focus:ring-1 focus:ring-pink-500 outline-none"
              placeholder="Ej: 90"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block mb-2 text-neutral-300 font-medium">Descripción</label>
            <textarea
              name="description"
              value={formData.description || ''}
              onChange={handleChange}
              className="w-full p-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white h-32 focus:border-pink-500 focus:ring-1 focus:ring-pink-500 outline-none"
              placeholder="Describe el servicio..."
            />
          </div>

          <div className="md:col-span-2">
            <label className="block mb-2 text-neutral-300 font-medium">Miniatura (subir imagen representativa)</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full p-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white file:bg-pink-600 file:text-white file:border-0 file:px-4 file:py-2 file:rounded file:hover:bg-pink-700 file:cursor-pointer cursor-pointer"
            />
            {formData.thumbnail_url && (
              <div className="mt-4">
                <p className="text-neutral-400 mb-2 text-sm">Miniatura actual:</p>
                <img
                  src={formData.thumbnail_url}
                  alt="Miniatura actual"
                  className="w-32 h-32 object-cover rounded-lg border border-neutral-700"
                />
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-end gap-4 mt-8">
          <button
            type="button"
            onClick={resetForm}
            className="px-6 py-3 bg-neutral-700 text-white rounded-lg hover:bg-neutral-600 transition"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-6 py-3 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition font-medium"
          >
            {editingId ? 'Actualizar Servicio' : 'Agregar Servicio'}
          </button>
        </div>
      </form>

      {/* Lista de servicios */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.length === 0 ? (
          <p className="text-neutral-400 col-span-full text-center py-12">
            No hay servicios aún. Agrega uno arriba.
          </p>
        ) : (
          services.map((service) => (
            <div
              key={service.id}
              className="bg-neutral-900 rounded-xl overflow-hidden shadow-lg border border-neutral-800"
            >
              {service.thumbnail_url ? (
                <img src={service.thumbnail_url} alt={service.name} className="w-full h-48 object-cover" />
              ) : (
                <div className="w-full h-48 bg-neutral-800 flex items-center justify-center text-neutral-500">
                  Sin miniatura
                </div>
              )}
              <div className="p-5">
                <h3 className="text-xl font-bold text-pink-500 mb-2">{service.name}</h3>
                <p className="text-neutral-300 mb-3 line-clamp-3">{service.description || 'Sin descripción'}</p>
                <div className="flex justify-between text-sm text-neutral-400 mb-4">
                  <span>Precio: ${service.price ?? '-'}</span>
                  <span>Duración: {service.duration_minutes ?? '-'} min</span>
                </div>
                <div className="flex justify-end gap-4">
                  <button
                    onClick={() => startEdit(service)}
                    className="text-blue-400 hover:text-blue-300 transition"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(service.id, service.thumbnail_url)}
                    className="text-red-400 hover:text-red-300 transition"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}