"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/lib/store/authStore';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuthStore();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(email.trim(), password);
      router.push(email.trim().toLowerCase() === 'admin@mgmakeup.com' ? '/admin' : '/citas');
    } catch (err: any) {
      setError(err.message || 'Credenciales incorrectas');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-950 px-4 py-12">
      <div className="w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-xl shadow-2xl p-8">
        <h1 className="text-3xl font-serif text-pink-500 text-center mb-8">
          Iniciar Sesión
        </h1>

        {error && (
          <div className="bg-red-900/40 border border-red-600 text-red-200 px-4 py-3 rounded-lg mb-6 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-neutral-300 font-medium mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg 
                         text-white placeholder-neutral-500 focus:outline-none 
                         focus:border-pink-500 focus:ring-2 focus:ring-pink-500/30 transition"
              placeholder="tu@email.com"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-neutral-300 font-medium mb-2">
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg 
                         text-white placeholder-neutral-500 focus:outline-none 
                         focus:border-pink-500 focus:ring-2 focus:ring-pink-500/30 transition"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-pink-600 text-white py-3 rounded-lg font-medium 
                       hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-500/50 
                       transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Iniciando...' : 'Iniciar Sesión'}
          </button>
        </form>

        <p className="mt-6 text-center text-neutral-400">
          ¿No tienes cuenta?{' '}
          <Link href="/register" className="text-pink-500 hover:text-pink-400 underline transition">
            Registrarse
          </Link>
        </p>

        <p className="mt-4 text-center text-neutral-500 text-sm">
          Admin de prueba: <strong>admin@mgmakeup.com</strong> / <strong>admin123</strong>
        </p>
      </div>
    </div>
  );
}