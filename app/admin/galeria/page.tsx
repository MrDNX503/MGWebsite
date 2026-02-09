'use client';
import Link from 'next/link';
import Image from 'next/image';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useAuthStore } from '@/lib/store/authStore';

interface GalleryItem {
  id: number;
  service_id: number;
  image_url: string;
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
  const [formData, setFormData] = useState<Partial<GalleryItem>>({});
  const [file, setFile] = useState<File | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch gallery y services
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const [galleryRes, servicesRes] = await Promise.all([
        supabase.from('gallery').select('*').order('id', { ascending: true }),
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

  // Handle form change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type, checked } = e.target as any;
    setFormData((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  // Handle file change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setFile(e.target.files[0]);
  };

  // Submit: add or edit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    let imageUrl = formData.image_url;

    if (file) {
      // Subir a Storage
      const fileName = `${Date.now()}-${file.name}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('gallery-images')
        .upload(fileName, file);

      if (uploadError) {
        setError(uploadError.message);
        return;
      }

      // Obtener URL pública
      const { data: publicUrlData } = supabase.storage.from('gallery-images').getPublicUrl(fileName);
      imageUrl = publicUrlData.publicUrl;
    }

    const payload = { ...formData, image_url: imageUrl };

    if (editingId) {
      // Update
      const { error } = await supabase.from('gallery').update(payload).eq('id', editingId);
      if (error) setError(error.message);
      else {
        setGallery(gallery.map((g) => (g.id === editingId ? { ...g, ...payload } : g)));
        resetForm();
      }
    } else {
      // Insert
      const { data, error } = await supabase.from('gallery').insert(payload).select();
      if (error) setError(error.message);
      else if (data) setGallery([...gallery, data[0]]);
      resetForm();
    }
  };

  // Delete
  const handleDelete = async (id: number, imageUrl: string) => {
    if (confirm('¿Seguro que quieres eliminar esta imagen?')) {
      // Eliminar de Storage si es de nuestro bucket
      const fileName = imageUrl.split('/').pop();
      if (fileName) await supabase.storage.from('gallery-images').remove([fileName]);

      const { error } = await supabase.from('gallery').delete().eq('id', id);
      if (error) setError(error.message);
      else setGallery(gallery.filter((g) => g.id !== id));
    }
  };

  // Edit mode
  const startEdit = (item: GalleryItem) => {
    setFormData(item);
    setEditingId(item.id);
    setFile(null); // No recargar file al editar
  };

  const resetForm = () => {
    setFormData({});
    setFile(null);
    setEditingId(null);
  };

  if (!user || user.role !== 'admin') return <div>Acceso denegado</div>;
  if (loading) return <div>Cargando galería...</div>;

  return (
    <div className="min-h-screen bg-neutral-950 p-8 text-white">
      <h1 className="text-3xl font-bold text-pink-500 mb-8">Gestión de Galería</h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {/* Formulario */}
      <form onSubmit={handleSubmit} className="bg-neutral-900 p-6 rounded-lg shadow-lg mb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block mb-2 text-neutral-300">Servicio Asociado</label>
            <select
              name="service_id"
              value={formData.service_id || ''}
              onChange={handleChange}
              className="w-full p-3 bg-neutral-800 border border-neutral-700 rounded text-white"
              required
            >
              <option value="">Selecciona un servicio</option>
              {services.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-2 text-neutral-300">Texto Alternativo</label>
            <input
              name="alt_text"
              value={formData.alt_text || ''}
              onChange={handleChange}
              className="w-full p-3 bg-neutral-800 border border-neutral-700 rounded text-white"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block mb-2 text-neutral-300">Subir Imagen (o edita URL existente)</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full p-3 bg-neutral-800 border border-neutral-700 rounded text-white"
            />
            {formData.image_url && (
              <p className="mt-2 text-neutral-500">URL actual: {formData.image_url}</p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="is_before_after"
              checked={formData.is_before_after || false}
              onChange={handleChange}
              className="h-4 w-4"
            />
            <label className="text-neutral-300">Es Antes/Después</label>
          </div>
        </div>
        <div className="flex justify-end mt-6 gap-4">
          <button type="button" onClick={resetForm} className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-700">
            Cancelar
          </button>
          <button type="submit" className="px-4 py-2 bg-pink-600 rounded hover:bg-pink-700">
            {editingId ? 'Actualizar' : 'Agregar Imagen'}
          </button>
        </div>
      </form>

      {/* Grid de imágenes */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {gallery.map((item) => (
          <div key={item.id} className="bg-neutral-900 p-4 rounded-lg shadow relative">
            <img src={item.image_url} alt={item.alt_text} className="w-full h-48 object-cover rounded mb-2" />
            <p className="text-neutral-300">{item.alt_text}</p>
            <p>Servicio ID: {item.service_id}</p>
            <p>{item.is_before_after ? 'Antes/Después' : 'Estándar'}</p>
            <div className="flex justify-end gap-2 mt-4">
              <button onClick={() => startEdit(item)} className="text-blue-500 hover:underline">
                Editar
              </button>
              <button onClick={() => handleDelete(item.id, item.image_url)} className="text-red-500 hover:underline">
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}