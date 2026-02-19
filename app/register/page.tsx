"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/lib/store/authStore';
import { supabase } from '@/lib/supabaseClient';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css'; 

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
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

      // 2. Esperar sesión activa
      let { data: { session } } = await supabase.auth.getSession();

      if (!session?.user) {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        const retry = await supabase.auth.getSession();
        session = retry.data.session;
        
        if (!session?.user) {
          throw new Error('Cuenta creada, pero no se inició sesión automáticamente.');
        }
      }

      // 3. Guardar teléfono en profiles
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ phone: phone })
        .eq('id', session.user.id);

      if (updateError) throw updateError;

      router.push('/citas');

    } catch (err: unknown) {
      // FIX LÍNEA 54: Validación de tipo para el error
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Ocurrió un error inesperado al registrarse.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-950 px-4 py-12">
      <div className="w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-xl shadow-2xl p-8 md:p-10">
        <h1 className="text-3xl font-serif text-pink-500 text-center mb-8">Crear Cuenta</h1>

        {error && (
          <div className="bg-red-900/40 border border-red-600 text-red-200 px-4 py-3 rounded-lg mb-6 text-center text-sm">
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
              className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:border-pink-500 outline-none transition"
              placeholder="tu@email.com"
              required
            />
          </div>

          <div>
            <label className="block text-neutral-300 font-medium mb-2">Teléfono (WhatsApp)</label>
            <div className="relative">
              <PhoneInput
                country="sv"
                value={phone}
                onChange={(value) => setPhone(value)}
                inputProps={{
                  name: 'phone',
                  required: true,
                  autoFocus: false,
                }}
                containerStyle={{ width: '100%' }}
                inputStyle={{
                  width: '100%',
                  padding: '12px 14px 12px 56px',
                  background: '#1f2937',
                  border: '1px solid #374151',
                  borderRadius: '0.5rem',
                  color: 'white',
                  fontSize: '1rem',
                }}
                buttonStyle={{
                  background: '#374151',
                  border: '1px solid #374151',
                  borderRadius: '0.5rem 0 0 0.5rem',
                }}
                dropdownStyle={{
                  background: '#111827',
                  color: 'white',
                }}
              />
            </div>
          </div>

          <div>
            <label className="block text-neutral-300 font-medium mb-2">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:border-pink-500 outline-none transition"
              placeholder="Mínimo 6 caracteres"
              required
              minLength={6}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-pink-600 text-white py-3 rounded-lg font-medium hover:bg-pink-700 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
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