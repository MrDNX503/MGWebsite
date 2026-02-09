'use client';

import { useState, useEffect } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import es from 'date-fns/locale/es';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { ChevronLeftIcon, ChevronRightIcon, CalendarIcon } from '@heroicons/react/24/solid';
import { useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { useAuthStore } from '@/lib/store/authStore';

const locales = { es };
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const defaultAvailableHours = [
  '09:00', '10:00', '11:00', '12:00', '13:00', '14:00',
  '15:00', '16:00', '17:00', '18:00', '19:00',
];

// Horarios ocupados de ejemplo (más adelante desde Supabase)
const occupiedSlots: { [date: string]: string[] } = {
  '2026-02-01': ['10:00', '14:00'],
  '2026-02-05': ['09:00', '15:00'],
  // Agrega más fechas para pruebas si necesitas
};

export default function CitasPage() {
  const { user } = useAuthStore();
  const searchParams = useSearchParams();
  const preSelectedServicio = searchParams.get('servicio') || '';

  const [services, setServices] = useState<any[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<{ start: Date; end: Date } | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    telefono: '',
    servicio: preSelectedServicio,
    notas: '',
  });
  const [loadingServices, setLoadingServices] = useState(true);

  // Cargar servicios reales desde Supabase
  useEffect(() => {
    const fetchServices = async () => {
      const { data, error } = await supabase
        .from('services')
        .select('id, name')
        .eq('is_active', true)
        .order('name');

      if (error) {
        console.error('Error al cargar servicios:', error);
      } else {
        setServices(data || []);
      }
      setLoadingServices(false);
    };
    fetchServices();
  }, []);

  const handleReserve = async () => {
  if (!user) {
    alert('Debes iniciar sesión para reservar');
    return;
  }
  if (!selectedSlot || !selectedTime || !formData.servicio || !formData.telefono) {
    alert('Completa todos los campos requeridos, incluido el teléfono');
    return;
  }

  const selectedService = services.find(s => s.name === formData.servicio);
  if (!selectedService) {
    alert('Servicio no encontrado');
    return;
  }

  const appointmentData = {
    user_id: user.id,
    service_id: selectedService.id,
    appointment_date: selectedSlot.start.toISOString().split('T')[0],
    appointment_time: selectedTime + ':00',
    status: 'pending',
    client_comment: formData.notas || null,
    phone: formData.telefono.trim(),  // ← ← ← Aquí guardamos el teléfono
    created_at: new Date().toISOString(),
  };

  const { error } = await supabase
    .from('appointments')
    .insert(appointmentData);

  if (error) {
    console.error('Error al reservar:', error);
    alert('Error al reservar la cita. Intenta de nuevo.');
  } else {
    alert('¡Cita reservada con éxito! La maquilladora la revisará pronto.');
    // Resetear formulario
    setFormData({ nombre: '', telefono: '', servicio: '', notas: '' });
    setSelectedTime(null);
    setSelectedSlot(null);
    setIsModalOpen(false);
  }
};

  const handleSelectSlot = (slotInfo: { start: Date; end: Date }) => {
    setSelectedSlot(slotInfo);
    setSelectedTime(null);
    setIsModalOpen(true);
  };

  const handleSelectTime = (time: string) => {
    setSelectedTime(time);
  };

  const getAvailableTimesForDate = (date: Date) => {
    const fechaFormato = date.toISOString().split('T')[0];
    const occupied = occupiedSlots[fechaFormato] || [];
    return defaultAvailableHours.filter(time => !occupied.includes(time));
  };

  // Toolbar personalizado
  const CustomToolbar = ({ label, onNavigate }: any) => (
    <div className="flex flex-wrap items-center justify-between gap-3 mb-4 p-3 bg-neutral-800 rounded-lg shadow-md text-sm text-white">
      <button onClick={() => onNavigate('PREV')} className="flex items-center hover:text-pink-400 transition">
        <ChevronLeftIcon className="h-5 w-5 mr-1" /> Anterior
      </button>
      <span className="text-lg font-serif font-medium">{label}</span>
      <button onClick={() => onNavigate('NEXT')} className="flex items-center hover:text-pink-400 transition">
        Siguiente <ChevronRightIcon className="h-5 w-5 ml-1" />
      </button>
      <button onClick={() => onNavigate('TODAY')} className="flex items-center hover:text-pink-400 transition ml-2">
        <CalendarIcon className="h-5 w-5 mr-1" /> Hoy
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-neutral-950 text-white px-4 py-16 pt-24">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-serif text-center mb-12">Reservar tu Cita</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Calendario */}
          <div className="bg-neutral-900 p-6 rounded-xl shadow-2xl border border-neutral-800">
            <h2 className="text-2xl font-serif mb-6 text-center">Selecciona una fecha disponible</h2>
            <Calendar
              localizer={localizer}
              events={[]}
              startAccessor="start"
              endAccessor="end"
              style={{ height: 500 }}
              culture="es"
              selectable
              onSelectSlot={handleSelectSlot}
              defaultView="month"
              views={['month']}
              components={{ toolbar: CustomToolbar }}
              min={new Date()}
              className="text-white bg-neutral-900"
            />
          </div>

          {/* Formulario */}
          <div className="bg-neutral-900 p-8 rounded-xl shadow-2xl border border-neutral-800">
            <h2 className="text-2xl font-serif mb-8 text-center">Completa tus datos</h2>
            <form onSubmit={(e) => { e.preventDefault(); handleReserve(); }} className="space-y-6">
              <div>
                <label className="block font-medium mb-2 text-neutral-300">Nombre completo</label>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  required
                  className="w-full p-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:border-pink-500 focus:ring-1 focus:ring-pink-500 outline-none"
                />
              </div>

              <div>
                <label className="block font-medium mb-2 text-neutral-300">Teléfono (WhatsApp)</label>
                <input
                  type="tel"
                  name="telefono"
                  value={formData.telefono}
                  onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                  required
                  className="w-full p-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:border-pink-500 focus:ring-1 focus:ring-pink-500 outline-none"
                />
              </div>

              <div>
                <label className="block font-medium mb-2 text-neutral-300">Servicio deseado</label>
                {loadingServices ? (
                  <div className="text-neutral-500">Cargando servicios...</div>
                ) : (
                  <select
                    name="servicio"
                    value={formData.servicio}
                    onChange={(e) => setFormData({ ...formData, servicio: e.target.value })}
                    required
                    className="w-full p-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white focus:border-pink-500 focus:ring-1 focus:ring-pink-500 outline-none"
                  >
                    <option value="">Selecciona un servicio</option>
                    {services.map((srv) => (
                      <option key={srv.id} value={srv.name}>
                        {srv.name}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div>
                <label className="block font-medium mb-2 text-neutral-300">Notas adicionales</label>
                <textarea
                  name="notas"
                  value={formData.notas}
                  onChange={(e) => setFormData({ ...formData, notas: e.target.value })}
                  rows={4}
                  className="w-full p-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:border-pink-500 focus:ring-1 focus:ring-pink-500 outline-none"
                  placeholder="Cuéntanos tu idea del maquillaje deseado..."
                />
              </div>

              <button
                type="submit"
                disabled={!selectedTime || loadingServices}
                className={`w-full py-4 rounded-full text-white font-bold text-lg shadow-xl transition-all duration-300 ${
                  selectedTime && !loadingServices
                    ? 'bg-pink-600 hover:bg-pink-700 hover:scale-105 cursor-pointer'
                    : 'bg-neutral-700 cursor-not-allowed opacity-60'
                }`}
              >
                {selectedTime ? 'Confirmar Reserva' : 'Selecciona fecha y hora primero'}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Modal de selección de hora */}
      <Transition appear show={isModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setIsModalOpen(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-70" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-neutral-900 p-6 text-left align-middle shadow-2xl transition-all border border-neutral-800">
                  <Dialog.Title as="h3" className="text-xl font-serif font-medium leading-6 text-white">
                    Horas disponibles para{' '}
                    {selectedSlot?.start.toLocaleDateString('es-SV', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </Dialog.Title>

                  <div className="mt-6 grid grid-cols-3 gap-3">
                    {selectedSlot &&
                      getAvailableTimesForDate(selectedSlot.start).map((time, index) => (
                        <button
                          key={index}
                          onClick={() => handleSelectTime(time)}
                          className={`p-3 rounded-lg border text-center font-medium transition ${
                            selectedTime === time
                              ? 'bg-pink-600 text-white border-pink-600 shadow-md'
                              : 'bg-neutral-800 border-neutral-700 text-white hover:bg-neutral-700'
                          }`}
                        >
                          {time}
                        </button>
                      ))}
                  </div>

                  {selectedSlot && getAvailableTimesForDate(selectedSlot.start).length === 0 && (
                    <p className="mt-6 text-pink-400 text-center font-medium">
                      No hay horas disponibles este día. Elige otra fecha.
                    </p>
                  )}

                  <div className="mt-8 flex justify-end space-x-3">
                    <button
                      type="button"
                      className="px-5 py-2.5 bg-neutral-800 text-white rounded-lg hover:bg-neutral-700 transition"
                      onClick={() => setIsModalOpen(false)}
                    >
                      Cerrar
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
}