'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { register } from '@/src/lib/api/auth.service';
import { useRouter } from 'next/navigation';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function RegisterPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  // const [confirmEmail, setConfirmEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [touched, setTouched] = useState({
    fullName: false,
    email: false,
    confirmEmail: false,
    password: false,
    confirmPassword: false,
  });

  const emailError = useMemo(() => {
    if (!touched.email) return '';
    if (!email) return 'Email is required.';
    if (!emailRegex.test(email)) return 'Enter a valid email address.';
    return '';
  }, [email, touched.email]);

  const passwordError = useMemo(() => {
    if (!touched.password) return '';
    if (!password) return 'Password is required.';
    if (password.length < 8) return 'Use at least 8 characters.';
    return '';
  }, [password, touched.password]);

  const confirmPasswordError = useMemo(() => {
    if (!touched.confirmPassword) return '';
    if (!confirmPassword) return 'Confirm your password.';
    if (password !== confirmPassword) return 'Passwords do not match.';
    return '';
  }, [password, confirmPassword, touched.confirmPassword]);

  const nameError = useMemo(() => {
    if (!touched.fullName) return '';
    if (!fullName.trim()) return 'Full name is required.';
    return '';
  }, [fullName, touched.fullName]);

  const passwordChecks = [
    { label: 'At least 8 characters', valid: password.length >= 8 },
    { label: 'One number', valid: /\d/.test(password) },
    { label: 'One letter', valid: /[A-Za-z]/.test(password) },
  ];

  const canSubmit =
    // fullName.trim().length > 0 &&
    emailRegex.test(email) &&
    password.length >= 8 &&
    /\d/.test(password) &&
    /[A-Za-z]/.test(password) &&
    password === confirmPassword;

  const handleSubmt = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await register(email, password);
      router.push('/login');
    } catch (e) {
      console.error('Registration failed:', e);
    }
  }

  return (
    <div className="min-h-screen bg-[#ECEADE] text-slate-900">
      <div className="relative min-h-screen overflow-hidden">
        <div className="pointer-events-none absolute left-[-140px] top-[-120px] h-[340px] w-[340px] rounded-full bg-[#f9ddc6]/70 blur-3xl" />
        <div className="pointer-events-none absolute bottom-[-180px] right-[-120px] h-[320px] w-[320px] rounded-full bg-[#cfe1d4]/80 blur-3xl" />

        <div className="relative mx-auto flex min-h-screen w-150 max-w-6xl flex-col gap-10 px-6 py-12 lg:flex-row lg:items-center">
          <div className="flex-1">
            <div className="inline-flex items-center gap-3 rounded-full border border-slate-200 bg-white/80 px-4 py-2 text-xs uppercase tracking-[0.32em] text-slate-500">
              Nuevo Miembro
            </div>
            <h1
              className="mt-6 text-3xl font-semibold text-slate-900 sm:text-4xl"
              style={{ fontFamily: 'var(--font-fraunces)' }}
            >
              Crea tu cuenta de InfoWise
            </h1>

            <div className="mt-8 rounded-[28px] border border-slate-200/80 bg-white/90 p-6 shadow-[0_24px_60px_-50px_rgba(15,23,42,0.6)] sm:p-8">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.35em] text-slate-500">InfoWise</p>
                  <p
                    className="text-xl font-semibold text-slate-900"
                    style={{ fontFamily: 'var(--font-fraunces)' }}
                  >
                    Regístrate
                  </p>
                </div>
              </div>

              <form
                className="mt-6 grid gap-5"
                onSubmit={handleSubmt}
              >
                {/* <label className="grid gap-2 text-sm text-slate-700">
                  Nombre
                  <input
                    type="text"
                    value={fullName}
                    onChange={(event) => setFullName(event.target.value)}
                    onBlur={() => setTouched((prev) => ({ ...prev, fullName: true }))}
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 shadow-sm focus:border-slate-400 focus:outline-none"
                    placeholder="Alex Rivera"
                    aria-invalid={Boolean(nameError)}
                    aria-describedby="fullname-error"
                  />
                  {nameError ? (
                    <span id="fullname-error" className="text-xs text-rose-600">
                      {nameError}
                    </span>
                  ) : null}
                </label> */}

                <label className="grid gap-2 text-sm text-slate-700">
                  Correo
                  <input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    onBlur={() => setTouched((prev) => ({ ...prev, email: true }))}
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 shadow-sm focus:border-slate-400 focus:outline-none"
                    placeholder="hello@infowise.news"
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
                      placeholder="Create a password"
                      aria-invalid={Boolean(passwordError)}
                      aria-describedby="password-error"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium uppercase tracking-[0.2em] text-slate-500"
                    >
                      {showPassword ? 'Hide' : 'Show'}
                    </button>
                  </div>
                  {passwordError ? (
                    <span id="password-error" className="text-xs text-rose-600">
                      {passwordError}
                    </span>
                  ) : null}
                </label>

                <label className="grid gap-2 text-sm text-slate-700">
                  Confirmar contraseña
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    onBlur={() => setTouched((prev) => ({ ...prev, confirmPassword: true }))}
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 shadow-sm focus:border-slate-400 focus:outline-none"
                    placeholder="Repeat your password"
                    aria-invalid={Boolean(confirmPasswordError)}
                    aria-describedby="confirm-password-error"
                  />
                  {confirmPasswordError ? (
                    <span id="confirm-password-error" className="text-xs text-rose-600">
                      {confirmPasswordError}
                    </span>
                  ) : null}
                </label>

                <div className="rounded-2xl border border-slate-200/80 bg-[#f8f1e4] p-4 text-xs text-slate-600">
                  <p className="text-[11px] uppercase tracking-[0.32em] text-slate-500">Password checks</p>
                  <div className="mt-3 grid gap-2">
                    {passwordChecks.map((item) => (
                      <div key={item.label} className="flex items-center gap-2">
                        <span
                          className={`h-2 w-2 rounded-full ${
                            item.valid ? 'bg-emerald-500' : 'bg-slate-300'
                          }`}
                        />
                        <span>{item.label}</span>
                      </div>
                    ))}
                    <div className="flex items-center gap-2">
                      <span
                        className={`h-2 w-2 rounded-full ${
                          password && confirmPassword && password === confirmPassword
                            ? 'bg-emerald-500'
                            : 'bg-slate-300'
                        }`}
                      />
                      <span>Contraseña coincide</span>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={!canSubmit}
                  className="mt-2 w-full rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-900/20 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:bg-slate-400"
                >
                  Crear cuenta
                </button>
              </form>

              <p className="mt-6 text-xs text-slate-500">
                ¿Ya tienes una cuenta?{' '}
                <Link className="font-semibold text-slate-700 hover:underline" href="/login">
                  Iniciar sesión
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
