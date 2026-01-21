'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { register } from '@/src/lib/api/auth.service';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/src/context/AuthContext';
import { CheckCircle2, Eye, EyeOff, XCircle } from 'lucide-react';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function RegisterPage() {
  const router = useRouter();
  const auth = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [touched, setTouched] = useState({
    email: false,
    password: false,
    confirmPassword: false,
  });

  const emailError = useMemo(() => {
    if (!touched.email || !email) return null;
    if (!emailRegex.test(email)) return 'Ingresa un correo válido.';
    return null;
  }, [email, touched.email]);

  const passwordError = useMemo(() => {
    if (!touched.password || !password) return null;
    if (password.length < 8) return 'Usa al menos 8 caracteres.';
    return null;
  }, [password, touched.password]);

  const confirmPasswordError = useMemo(() => {
    if (!touched.confirmPassword || !confirmPassword) return null;
    if (password !== confirmPassword) return 'Las contraseñas no coinciden.';
    return null;
  }, [password, confirmPassword, touched.confirmPassword]);

  const passwordChecks = [
    {
      label: 'Al menos 8 caracteres',
      valid: password.length >= 8,
    },
    {
      label: 'Las contraseñas coinciden',
      valid: password !== '' && password === confirmPassword,
    },
  ];

  const canSubmit =
    emailRegex.test(email) &&
    password.length >= 8 &&
    password === confirmPassword;

    const handleSubmt = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!canSubmit) return;
  
      try {
        const res = await register(email, password);
        auth.login(res);
        router.push('/setup');
      } catch (e) {
        console.error('Registration failed:', e);
        // Aquí podrías establecer un estado de error para mostrarlo en la UI
      }
    };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="relative mx-auto max-w-md px-4 py-12">
        <div className="space-y-4 text-center">
          <h1 className="text-3xl font-bold tracking-tight">Crea tu Cuenta</h1>
          <p className="text-slate-600">
            ¿Ya tienes una cuenta?{' '}
            <Link
              href="/login"
              className="font-medium text-slate-900 hover:underline"
            >
              Inicia sesión
            </Link>
          </p>
        </div>

        <form onSubmit={handleSubmt} className="mt-10 space-y-6">
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
              onBlur={() => setTouched((p) => ({ ...p, email: true }))}
              className="w-full rounded-lg border-slate-200 bg-white px-3 py-2 text-sm focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
              placeholder="tu@correo.com"
              required
            />
            {emailError && (
              <p className="text-xs text-red-500">{emailError}</p>
            )}
          </div>

          <div className="space-y-2">
            <label
              htmlFor="password"
              className="text-sm font-medium text-slate-700"
            >
              Contraseña
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onBlur={() => setTouched((p) => ({ ...p, password: true }))}
                className="w-full rounded-lg border-slate-200 bg-white px-3 py-2 pr-10 text-sm focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
                placeholder="Crea una contraseña"
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
            {passwordError && (
              <p className="text-xs text-red-500">{passwordError}</p>
            )}
          </div>

          <div className="space-y-2">
            <label
              htmlFor="confirmPassword"
              className="text-sm font-medium text-slate-700"
            >
              Confirmar Contraseña
            </label>
            <input
              id="confirmPassword"
              type={showPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              onBlur={() => setTouched((p) => ({ ...p, confirmPassword: true }))}
              className="w-full rounded-lg border-slate-200 bg-white px-3 py-2 text-sm focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
              placeholder="Repite tu contraseña"
              required
            />
            {confirmPasswordError && (
              <p className="text-xs text-red-500">{confirmPasswordError}</p>
            )}
          </div>

          {touched.password && (
            <div className="space-y-2 rounded-lg border border-slate-200 bg-white p-4">
              {passwordChecks.map((check) => (
                <div key={check.label} className="flex items-center gap-2">
                  {check.valid ? (
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  ) : (
                    <XCircle className="h-4 w-4 text-slate-400" />
                  )}
                  <span
                    className={`text-xs ${
                      check.valid ? 'text-slate-700' : 'text-slate-500'
                    }`}
                  >
                    {check.label}
                  </span>
                </div>
              ))}
            </div>
          )}

          <button
            type="submit"
            disabled={!canSubmit}
            className="w-full rounded-full bg-slate-900 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-transform hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:bg-slate-400 disabled:hover:scale-100"
          >
            Crear Cuenta
          </button>
        </form>
      </div>
    </div>
  );
}
