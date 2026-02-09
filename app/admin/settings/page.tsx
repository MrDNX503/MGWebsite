"use client";

import { useState } from 'react';
import { useAuthStore } from '@/lib/store/authStore';

export default function AdminSettings() {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const { changePassword } = useAuthStore();

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    try {
      await changePassword(oldPassword, newPassword);
      setSuccess(true);
      setOldPassword('');
      setNewPassword('');
    } catch (err: any) {
      setError(err.message || 'Error al cambiar contraseña');
    }
  };

  return (
    <div className="p-8 bg-white rounded shadow-md max-w-md mx-auto mt-20">
      <h2 className="text-2xl font-bold mb-6 text-center">Cambiar Contraseña</h2>

      {error && <p className="text-red-500 mb-4">{error}</p>}
      {success && <p className="text-green-500 mb-4">¡Contraseña cambiada con éxito!</p>}

      <form onSubmit={handleChangePassword}>
        <div className="mb-4">
          <label className="block mb-2">Contraseña actual</label>
          <input
            type="password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            className="w-full p-3 border rounded"
            required
          />
        </div>
        <div className="mb-6">
          <label className="block mb-2">Nueva contraseña</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full p-3 border rounded"
            required
            minLength={6}
          />
        </div>
        <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700">
          Cambiar
        </button>
      </form>
    </div>
  );
}