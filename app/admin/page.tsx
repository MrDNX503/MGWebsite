'use client';

import { useState } from 'react';

export default function AdminPage() {
  const [horarios, setHorarios] = useState(defaultAvailableHours);
  const [occupied, setOccupied] = useState(occupiedSlots);

  const handleAddOccupied = (date: string, time: string) => {
    const newOccupied = { ...occupied };
    if (!newOccupied[date]) newOccupied[date] = [];
    newOccupied[date].push(time);
    setOccupied(newOccupied);
    alert(`Horario bloqueado para ${date} a las ${time}. (Guardar en Supabase/Google más adelante)`);
  };

  // Form para bloquear horarios, etc.

  return (
    <div className="max-w-7xl mx-auto px-4 py-16 pt-24">
      <h1 className="text-4xl font-serif text-center mb-12 text-darkText">Panel de Administración</h1>
      <h2 className="text-2xl mb-6">Setear horarios disponibles</h2>
      {/* Form para agregar/bloquear, CRUD básico */}
      <button className="bg-buttonRed text-white px-4 py-2 rounded">Guardar cambios</button>
    </div>
  );
}