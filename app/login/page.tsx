'use client';

import { useAuth } from '@/src/context/AuthContext';
import { login as loginService } from '@/src/lib/api/auth.service';
import { Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSubmit = useMemo(
    () => emailRegex.test(email) && password.length > 0,
    [email, password],
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    try {
      const res = await loginService(email, password);
      login(res);
      router.push('/');
    } catch (err) {
      setError('Credenciales inválidas. Por favor, intenta de nuevo.');
      console.error('Login failed:', err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="relative mx-auto max-w-md px-4 py-12">
        <div className="space-y-4 text-center">
          <h1 className="text-3xl font-bold tracking-tight">Inicia Sesión</h1>
          <p className="text-slate-600">
            ¿No tienes una cuenta?{' '}
            <Link
              href="/register"
              className="font-medium text-slate-900 hover:underline"
            >
              Crea una
            </Link>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-10 space-y-6">
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label
              htmlFor="email"
              className="text-sm font-medium text-slate-700"
            >
              Correo Electrónico
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border-slate-200 bg-white px-3 py-2 text-sm focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
              placeholder="tu@correo.com"
              required
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="text-sm font-medium text-slate-700"
              >
                Contraseña
              </label>
              <Link
                href="#"
                className="text-sm font-medium text-slate-600 hover:underline"
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </div>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border-slate-200 bg-white px-3 py-2 pr-10 text-sm focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
                placeholder="Ingresa tu contraseña"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center px-3 text-slate-500"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center">
            <input
              id="remember-me"
              type="checkbox"
              className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-400"
            />
            <label
              htmlFor="remember-me"
              className="ml-2 block text-sm text-slate-700"
            >
              Mantenerme conectado
            </label>
          </div>

          <button
            type="submit"
            disabled={!canSubmit}
            className="w-full rounded-full bg-slate-900 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-transform hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:bg-slate-400 disabled:hover:scale-100"
          >
            Iniciar Sesión
          </button>
        </form>
      </div>
    </div>
  );
}
