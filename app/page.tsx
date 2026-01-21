"use client";
import { useAuth } from "@/src/context/AuthContext";
import { getNewsByUser } from "@/src/lib/api/news.service";
import { getUserPreferences } from "@/src/lib/api/user.service";
import type { MacroCategory } from "@/src/types/api/types";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import NewsCard from "./components/NewsCard";
import { Menu, Settings, LogOut, LogIn, UserPlus } from "lucide-react";

type StoryCard = {
  id: number;
  title: string;
  macroCategory?: string;
  category?: string;
  summary: string;
  date: string;
  span: string;
};

const spanPool = [
  { span: "xl:col-span-2 xl:row-span-2" },
  { span: "xl:col-span-1" },
  { span: "xl:col-span-1" },
  { span: "xl:col-span-1 xl:row-span-2" },
  { span: "xl:col-span-1" },
  { span: "xl:col-span-2" },
];

const formatStoryDate = (dateString?: string) => {
  if (!dateString) return "—";
  const parsed = new Date(dateString);
  if (Number.isNaN(parsed.getTime())) return "—";
  const formatter = new Intl.DateTimeFormat("es-EC", {
    timeZone: "UTC",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
  return formatter.format(parsed);
};

const buildStories = (data: MacroCategory[]): StoryCard[] => {
  let id = 1;
  const items: StoryCard[] = [];
  data.forEach((macro) => {
    macro.categoryDtos?.forEach((category) => {
      category.newsSummaryDtos?.forEach((summary) => {
        const span = spanPool[(id - 1) % spanPool.length];
        items.push({
          id,
          title: summary.title,
          macroCategory: macro.name,
          category: category.name,
          summary: summary.content,
          date: formatStoryDate(summary.date),
          span: span.span,
        });
        id += 1;
      });
    });
  });
  return items;
};

export default function Home() {
  const { isAuthenticated, user, logout } = useAuth();
  const router = useRouter();
  const [stories, setStories] = useState<StoryCard[]>([]);
  const [hasPreferences, setHasPreferences] = useState(false);
  const [loadingStories, setLoadingStories] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    let active = true;
    const loadNews = async () => {
      if (!isAuthenticated || !user?.userId) {
        console.debug("news: no session, skipping fetch");
        if (!active) return;
        setHasPreferences(false);
        setStories([]);
        return;
      }

      setLoadingStories(true);
      let preferencesFound = false;
      try {
        console.debug("news: fetching preferences", { userId: user.userId });
        const preferences = await getUserPreferences(Number(user.userId));
        preferencesFound = (preferences?.categoryIds?.length ?? 0) > 0;

        if (!preferencesFound) {
          if (!active) return;
          setHasPreferences(false);
          setStories([]);
          return;
        }

        if (!active) return;
        setHasPreferences(true);

        console.debug("news: fetching summaries", { userId: user.userId });
        const newsData = await getNewsByUser(Number(user.userId));
        console.debug("news: summaries response", newsData);
        if (!active) return;
        const mapped = buildStories(newsData);
        console.debug("news: mapped cards", mapped);
        setStories(mapped);
      } catch (error) {
        console.error("news: fetch failed", error);
        if (!active) return;
        if (preferencesFound) {
          setHasPreferences(true);
          setStories([]);
        } else {
          setHasPreferences(false);
          setStories([]);
        }
      } finally {
        if (!active) return;
        setLoadingStories(false);
      }
    };

    loadNews();
    return () => {
      active = false;
    };
  }, [isAuthenticated, user?.userId]);

  const showEmptyState = useMemo(
    () => !loadingStories && stories.length === 0,
    [loadingStories, stories.length],
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="relative mx-auto max-w-6xl px-4 py-12">
        <header className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm uppercase tracking-wider text-slate-500">
              Noticias de hoy
            </p>
            <h1 className="mt-1 text-3xl font-bold tracking-tight sm:text-4xl">
              InfoWise
            </h1>
          </div>
          <div className="flex items-center gap-2">
            {isAuthenticated ? (
              <button
                type="button"
                onClick={logout}
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 shadow-sm transition hover:bg-slate-100"
              >
                <LogOut className="h-4 w-4" />
                Cerrar sesión
              </button>
            ) : (
              <>
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 shadow-sm transition hover:bg-slate-100"
                >
                  <LogIn className="h-4 w-4" />
                  Iniciar sesión
                </Link>
                <Link
                  href="/register"
                  className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-sm text-white shadow-sm transition hover:bg-slate-800"
                >
                  <UserPlus className="h-4 w-4" />
                  Crear cuenta
                </Link>
              </>
            )}
            <div className="group relative">
              <button
                type="button"
                aria-label="Abrir menú"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-100"
              >
                <Menu className="h-5 w-5" />
              </button>
              <div
                aria-hidden="true"
                className="absolute right-0 top-full h-2 w-40"
              />
              <div className="pointer-events-none absolute right-0 top-full z-10 mt-2 min-w-[160px] translate-y-2 rounded-lg border border-slate-200/80 bg-white/95 p-2 text-sm text-slate-700 opacity-0 shadow-lg transition duration-200 group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100">
                <Link
                  href="/setup"
                  className="flex items-center justify-between rounded-md px-3 py-2 transition hover:bg-slate-100"
                >
                  Preferencias
                  <Settings className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </header>

        <main className="mt-10">
          {showEmptyState ? (
            <div className="rounded-lg border border-dashed border-slate-300 bg-white/80 px-6 py-10 text-center text-sm text-slate-600">
              No hay noticias para mostrar por el momento. Puedes cambiar tus{" "}
              <Link
                href="/setup"
                className="font-medium text-slate-900 underline"
              >
                preferencias
              </Link>{" "}
              para ver nuevas categorías.
            </div>
          ) : (
            <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {stories.map((story) => (
                <NewsCard
                  key={story.id}
                  title={story.title}
                  macroCategory={story.macroCategory}
                  category={story.category}
                  summary={story.summary}
                  date={story.date}
                  spanClass={story.span}
                />
              ))}
            </section>
          )}
        </main>
      </div>
    </div>
  );
}
