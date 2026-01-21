"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  CheckCircleIcon,
  ChevronLeftIcon,
  TriangleAlertIcon,
  InfoIcon,
  Loader2,
} from "lucide-react";
import { getAllMacrocategories } from "@/src/lib/api/news.service";
import {
  getUserPreferences,
  upsertPreferences,
} from "@/src/lib/api/user.service";
import { useAuth } from "@/src/context/AuthContext";
import type { MacroCategoryDto } from "@/src/types/api/types";
import { useRouter } from "next/navigation";

type Status = "idle" | "saving" | "saved" | "error" | "empty" | "auth";

const statusCopy: Record<Status, string> = {
  idle: "Escoge tus categorias.",
  saving: "Guardando tus preferencias...",
  saved: "Preferencias guardadas. Tu escritorio está actualizado.",
  error: "No pudimos guardar tus selecciones. Intenta de nuevo.",
  empty: "Elige al menos una categoría para continuar.",
  auth: "Inicia sesión para guardar tus categorías.",
};

function StatusIndicator({ status }: { status: Status }) {
  const Icon = useMemo(() => {
    switch (status) {
      case "saving":
        return <Loader2 className="h-4 w-4 animate-spin" />;
      case "saved":
        return <CheckCircleIcon className="h-4 w-4 text-green-500" />;
      case "error":
        return <TriangleAlertIcon className="h-4 w-4 text-red-500" />;
      case "empty":
        return <InfoIcon className="h-4 w-4 text-yellow-500" />;
      case "auth":
        return <InfoIcon className="h-4 w-4 text-blue-500" />;
      default:
        return null;
    }
  }, [status]);

  return (
    <div className="flex items-center gap-2 text-xs text-slate-500">
      {Icon}
      <span>{statusCopy[status]}</span>
    </div>
  );
}

export default function SetupPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [macrocategories, setMacrocategories] = useState<MacroCategoryDto[]>(
    [],
  );
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [shippingHour, setShippingHour] = useState<number>(8);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<Status>("idle");

  useEffect(() => {
    let active = true;
    setLoading(true);
    getAllMacrocategories()
      .then((data) => {
        if (!active) return;
        setMacrocategories(data ?? []);
      })
      .catch(() => {
        if (!active) return;
        setMacrocategories([]);
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
        if (typeof data.shippingHour === "number") {
          setShippingHour(data.shippingHour);
        }
      })
      .catch(() => {
        setStatus("idle");
      });
  }, [user?.userId]);

  const canSave = useMemo(
    () => selectedIds.length > 0 && status !== "saving",
    [selectedIds, status],
  );

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
      setStatus("auth");
      return;
    }

    if (selectedIds.length === 0) {
      setStatus("empty");
      return;
    }

    setStatus("saving");
    try {
      await upsertPreferences(Number(user.userId), selectedIds, shippingHour);
      setStatus("saved");
      setTimeout(() => router.push("/"), 1500);
    } catch (error) {
      setStatus("error");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="relative mx-auto max-w-4xl px-4 py-12">
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900"
        >
          <ChevronLeftIcon className="h-4 w-4" />
          Volver al Inicio
        </Link>

        <div className="space-y-4">
          <h1 className="text-3xl font-bold tracking-tight">
            Personaliza tu Feed
          </h1>
          <p className="text-slate-600">
            Selecciona las categorías que te interesan para recibir un resumen
            de noticias personalizado.
          </p>
        </div>

        <div className="mt-10 space-y-12">
          {loading ? (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="h-24 animate-pulse rounded-lg bg-slate-200"
                />
              ))}
            </div>
          ) : (
            macrocategories.map((macro) => (
              <div key={macro.macroCategoryName}>
                <h2 className="text-lg font-semibold">
                  {macro.macroCategoryName}
                </h2>
                <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                  {macro.categoryDtos.map((category) => (
                    <label
                      key={category.id}
                      className={`flex cursor-pointer items-center justify-center rounded-lg border p-4 text-center text-sm font-medium transition-colors ${
                        selectedIds.includes(category.id)
                          ? "border-slate-900 bg-slate-900 text-white"
                          : "border-slate-200 bg-white hover:bg-slate-100"
                      }`}
                    >
                      <input
                        type="checkbox"
                        className="sr-only"
                        checked={selectedIds.includes(category.id)}
                        onChange={() => handleToggle(category.id)}
                      />
                      {category.name}
                    </label>
                  ))}
                </div>
              </div>
            ))
          )}

          {!loading && macrocategories.length === 0 && (
            <div className="rounded-lg border border-dashed border-slate-200 p-8 text-center text-sm text-slate-500">
              No hay categorías disponibles en este momento.
            </div>
          )}

          <div>
            <h2 className="text-lg font-semibold">Hora de Notificación</h2>
            <div className="mt-4 max-w-xs">
              <select
                value={shippingHour}
                onChange={(e) => setShippingHour(Number(e.target.value))}
                className="w-full rounded-lg border-slate-200 bg-white px-3 py-2 text-sm focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
              >
                {Array.from({ length: 24 }, (_, hour) => (
                  <option key={hour} value={hour}>
                    {`${hour.toString().padStart(2, "0")}:00`}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="mt-12 flex items-center justify-between border-t border-slate-200 pt-6">
          <StatusIndicator status={status} />
          <div className="flex items-center gap-4">
            {!isAuthenticated && (
              <Link
                href="/login"
                className="text-sm font-medium text-slate-600 hover:text-slate-900"
              >
                Iniciar sesión
              </Link>
            )}
            <button
              type="button"
              onClick={handleSave}
              disabled={!canSave}
              className="rounded-full bg-slate-900 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-transform hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:bg-slate-400 disabled:hover:scale-100"
            >
              {status === "saving" ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                "Guardar Cambios"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
