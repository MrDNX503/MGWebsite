'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useAuthStore } from '@/lib/store/authStore';

// Interfaz ajustada para reflejar que Supabase devuelve objetos, no siempre arrays en joins simples
interface Appointment {
  id: number;
  appointment_date: string;
  appointment_time: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  client_comment: string | null;
  phone: string | null;
  // Ajustamos el tipado para manejar la respuesta de Supabase
  profiles: { email: string } | any; 
  services: { name: string } | any;
}

export default function AdminCitas() {
  const { user } = useAuthStore();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Seguridad: Solo el admin entra
    if (user?.role !== 'admin') return;

    const fetchAppointments = async () => {
      setLoading(true);
      try {
        // La clave aquí es el select. Usamos !inner o !left para asegurar el join.
        const { data, error: supabaseError } = await supabase
          .from('appointments')
          .select(`
            id, 
            appointment_date, 
            appointment_time,
            status, 
            client_comment, 
            phone,
            profiles (email),
            services (name)
          `)
          .order('appointment_date', { ascending: true });

        if (supabaseError) throw supabaseError;
        
        setAppointments(data as Appointment[]);
      } catch (err: any) {
        setError(err.message || 'Error al cargar citas');
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [user]);

  const updateStatus = async (id: number, newStatus: Appointment['status']) => {
    const { error } = await supabase
      .from('appointments')
      .update({ status: newStatus })
      .eq('id', id);

    if (!error) {
      setAppointments(prev => prev.map(a => (a.id === id ? { ...a, status: newStatus } : a)));
    }
  };

  const openWhatsApp = (phone?: string | null) => {
    if (!phone) return alert('No hay teléfono registrado');
    const cleanPhone = phone.replace(/\D/g, '');
    window.open(`https://wa.me/${cleanPhone}`, '_blank');
  };

  if (user?.role !== 'admin') return <div className="p-10 text-center text-red-500">Acceso denegado</div>;
  if (loading) return <div className="p-10 text-center text-white">Cargando agenda...</div>;

  return (
    <div className="min-h-screen bg-neutral-950 text-white p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-10">
          <h1 className="text-3xl font-serif text-pink-500 border-b border-neutral-800 pb-4">
            Gestión de Citas - MG MakeUp
          </h1>
          <p className="text-neutral-500 mt-2">Citas totales: {appointments.length}</p>
        </header>

        {error && <div className="bg-red-900/20 border border-red-500 p-4 rounded-xl mb-6">{error}</div>}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {appointments.map((appt) => {
            // LÓGICA DE EXTRACCIÓN: 
            // Dependiendo de la versión de PostgREST, Supabase devuelve un objeto o un array de un elemento.
            const clientEmail = Array.isArray(appt.profiles) 
              ? appt.profiles[0]?.email 
              : appt.profiles?.email || 'Email no disponible';

            const serviceName = Array.isArray(appt.services) 
              ? appt.services[0]?.name 
              : appt.services?.name || 'Servicio no identificado';
            
            return (
              <div key={appt.id} className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 shadow-2xl flex flex-col justify-between hover:border-pink-500/30 transition-colors">
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <span className={`text-[10px] font-bold px-3 py-1 rounded-full border uppercase tracking-widest ${
                      appt.status === 'pending' ? 'border-yellow-600 text-yellow-500 bg-yellow-950/20' :
                      appt.status === 'confirmed' ? 'border-green-600 text-green-500 bg-green-950/20' :
                      'border-red-600 text-red-500 bg-red-950/20'
                    }`}>
                      {appt.status}
                    </span>
                    
                    <button 
                      onClick={() => openWhatsApp(appt.phone)}
                      className="bg-[#25D366] p-2 rounded-full hover:scale-110 transition-transform shadow-lg"
                    >
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                      </svg>
                    </button>
                  </div>

                  <h2 className="text-2xl font-serif text-white mb-1 leading-tight">{serviceName}</h2>
                  <p className="text-pink-400 text-sm font-medium mb-5 truncate">{clientEmail}</p>

                  <div className="space-y-4 mb-6">
                    <div className="flex items-center gap-3 text-neutral-300">
                      <span className="bg-neutral-800 p-2 rounded-lg text-lg">📅</span>
                      <span className="font-medium tracking-wide">{appt.appointment_date}</span>
                    </div>
                    <div className="flex items-center gap-3 text-neutral-300">
                      <span className="bg-neutral-800 p-2 rounded-lg text-lg">⏰</span>
                      <span className="font-medium tracking-wide">{appt.appointment_time.slice(0, 5)}</span>
                    </div>
                    <div className="flex items-center gap-3 text-neutral-300">
                      <span className="bg-neutral-800 p-2 rounded-lg text-lg">📞</span>
                      <span className="font-mono text-green-400">{appt.phone || 'No registrado'}</span>
                    </div>
                  </div>

                  {appt.client_comment && (
                    <div className="bg-black/40 p-4 rounded-2xl border-l-4 border-pink-500 mb-6">
                      <p className="text-[10px] text-neutral-500 uppercase font-black mb-1 tracking-widest">Nota del cliente:</p>
                      <p className="text-sm italic text-neutral-200">"{appt.client_comment}"</p>
                    </div>
                  )}
                </div>

                {appt.status === 'pending' && (
                  <div className="flex gap-3 pt-6 border-t border-neutral-800">
                    <button 
                      onClick={() => updateStatus(appt.id, 'confirmed')}
                      className="flex-1 bg-green-600 hover:bg-green-500 text-white py-3 rounded-2xl font-bold transition-all active:scale-95 shadow-lg shadow-green-900/20"
                    >
                      Confirmar
                    </button>
                    <button 
                      onClick={() => updateStatus(appt.id, 'cancelled')}
                      className="flex-1 bg-neutral-800 hover:bg-neutral-700 text-red-400 py-3 rounded-2xl font-bold transition-all active:scale-95"
                    >
                      Rechazar
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}