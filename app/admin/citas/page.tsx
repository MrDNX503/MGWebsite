'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useAuthStore } from '@/lib/store/authStore';

interface Appointment {
  id: number;
  user_id: string;
  service_id: number;
  appointment_date: string;
  appointment_time: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  client_comment: string | null;
  admin_note: string | null;
  adjusted_price: number | null;
  phone: string | null;
  profiles?: { email: string };
  services?: { name: string };
}

export default function AdminCitas() {
  const { user } = useAuthStore();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user?.role !== 'admin') return;

    const fetchAppointments = async () => {
      setLoading(true);
      setError(null);

      try {
        const { data, error } = await supabase
          .from('appointments')
          .select(`
            id,
            user_id,
            service_id,
            appointment_date,
            appointment_time,
            status,
            client_comment,
            admin_note,
            adjusted_price,
            phone,
            profiles!left (email),
            services!left (name)
          `)
          .order('appointment_date', { ascending: true });

        if (error) {
          console.error('Error completo al cargar citas:', error);
          setError(`Error al cargar: ${error.message} (código: ${error.code || 'desconocido'})`);
          return;
        }

        if (!data) {
          setError('No se recibieron datos de Supabase');
          return;
        }

        setAppointments(data);
      } catch (err: any) {
        console.error('Excepción en fetchAppointments:', err);
        setError('Error inesperado al cargar las citas. Revisa la consola.');
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [user]);

  const updateStatus = async (id: number, newStatus: string) => {
    const { error } = await supabase
      .from('appointments')
      .update({ status: newStatus })
      .eq('id', id);

    if (error) {
      setError(error.message);
    } else {
      setAppointments(appointments.map(a => 
        a.id === id ? { ...a, status: newStatus } : a
      ));
    }
  };

  const openWhatsApp = (phone?: string | null) => {
    if (!phone?.trim()) {
      alert('Esta cita no tiene número de teléfono registrado.');
      return;
    }

    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length < 8) {
      alert('Número inválido o incompleto.');
      return;
    }

    window.open(`https://wa.me/${cleanPhone}`, '_blank');
  };

  if (user?.role !== 'admin') {
    return <div className="min-h-screen flex items-center justify-center text-red-400 text-xl">Acceso solo para administradores</div>;
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-white text-xl">Cargando citas...</div>;
  }

  return (
    <div className="min-h-screen bg-neutral-950 p-6 md:p-8 text-white">
      <h1 className="text-3xl md:text-4xl font-bold text-pink-500 mb-8 text-center md:text-left">
        Gestión de Citas
      </h1>

      {error && (
        <div className="bg-red-950/50 border border-red-600 text-red-200 p-4 rounded-lg mb-6 text-center">
          {error}
        </div>
      )}

      {appointments.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-2xl text-neutral-400 mb-4">
            No hay citas registradas aún
          </p>
          <p className="text-neutral-500">
            Cuando los clientes reserven desde la página de citas, aparecerán aquí automáticamente.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-neutral-800 shadow-2xl">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr className="bg-neutral-800">
                <th className="p-4">Cliente</th>
                <th className="p-4">Teléfono</th>
                <th className="p-4">Servicio</th>
                <th className="p-4">Fecha / Hora</th>
                <th className="p-4">Comentario cliente</th>
                <th className="p-4">Estado</th>
                <th className="p-4">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((appt) => (
                <tr key={appt.id} className="border-b border-neutral-800 hover:bg-neutral-900 transition-colors">
                  <td className="p-4">{appt.profiles?.email || 'Sin email'}</td>
                  <td className="p-4 font-medium">
                    {appt.phone ? (
                      <span className="text-green-400">{appt.phone}</span>
                    ) : (
                      <span className="text-neutral-500 italic">No registrado</span>
                    )}
                  </td>
                  <td className="p-4">{appt.services?.name || 'Servicio eliminado'}</td>
                  <td className="p-4 whitespace-nowrap">
                    {appt.appointment_date} <span className="text-neutral-400">•</span> {appt.appointment_time}
                  </td>
                  <td className="p-4 max-w-xs truncate text-neutral-300">
                    {appt.client_comment || <span className="italic text-neutral-500">-</span>}
                  </td>
                  <td className="p-4">
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                      appt.status === 'pending' ? 'bg-yellow-600/80 text-yellow-100' :
                      appt.status === 'confirmed' ? 'bg-green-600/80 text-green-100' :
                      appt.status === 'cancelled' ? 'bg-red-600/80 text-red-100' : 
                      'bg-blue-600/80 text-blue-100'
                    }`}>
                      {appt.status.charAt(0).toUpperCase() + appt.status.slice(1)}
                    </span>
                  </td>
                  <td className="p-4 flex gap-3 flex-wrap">
                    {appt.status === 'pending' && (
                      <>
                        <button
                          onClick={() => updateStatus(appt.id, 'confirmed')}
                          className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg text-sm transition"
                        >
                          Confirmar
                        </button>
                        <button
                          onClick={() => updateStatus(appt.id, 'cancelled')}
                          className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-sm transition"
                        >
                          Cancelar
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => openWhatsApp(appt.phone)}
                      className="bg-green-700 hover:bg-green-800 px-4 py-2 rounded-lg text-sm transition"
                    >
                      WhatsApp
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}