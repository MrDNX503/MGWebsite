"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/lib/store/authStore';
import { supabase } from '@/lib/supabaseClient';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css'; // estilo base

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState(''); // número completo con código de país
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { register } = useAuthStore();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // 1. Registrar usuario
      await register(email.trim(), password);

      // 2. Esperar sesión activa (muy importante)
      let session = (await supabase.auth.getSession()).data.session;

      // Retry si no hay sesión inmediata
      if (!session?.user) {
        await new Promise((resolve) => setTimeout(resolve, 2000)); // espera 2s
        session = (await supabase.auth.getSession()).data.session;
        if (!session?.user) {
          throw new Error('No se pudo obtener la sesión del usuario. Intenta iniciar sesión manualmente.');
        }
      }

      // 3. Guardar teléfono en profiles
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ phone:phone }) // guarda con +código país
        .eq('id', session.user.id);

      if (updateError) throw updateError;

      // 4. Redirigir
      router.push('/citas');
    } catch (err: any) {
      setError(err.message || 'Error al registrarse. Verifica los datos e intenta de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-950 px-4">
      <div className="w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-xl shadow-2xl p-8">
        <h1 className="text-3xl font-serif text-pink-500 text-center mb-8">Crear Cuenta</h1>

        {error && (
          <div className="bg-red-900/40 border border-red-600 text-red-200 px-4 py-3 rounded-lg mb-6 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-neutral-300 font-medium mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/30 transition"
              placeholder="tu@email.com"
              required
            />
          </div>

          <div>
            <label className="block text-neutral-300 font-medium mb-2">Teléfono (WhatsApp)</label>
            <PhoneInput
              country="sv" // El Salvador por defecto
              value={phone}
              onChange={setPhone}
              inputClass="!w-full !p-3 !bg-neutral-800 !border !border-neutral-700 !rounded-lg !text-white !placeholder-neutral-500 focus:!border-pink-500 focus:!ring-2 focus:!ring-pink-500/30 !outline-none"
              containerClass="!w-full"
              buttonClass="!bg-neutral-700 !border-neutral-700 !rounded-l-lg !text-white"
              dropdownClass="!bg-neutral-900 !text-white"
              searchClass="!bg-neutral-800 !text-white !placeholder-neutral-400"
              required
            />
            <p className="text-xs text-neutral-500 mt-2">
              Selecciona tu país y escribe tu número
            </p>
          </div>

          <div>
            <label className="block text-neutral-300 font-medium mb-2">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/30 transition"
              placeholder="Mínimo 6 caracteres"
              required
              minLength={6}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-pink-600 text-white py-3 rounded-lg font-medium hover:bg-pink-700 transition disabled:opacity-60"
          >
            {isLoading ? 'Creando cuenta...' : 'Crear Cuenta'}
          </button>
        </form>

        <p className="mt-6 text-center text-neutral-400">
          ¿Ya tienes cuenta?{' '}
          <Link href="/login" className="text-pink-500 hover:text-pink-400 underline transition">
            Iniciar sesión
          </Link>
        </p>
      </div>
    </div>
  );
}