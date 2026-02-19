'use client';

import { useState, useEffect, Fragment, Suspense } from 'react';
import { Calendar, dateFnsLocalizer, ToolbarProps } from 'react-big-calendar';
import { format } from 'date-fns/format';
import { parse } from 'date-fns/parse';
import { startOfWeek } from 'date-fns/startOfWeek';
import { getDay } from 'date-fns/getDay';
import { es } from 'date-fns/locale/es';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Dialog, Transition } from '@headlessui/react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';
import { useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { useAuthStore } from '@/lib/store/authStore';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

// --- Interfaces ---
interface ServiceItem {
  id: number;
  name: string;
}

interface CustomToolbarProps extends ToolbarProps<any, any> {}

const locales = { 'es': es };
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const defaultAvailableHours24 = [
  '09:00', '10:00', '11:00', '12:00', '13:00', '14:00',
  '15:00', '16:00', '17:00', '18:00', '19:00',
];

const formatTo12Hour = (time24: string) => {
  const [hour, minute] = time24.split(':').map(Number);
  const period = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 || 12;
  return `${hour12.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')} ${period}`;
};

const occupiedSlots: { [date: string]: string[] } = {
  '2026-02-01': ['10:00', '14:00'],
  '2026-02-05': ['09:00', '15:00'],
};

// Componente Toolbar
const CustomToolbar = ({ label, onNavigate }: CustomToolbarProps) => (
  <div className="flex flex-wrap items-center justify-between gap-3 mb-4 p-3 bg-neutral-800 rounded-lg text-sm text-white">
    <button type="button" onClick={() => onNavigate('PREV')} className="flex items-center hover:text-pink-400 transition">
      <ChevronLeftIcon className="h-5 w-5 mr-1" /> Anterior
    </button>
    <span className="text-lg font-serif font-medium capitalize">{label}</span>
    <button type="button" onClick={() => onNavigate('NEXT')} className="flex items-center hover:text-pink-400 transition">
      Siguiente <ChevronRightIcon className="h-5 w-5 ml-1" />
    </button>
  </div>
);

// Componente con la lógica principal
function CitasContent() {
  const { user } = useAuthStore();
  const searchParams = useSearchParams();
  const preSelectedServicio = searchParams.get('servicio') || '';

  const [services, setServices] = useState<ServiceItem[]>([]);
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

  useEffect(() => {
    const fetchServices = async () => {
      const { data, error } = await supabase
        .from('services')
        .select('id, name')
        .eq('is_active', true)
        .order('name');

      if (error) console.error('Error:', error);
      else setServices((data as ServiceItem[]) || []);
      setLoadingServices(false);
    };
    fetchServices();
  }, []);

  const handleReserve = async () => {
    if (!user) return alert('Debes iniciar sesión para reservar');
    if (!selectedSlot || !selectedTime || !formData.servicio || !formData.telefono) {
      return alert('Completa todos los campos requeridos');
    }

    const selectedService = services.find(s => s.name === formData.servicio);
    if (!selectedService) return alert('Servicio no encontrado');

    const appointmentData = {
      user_id: user.id,
      service_id: selectedService.id,
      appointment_date: format(selectedSlot.start, 'yyyy-MM-dd'),
      appointment_time: selectedTime + ':00',
      status: 'pending',
      client_comment: formData.notas || null,
      phone: formData.telefono,
      created_at: new Date().toISOString(),
    };

    const { error } = await supabase.from('appointments').insert(appointmentData);

    if (error) {
      alert('Error al reservar: ' + error.message);
    } else {
      alert('¡Cita reservada con éxito!');
      resetState();
    }
  };

  const resetState = () => {
    setFormData({ nombre: '', telefono: '', servicio: '', notas: '' });
    setSelectedTime(null);
    setSelectedSlot(null);
    setIsModalOpen(false);
  };

  const handleSelectSlot = (slotInfo: { start: Date; end: Date }) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (slotInfo.start < today) return alert('No puedes seleccionar fechas pasadas');
    
    setSelectedSlot(slotInfo);
    setSelectedTime(null);
    setIsModalOpen(true);
  };

  const getAvailableTimesForDate = (date: Date) => {
    const fechaFormato = format(date, 'yyyy-MM-dd');
    const occupied = occupiedSlots[fechaFormato] || [];
    return defaultAvailableHours24.filter(time => !occupied.includes(time));
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white px-4 py-16 pt-24">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-serif text-center mb-12">Reservar tu Cita</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="bg-neutral-900 p-6 rounded-xl border border-neutral-800 shadow-2xl">
            <h2 className="text-2xl font-serif mb-6 text-center text-pink-500">1. Elige una fecha</h2>
            <Calendar
              localizer={localizer}
              events={[] as any}
              startAccessor="start"
              endAccessor="end"
              style={{ height: 480 }}
              culture="es"
              selectable
              onSelectSlot={handleSelectSlot}
              defaultView="month"
              views={['month']}
              components={{ 
                toolbar: CustomToolbar as React.ComponentType<ToolbarProps<any, any>> 
              }}
              className="text-white custom-calendar"
            />
          </div>

          <div className="bg-neutral-900 p-8 rounded-xl border border-neutral-800 shadow-2xl">
            <h2 className="text-2xl font-serif mb-8 text-center text-pink-500">2. Tus datos</h2>
            <form onSubmit={(e) => { e.preventDefault(); handleReserve(); }} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2 text-neutral-300">Nombre completo</label>
                <input
                  type="text"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  required
                  className="w-full p-3 bg-neutral-800 border border-neutral-700 rounded-lg outline-none focus:border-pink-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-neutral-300">WhatsApp</label>
                <PhoneInput
                  country="sv"
                  value={formData.telefono}
                  onChange={(val) => setFormData({ ...formData, telefono: val })}
                  containerClass="!w-full"
                  inputClass="!w-full !bg-neutral-800 !border-neutral-700 !text-white !h-12"
                  buttonClass="!bg-neutral-800 !border-neutral-700"
                  dropdownClass="!bg-neutral-900 !text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-neutral-300">Servicio</label>
                <select
                  value={formData.servicio}
                  onChange={(e) => setFormData({ ...formData, servicio: e.target.value })}
                  required
                  className="w-full p-3 bg-neutral-800 border border-neutral-700 rounded-lg outline-none focus:border-pink-500 text-white"
                >
                  <option value="">Selecciona un servicio</option>
                  {services.map((srv) => (
                    <option key={srv.id} value={srv.name}>{srv.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-neutral-300">Notas</label>
                <textarea
                  value={formData.notas}
                  onChange={(e) => setFormData({ ...formData, notas: e.target.value })}
                  rows={3}
                  className="w-full p-3 bg-neutral-800 border border-neutral-700 rounded-lg outline-none focus:border-pink-500"
                />
              </div>

              <button 
                type="submit"
                disabled={!selectedTime}
                className={`w-full py-4 rounded-full font-bold text-lg shadow-lg transition-all ${
                  selectedTime ? 'bg-pink-600 hover:bg-pink-700 scale-105' : 'bg-neutral-700 opacity-50 cursor-not-allowed'
                }`}
              >
                {selectedTime ? `Confirmar para las ${formatTo12Hour(selectedTime)}` : 'Elige fecha y hora'}
              </button>
            </form>
          </div>
        </div>
      </div>

      <Transition appear show={isModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setIsModalOpen(false)}>
          <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
            <div className="fixed inset-0 bg-black/80" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-neutral-900 p-6 text-left shadow-2xl border border-neutral-800">
                  <Dialog.Title as="h3" className="text-xl font-medium text-white mb-4">
                    Horas para el {selectedSlot ? format(selectedSlot.start, 'dd/MM/yyyy') : ''}
                  </Dialog.Title>

                  <div className="grid grid-cols-3 gap-3">
                    {selectedSlot && getAvailableTimesForDate(selectedSlot.start).map((time) => (
                      <button
                        key={time}
                        onClick={() => setSelectedTime(time)}
                        className={`p-2 rounded-lg border transition ${
                          selectedTime === time ? 'bg-pink-600 border-pink-600' : 'bg-neutral-800 border-neutral-700 hover:bg-neutral-700'
                        }`}
                      >
                        {formatTo12Hour(time)}
                      </button>
                    ))}
                  </div>

                  <div className="mt-6 flex justify-end gap-3">
                    <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-neutral-400 hover:text-white transition">Cancelar</button>
                    <button 
                      onClick={() => setIsModalOpen(false)} 
                      disabled={!selectedTime}
                      className="px-6 py-2 bg-pink-600 rounded-lg disabled:opacity-50 hover:bg-pink-700 transition"
                    >
                      Confirmar
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

// Exportación final con Suspense Boundary
export default function CitasPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center text-white">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xl font-serif">Cargando sistema de citas...</p>
        </div>
      </div>
    }>
      <CitasContent />
    </Suspense>
  );
}