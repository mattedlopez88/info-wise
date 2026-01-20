'use client';

import { useAuth } from '@/src/context/AuthContext';
import { login as loginService }  from '@/src/lib/api/auth.service';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LoginPage() {
  const router = useRouter();
  const login = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [touched, setTouched] = useState({ email: false, password: false });

  const emailError = useMemo(() => {
    if (!touched.email) return '';
    if (!email) return 'Correo es obligatorio.';
    if (!emailRegex.test(email)) return 'Ingresa un correo válido.';
    return '';
  }, [email, touched.email]);

  const passwordError = useMemo(() => {
    if (!touched.password) return '';
    if (!password) return 'Contraseña es obligatoria.';
    if (password.length < 8) return 'Usa al menos 8 caracteres.';
    return '';
  }, [password, touched.password]);

  const canSubmit = emailRegex.test(email) && password.length >= 8;

  const HandleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await loginService(email, password);
      console.log('Login successful:', res);
      login?.login(res);
      router.push('/');
    } catch (e) {
      console.error('Login failed:', e);
    }
   }

  return (
    <div className="min-h-screen bg-[#ECEADE] text-slate-900">
      <div className="relative min-h-screen overflow-hidden">
        <div className="pointer-events-none absolute left-[-140px] top-[-120px] h-[340px] w-[340px] rounded-full bg-[#f9ddc6]/70 blur-3xl" />
        <div className="pointer-events-none absolute bottom-[-180px] right-[-120px] h-[320px] w-[320px] rounded-full bg-[#cfe1d4]/80 blur-3xl" />

        <div className="relative mx-auto flex min-h-screen w-150 max-w-6xl flex-col gap-10 px-6 py-12 lg:flex-row lg:items-center">
          <div className="flex-1">
            <h1
              className="mt-6 text-3xl font-semibold text-slate-900 sm:text-4xl"
              style={{ fontFamily: 'var(--font-fraunces)' }}
            >
              Inicia Sesion
            </h1>

            <div className="mt-8 rounded-[28px] border border-slate-200/80 bg-white/90 p-6 shadow-[0_24px_60px_-50px_rgba(15,23,42,0.6)] sm:p-8">
              <form
                className="mt-6 grid gap-5"
                onSubmit={HandleSubmit}
              >
                <label className="grid gap-2 text-sm text-slate-700">
                  Correo
                  <input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    onBlur={() => setTouched((prev) => ({ ...prev, email: true }))}
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 shadow-sm focus:border-slate-400 focus:outline-none"
                    placeholder="hola@infowise.news"
                    aria-invalid={Boolean(emailError)}
                    aria-describedby="email-error"
                  />
                  {emailError ? (
                    <span id="email-error" className="text-xs text-rose-600">
                      {emailError}
                    </span>
                  ) : null}
                </label>

                <label className="grid gap-2 text-sm text-slate-700">
                  Contraseña
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      onBlur={() => setTouched((prev) => ({ ...prev, password: true }))}
                      className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 pr-20 text-sm text-slate-800 shadow-sm focus:border-slate-400 focus:outline-none"
                      placeholder="Ingresa tu contraseña"
                      aria-invalid={Boolean(passwordError)}
                      aria-describedby="password-error"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium uppercase tracking-[0.2em] text-slate-500"
                    >
                      {showPassword ? 'Ocultar' : 'Mostrar'}
                    </button>
                  </div>
                  {passwordError ? (
                    <span id="password-error" className="text-xs text-rose-600">
                      {passwordError}
                    </span>
                  ) : null}
                </label>

                <div className="flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-400"
                    />
                    Mantener sesión iniciada
                  </label>
                  <button type="button" className="text-slate-600 underline-offset-4 hover:underline">
                    ¿Olvidaste tu contraseña?
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={!canSubmit}
                  className="mt-2 w-full rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-900/20 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:bg-slate-400"
                >
                  Iniciar sesión
                </button>
              </form>

              <p className="mt-6 text-xs text-slate-500">
                New to InfoWise?{' '}
                <Link className="font-semibold text-slate-700 hover:underline" href="/register">
                  Crea tu cuenta
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
