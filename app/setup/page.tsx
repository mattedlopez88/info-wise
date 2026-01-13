'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { getAllCategories } from '@/src/lib/api/news.service';
import { getUserPreferences, upsertPreferences } from '@/src/lib/api/user.service';
import { useAuth } from '@/src/context/AuthContext';
import type { NewsCategory } from '@/src/types/api/types';
import { useRouter } from 'next/navigation';

const statusCopy: Record<string, string> = {
  idle: 'Pick the beats you want to follow.',
  saving: 'Saving your preferences...',
  saved: 'Preferences saved. Your desk is updated.',
  error: 'We could not save your selections. Try again.',
  empty: 'Choose at least one category to continue.',
  auth: 'Sign in to save your categories.',
};

export default function SetupPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [categories, setCategories] = useState<NewsCategory[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'error' | 'empty' | 'auth'>('idle');

  useEffect(() => {
    let active = true;
    setLoading(true);
    getAllCategories()
      .then((data) => {
        if (!active) return;
        setCategories(data ?? []);
      })
      .catch(() => {
        if (!active) return;
        setCategories([]);
      })
      .finally(() => {
        if (!active) return;
        setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!user?.userId) return;
    getUserPreferences(Number(user.userId))
      .then((data) => {
        if (!data?.categoryIds) return;
        setSelectedIds(data.categoryIds);
      })
      .catch(() => {
        setStatus('idle');
      });
  }, [user?.userId]);

  const canSave = useMemo(() => selectedIds.length > 0 && status !== 'saving', [selectedIds, status]);

  const handleToggle = (id: number) => {
    setSelectedIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((value) => value !== id);
      }
      return [...prev, id];
    });
  };

  const handleSave = async () => {
    if (!isAuthenticated || !user?.userId) {
      setStatus('auth');
      return;
    }

    if (selectedIds.length === 0) {
      setStatus('empty');
      return;
    }

    setStatus('saving');
    try {
      await upsertPreferences(Number(user.userId), selectedIds);
      setStatus('saved');
      router.push('/');
    } catch (error) {
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen bg-[#ECEADE] text-slate-900">
      <div className="relative min-h-screen overflow-hidden">
        <div className="pointer-events-none absolute left-[-140px] top-[-120px] h-[340px] w-[340px] rounded-full bg-[#f9ddc6]/70 blur-3xl" />
        <div className="pointer-events-none absolute bottom-[-180px] right-[-120px] h-[320px] w-[320px] rounded-full bg-[#cfe1d4]/80 blur-3xl" />

        <div className="relative mx-auto flex min-h-screen w-150 max-w-6xl flex-col gap-10 px-6 py-12 lg:flex-row lg:items-center">
          <div className="flex-1">
            <div className="inline-flex items-center gap-3 rounded-full border border-slate-200 bg-white/80 px-4 py-2 text-xs uppercase tracking-[0.32em] text-slate-500">
              Personalización
            </div>
            <h1
              className="mt-6 text-3xl font-semibold text-slate-900 sm:text-4xl"
              style={{ fontFamily: 'var(--font-fraunces)' }}
            >
              Escoge las categorías que te interesan
            </h1>
            <p className="mt-4 max-w-xl text-sm text-slate-600">
              Tu selección determina los resúmenes que se muestran en tu feed. Guardamos la lista una vez
              que confirmes.
            </p>

            <div className="mt-8 rounded-[28px] border border-slate-200/80 bg-white/90 p-6 shadow-[0_24px_60px_-50px_rgba(15,23,42,0.6)] sm:p-8">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.35em] text-slate-500">InfoWise</p>
                  <p
                    className="text-xl font-semibold text-slate-900"
                    style={{ fontFamily: 'var(--font-fraunces)' }}
                  >
                    Setup
                  </p>
                </div>
                <div className="text-xs text-slate-500">
                  {loading ? 'Cargando categorías...' : `${selectedIds.length} seleccionadas`}
                </div>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {categories.map((category) => (
                  <label
                    key={category.newsCategoryId}
                    className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm transition hover:-translate-y-0.5"
                  >
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(category.newsCategoryId)}
                      onChange={() => handleToggle(category.newsCategoryId)}
                      className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-400"
                    />
                    <span>{category.newsCategoryName}</span>
                  </label>
                ))}

                {!loading && categories.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-slate-200 px-4 py-6 text-sm text-slate-500">
                    No hay categorías disponibles aún.
                  </div>
                ) : null}
              </div>

              <div className="mt-6 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
                <span>{statusCopy[status]}</span>
                <div className="flex items-center gap-2">
                  {!isAuthenticated ? (
                    <Link className="font-semibold text-slate-700 hover:underline" href="/login">
                      Iniciar sesión
                    </Link>
                  ) : null}
                  <button
                    type="button"
                    onClick={handleSave}
                    disabled={!canSave}
                    className="rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-white shadow-lg shadow-slate-900/20 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:bg-slate-400"
                  >
                    Guardar
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-4 text-xs text-slate-500">
              <Link className="hover:underline" href="/">
                Back to home
              </Link>
              <Link className="hover:underline" href="/login">
                Iniciar sesión
              </Link>
              <Link className="hover:underline" href="/register">
                Crear cuenta
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
