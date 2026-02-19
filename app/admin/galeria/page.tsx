'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useAuthStore } from '@/lib/store/authStore';

interface GalleryItem {
  id: number;
  service_id: number;
  image_url?: string;
  alt_text: string;
  is_before_after: boolean;
}

interface Service {
  id: number;
  name: string;
}

export default function AdminGaleria() {
  const { user } = useAuthStore();
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [formData, setFormData] = useState<Partial<GalleryItem>>({
    is_before_after: false,
    alt_text: '',
    service_id: undefined
  });
  const [file, setFile] = useState<File | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false); // Nuevo: estado de carga para el botón
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const [galleryRes, servicesRes] = await Promise.all([
        supabase.from('gallery').select('*').order('id', { ascending: false }),
        supabase.from('services').select('id, name'),
      ]);

      if (galleryRes.error) setError(galleryRes.error.message);
      else setGallery(galleryRes.data || []);

      if (servicesRes.error) setError(servicesRes.error.message);
      else setServices(servicesRes.data || []);

      setLoading(false);
    };
    fetchData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const target = e.target as HTMLInputElement;
    const { name, value, type, checked } = target;
    
    setFormData((prev) => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : (name === 'service_id' ? Number(value) : value) 
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setFile(e.target.files[0]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError(null);
  setSubmitting(true);

  try {
    let imageUrl = formData.image_url;

    if (file) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}-${Date.now()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from('gallery-images')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage.from('gallery-images').getPublicUrl(fileName);
      imageUrl = publicUrlData.publicUrl;
    }

    const payload = {
      service_id: formData.service_id,
      alt_text: formData.alt_text,
      is_before_after: !!formData.is_before_after,
      image_url: imageUrl,
    };

    if (editingId) {
      const { error } = await supabase.from('gallery').update(payload).eq('id', editingId);
      if (error) throw error;
      setGallery(prev => prev.map(g => g.id === editingId ? { ...g, ...payload as GalleryItem } : g));
    } else {
      const { data, error } = await supabase.from('gallery').insert([payload]).select();
      if (error) throw error;
      if (data) setGallery([data[0], ...gallery]);
    }

    resetForm();
  } catch (err: unknown) {
    // FIX LÍNEA 109: Validación de tipo para el error
    if (err instanceof Error) {
      setError(err.message);
    } else {
      setError('Ocurrió un error inesperado');
    }
  } finally {
    setSubmitting(false);
  }
};

// --- DENTRO DEL JSX (CHECKBOX) ---
// FIX LÍNEA 100: Asegurar que checked sea booleano
<input
  type="checkbox"
  name="is_before_after"
  checked={!!formData.is_before_after} // El !! convierte undefined en false
  onChange={handleChange}
  className="h-5 w-5 accent-rose-600"
/>

  const handleDelete = async (id: number, imageUrl?: string) => {
    if (!confirm('¿Seguro que quieres eliminar esta imagen?')) return;

    if (imageUrl) {
      const fileName = imageUrl.split('/').pop()?.split('?')[0]; // Limpia posibles queries de URL
      if (fileName) {
        await supabase.storage.from('gallery-images').remove([fileName]);
      }
    }

    const { error } = await supabase.from('gallery').delete().eq('id', id);
    if (error) setError(error.message);
    else setGallery(gallery.filter((g) => g.id !== id));
  };

  const startEdit = (item: GalleryItem) => {
    setFormData(item);
    setEditingId(item.id);
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Mejora UX
  };

  const resetForm = () => {
    setFormData({ is_before_after: false, alt_text: '', service_id: undefined });
    setFile(null);
    setEditingId(null);
  };

  if (!user || user.role !== 'admin') {
    return <div className="min-h-screen flex items-center justify-center text-red-400">Acceso denegado</div>;
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center text-white">Cargando...</div>;

  return (
    <div className="min-h-screen bg-neutral-950 p-6 md:p-8 text-white">
      {/* ... (Tu JSX de encabezado se mantiene igual) ... */}

      <form onSubmit={handleSubmit} className="bg-neutral-900 p-6 rounded-2xl border border-neutral-800 mb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block mb-2 text-neutral-300">Servicio</label>
            <select
              name="service_id"
              value={formData.service_id || ''}
              onChange={handleChange}
              className="w-full p-3 bg-neutral-800 border border-neutral-700 rounded-lg"
              required
            >
              <option value="">Selecciona un servicio</option>
              {services.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>

          <div>
            <label className="block mb-2 text-neutral-300">Texto Alternativo</label>
            <input
              name="alt_text"
              value={formData.alt_text || ''}
              onChange={handleChange}
              placeholder="Ej: Labios hidratados tras procedimiento"
              className="w-full p-3 bg-neutral-800 border border-neutral-700 rounded-lg"
              required
            />
          </div>

          <div className="md:col-span-2">
            <label className="block mb-2 text-neutral-300">Imagen</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full p-3 bg-neutral-800 border border-neutral-700 rounded-lg"
              required={!editingId} // Obligatorio solo si es nuevo
            />
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              name="is_before_after"
              checked={formData.is_before_after}
              onChange={handleChange}
              className="h-5 w-5 accent-rose-600"
            />
            <span>Es comparativa Antes/Después</span>
          </div>
        </div>

        <div className="flex justify-end mt-8 gap-4">
          <button type="button" onClick={resetForm} className="px-6 py-2 bg-neutral-700 rounded-lg">
            Cancelar
          </button>
          <button 
            type="submit" 
            disabled={submitting}
            className="px-6 py-2 bg-rose-600 rounded-lg disabled:opacity-50"
          >
            {submitting ? 'Procesando...' : editingId ? 'Guardar Cambios' : 'Subir a Galería'}
          </button>
        </div>
      </form>

      {/* Grid de imágenes (Se mantiene igual, solo asegúrate de mostrar el nombre del servicio) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {gallery.map((item) => (
          <div key={item.id} className="bg-neutral-900 rounded-xl overflow-hidden border border-neutral-800">
             <img src={item.image_url} alt={item.alt_text} className="w-full h-48 object-cover" />
             <div className="p-4">
               <p className="text-sm font-bold text-rose-400">
                {services.find(s => s.id === item.service_id)?.name || 'Servicio desconocido'}
               </p>
               <p className="text-xs text-neutral-400 mt-1 line-clamp-1">{item.alt_text}</p>
               <div className="flex justify-between mt-4">
                  <button onClick={() => startEdit(item)} className="text-sm text-blue-400">Editar</button>
                  <button onClick={() => handleDelete(item.id, item.image_url)} className="text-sm text-red-400">Eliminar</button>
               </div>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
}