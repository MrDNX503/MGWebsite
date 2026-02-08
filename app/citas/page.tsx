'use client';

import { useState } from 'react';
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

// Configuración del calendario en español
const locales = { es };
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

// Horarios disponibles por defecto (la maquilladora los configura desde admin)
const defaultAvailableHours = [
  '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00',
];

// Horarios ocupados de ejemplo (más adelante desde Supabase o Google Calendar)
const occupiedSlots: { [date: string]: string[] } = {
  '2026-02-01': ['10:00', '14:00'],
  '2026-02-05': ['09:00', '15:00'],
};

export default function CitasPage() {
  // ¡Aquí dentro del componente! Esto es lo que faltaba
  const searchParams = useSearchParams();
  const preSelectedServicio = searchParams.get('servicio') || '';

  const [selectedSlot, setSelectedSlot] = useState<{ start: Date; end: Date } | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    telefono: '',
    servicio: preSelectedServicio, // ← pre-selecciona si viene de ?servicio=...
    notas: '',
  });

  const handleSelectSlot = (slotInfo: { start: Date; end: Date }) => {
    setSelectedSlot(slotInfo);
    setSelectedTime(null);
    setIsModalOpen(true);
  };

  const handleSelectTime = (time: string) => {
    setSelectedTime(time);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSlot || !selectedTime) {
      alert('Por favor selecciona una fecha y hora primero.');
      return;
    }

    const fechaFormato = selectedSlot.start.toISOString().split('T')[0];
    console.log('Reserva simulada:', {
      fecha: fechaFormato,
      hora: selectedTime,
      ...formData,
    });

    alert(
      `¡Reserva simulada con éxito!\n\n` +
      `Fecha: ${selectedSlot.start.toLocaleDateString('es-SV', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}\n` +
      `Hora: ${selectedTime}\n` +
      `Nombre: ${formData.nombre}\n` +
      `Servicio: ${formData.servicio}\n` +
      `(Guardado real y emails se agregarán más adelante)`
    );

    // Limpieza
    setFormData({ nombre: '', telefono: '', servicio: '', notas: '' });
    setSelectedTime(null);
    setIsModalOpen(false);
  };

  const getAvailableTimesForDate = (date: Date) => {
    const fechaFormato = date.toISOString().split('T')[0];
    const occupied = occupiedSlots[fechaFormato] || [];
    return defaultAvailableHours.filter(time => !occupied.includes(time));
  };

  // Toolbar personalizado (pequeño, espaciado y elegante)
  const CustomToolbar = ({ label, onNavigate }: any) => (
    <div className="flex flex-wrap items-center justify-between gap-3 mb-4 p-3 bg-gray-800 rounded-lg shadow-md text-sm text-white">
      <button onClick={() => onNavigate('PREV')} className="flex items-center hover:text-accent transition">
        <ChevronLeftIcon className="h-5 w-5 mr-1" /> Anterior
      </button>
      <span className="text-lg font-serif font-medium">{label}</span>
      <button onClick={() => onNavigate('NEXT')} className="flex items-center hover:text-accent transition">
        Siguiente <ChevronRightIcon className="h-5 w-5 ml-1" />
      </button>
      <button onClick={() => onNavigate('TODAY')} className="flex items-center hover:text-accent transition ml-2">
        <CalendarIcon className="h-5 w-5 mr-1" /> Hoy
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white px-4 py-16 pt-24">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-serif text-center mb-12">Reservar tu Cita</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Calendario */}
          <div className="bg-gray-900 p-6 rounded-xl shadow-2xl border border-gray-700">
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
              className="text-white"
            />
          </div>

          {/* Formulario con fondo blanco y texto oscuro */}
          <div className="bg-white p-8 rounded-xl shadow-2xl border border-gray-200 text-gray-900">
            <h2 className="text-2xl font-serif mb-8 text-center">Completa tus datos</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block font-medium mb-2 text-gray-800">Nombre completo</label>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleInputChange}
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent bg-white text-gray-900 placeholder-gray-500"
                />
              </div>

              <div>
                <label className="block font-medium mb-2 text-gray-800">Teléfono (WhatsApp)</label>
                <input
                  type="tel"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleInputChange}
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent bg-white text-gray-900 placeholder-gray-500"
                />
              </div>

              <div>
                <label className="block font-medium mb-2 text-gray-800">Servicio deseado</label>
                <select
                  name="servicio"
                  value={formData.servicio}
                  onChange={handleInputChange}
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent bg-white text-gray-900"
                >
                  <option value="">Selecciona...</option>
                  <option value="bodas">Maquillaje para Bodas</option>
                  <option value="quince">Maquillaje para 15 Años</option>
                  <option value="eventos">Eventos Especiales</option>
                  <option value="fotos">Maquillaje para Fotos</option>
                  <option value="artistico">Maquillaje Artístico</option>
                </select>
              </div>

              <div>
                <label className="block font-medium mb-2 text-gray-800">Notas adicionales</label>
                <textarea
                  name="notas"
                  value={formData.notas}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent bg-white text-gray-900 placeholder-gray-500"
                />
              </div>

              <button
                type="submit"
                disabled={!selectedTime}
                className={`w-full py-4 rounded-full text-white font-bold text-lg shadow-xl transition-all duration-300 ${
                  selectedTime
                    ? 'bg-rose-600 hover:bg-rose-700 hover:scale-105 cursor-pointer'
                    : 'bg-gray-500 cursor-not-allowed'
                }`}
              >
                {selectedTime ? 'Confirmar Reserva (Simulada)' : 'Selecciona una hora primero'}
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
            <div className="fixed inset-0 bg-black bg-opacity-40" />
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
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-2xl transition-all border border-gray-200">
                  <Dialog.Title as="h3" className="text-xl font-serif font-medium leading-6 text-gray-900">
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
                              ? 'bg-accent text-white border-accent'
                              : 'hover:bg-gray-100 border-gray-300 text-gray-800'
                          }`}
                        >
                          {time}
                        </button>
                      ))}
                  </div>

                  {selectedSlot && getAvailableTimesForDate(selectedSlot.start).length === 0 && (
                    <p className="mt-6 text-red-600 text-center font-medium">
                      No hay horas disponibles este día. Elige otra fecha.
                    </p>
                  )}

                  <div className="mt-8 flex justify-end space-x-3">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-gray-200 px-5 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2"
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