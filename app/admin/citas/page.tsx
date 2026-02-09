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
  profiles?: { email: string; phone?: string }; // join con profiles
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
      const { data, error } = await supabase
        .from('appointments')
        .select(`
          *,
          profiles!left (email, phone),
          services!left (name)
        `)
        .order('appointment_date', { ascending: true });

      if (error) setError(error.message);
      else setAppointments(data || []);
      setLoading(false);
    };

    fetchAppointments();
  }, [user]);

  const updateStatus = async (id: number, newStatus: string, note?: string, price?: number) => {
    const updateData: any = { status: newStatus };
    if (note) updateData.admin_note = note;
    if (price !== undefined) updateData.adjusted_price = price;

    const { error } = await supabase.from('appointments').update(updateData).eq('id', id);

    if (error) {
      setError(error.message);
    } else {
      setAppointments(appointments.map(a => a.id === id ? { ...a, ...updateData } : a));
    }
  };

  const openWhatsApp = (phone?: string) => {
    if (!phone) {
      alert('El cliente no tiene número registrado');
      return;
    }
    const cleanPhone = phone.replace(/\D/g, '');
    window.open(`https://wa.me/${cleanPhone}`, '_blank');
  };

  if (user?.role !== 'admin') return <div>Acceso solo para administradores</div>;
  if (loading) return <div>Cargando citas...</div>;

  return (
    <div className="min-h-screen bg-neutral-950 p-8 text-white">
      <h1 className="text-4xl font-bold text-pink-500 mb-8">Gestión de Citas</h1>

      {error && <p className="text-red-500 mb-6">{error}</p>}

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-neutral-800">
              <th className="p-4">Cliente</th>
              <th className="p-4">Servicio</th>
              <th className="p-4">Fecha / Hora</th>
              <th className="p-4">Comentario cliente</th>
              <th className="p-4">Estado</th>
              <th className="p-4">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((appt) => (
              <tr key={appt.id} className="border-b border-neutral-800 hover:bg-neutral-900">
                <td className="p-4">{appt.profiles?.email || 'Sin email'}</td>
                <td className="p-4">{appt.services?.name || 'Servicio eliminado'}</td>
                <td className="p-4">
                  {appt.appointment_date} {appt.appointment_time}
                </td>
                <td className="p-4 max-w-xs truncate">{appt.client_comment || '-'}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-sm ${
                    appt.status === 'pending' ? 'bg-yellow-600' :
                    appt.status === 'confirmed' ? 'bg-green-600' :
                    appt.status === 'cancelled' ? 'bg-red-600' : 'bg-blue-600'
                  }`}>
                    {appt.status}
                  </span>
                </td>
                <td className="p-4 flex gap-3 flex-wrap">
                  {appt.status === 'pending' && (
                    <>
                      <button
                        onClick={() => updateStatus(appt.id, 'confirmed')}
                        className="bg-green-600 px-3 py-1 rounded hover:bg-green-700 text-sm"
                      >
                        Confirmar
                      </button>
                      <button
                        onClick={() => updateStatus(appt.id, 'cancelled')}
                        className="bg-red-600 px-3 py-1 rounded hover:bg-red-700 text-sm"
                      >
                        Cancelar
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => openWhatsApp(appt.profiles?.phone)}
                    className="bg-green-700 px-3 py-1 rounded hover:bg-green-800 text-sm"
                  >
                    WhatsApp
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {appointments.length === 0 && (
        <p className="text-center text-neutral-400 mt-12">No hay citas pendientes.</p>
      )}
    </div>
  );
}