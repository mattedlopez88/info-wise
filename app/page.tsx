'use client';
import { useAuth } from "@/src/context/AuthContext";
import { getNewsByUser } from "@/src/lib/api/news.service";
import { getUserPreferences } from "@/src/lib/api/user.service";
import type { MacroCategory } from "@/src/types/api/types";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import NewsCard from "./components/NewsCard";

type StoryCard = {
  id: number;
  title: string;
  macroCategory?: string;
  category?: string;
  summary: string;
  date: string;
  span: string;
};

const fallbackStories: StoryCard[] = [
  {
    id: 1,
    title: "Ocean Data Corridors",
    macroCategory: "Climate Desk",
    summary:
      "Satellites reveal new heat currents, reshaping coastal forecasts and shipping routes.",
    date: "Sep 20, 08:45",
    span: "xl:col-span-2 xl:row-span-2",
  },
  {
    id: 2,
    title: "Markets Quietly Rebalance",
    macroCategory: "Business",
    summary: "Investors rotate into resilient health and green energy names.",
    date: "Sep 20, 07:20",
    span: "xl:col-span-1",
  },
  {
    id: 3,
    title: "Culture: Studio Notes",
    macroCategory: "Arts",
    summary: "Three new galleries push kinetic light installations downtown.",
    date: "Sep 20, 06:50",
    span: "xl:col-span-1",
  },
  {
    id: 4,
    title: "Neighborhood Grid Upgrades",
    macroCategory: "City",
    summary: "Microgrids and rooftop storage pilots expand after summer trials.",
    date: "Sep 20, 09:05",
    span: "xl:col-span-1 xl:row-span-2",
  },
  {
    id:5,
    title: "Science: Forest Canopies",
    macroCategory: "Science",
    summary: "Drones map recovery after last year's wildfire season.",
    date: "Sep 20, 10:15",
    span: "xl:col-span-1",
  },
  {
    id: 6,
    title: "Science: Forest Canopies",
    macroCategory: "Science",
    summary: "Drones map recovery after last year's wildfire season.",
    date: "Sep 20, 10:15",
    span: "xl:col-span-1",
  },
  {
    id: 7,
    title: "Science: Forest Canopies",
    macroCategory: "Science",
    summary: "Drones map recovery after last year's wildfire season.",
    date: "Sep 20, 10:15",
    span: "xl:col-span-1",
  },
  {
    id: 8,
    title: "Ocean Data Corridors",
    macroCategory: "Climate Desk",
    summary:
      "Satellites reveal new heat currents, reshaping coastal forecasts and shipping routes.",
    date: "Sep 20, 08:45",
    span: "xl:col-span-2 xl:row-span-2",
  },
  {
    id: 9,
    title: "Opinion: Slow Journalism",
    macroCategory: "Perspectives",
    summary: "Why deliberate reporting creates longer-lasting public trust.",
    date: "Sep 20, 11:02",
    span: "xl:col-span-2",
  },
];

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
  return parsed.toLocaleString([], {
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
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
  const [stories, setStories] = useState<StoryCard[]>(fallbackStories);
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
        setStories(fallbackStories);
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
          setStories(fallbackStories);
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
          setStories(fallbackStories);
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

  const showEmptyPreferencesState = useMemo(
    () => hasPreferences && !loadingStories && stories.length === 0,
    [hasPreferences, loadingStories, stories.length],
  );

  return (
    <div className="min-h-screen bg-[#ECEADE] text-slate-900">
      <div className="relative lg:h-screen lg:overflow-hidden">
        <div className="relative mx-auto flex min-h-screen max-w-6xl flex-col gap-8 px-4 py-6 sm:px-6 lg:h-full lg:gap-10 lg:py-10">
          <main className="flex-1 pb-8">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.4em] text-slate-500">
                  Noticias de hoy
                </p>
                <h1
                  className="mt-3 text-3xl font-semibold text-slate-900 sm:text-4xl"
                  style={{ fontFamily: "var(--font-fraunces)" }}
                >
                  InfoWise
                </h1>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {isAuthenticated ? (
                  <button
                    type="button"
                    onClick={logout}
                    className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 shadow-sm transition hover:-translate-y-0.5"
                  >
                    Log out
                  </button>
                ) : (
                  <>
                    <Link
                      href="/login"
                      className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 shadow-sm transition hover:-translate-y-0.5"
                    >
                      Log in
                    </Link>
                    <Link
                      href="/register"
                      className="rounded-full border border-transparent bg-slate-900 px-4 py-2 text-sm text-white shadow-sm transition hover:-translate-y-0.5"
                    >
                      Register
                    </Link>
                  </>
                )}
                <div className="group relative">
                  <button
                    type="button"
                    aria-label="Open menu"
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:-translate-y-0.5"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.6"
                    >
                      <path
                        d="M4 7h16M4 12h16M4 17h16"
                        strokeLinecap="round"
                      />
                    </svg>
                  </button>
                  <div
                    aria-hidden="true"
                    className="absolute right-0 top-full h-2 w-40"
                  />
                  <div className="pointer-events-none absolute right-0 top-full z-10 mt-2 min-w-[160px] translate-y-2 rounded-2xl border border-slate-200/80 bg-white/95 p-2 text-sm text-slate-700 opacity-0 shadow-lg transition duration-200 group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100">
                    <Link
                      href="/setup"
                      className="flex items-center justify-between rounded-xl px-3 py-2 transition hover:bg-slate-100"
                    >
                      Settings
                      <svg
                        viewBox="0 0 24 24"
                        className="h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.6"
                      >
                        <path
                          d="M10 7h7m-7 5h7m-7 5h7M5 7h.01M5 12h.01M5 17h.01"
                          strokeLinecap="round"
                        />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {showEmptyPreferencesState ? (
              <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-white/80 px-6 py-10 text-sm text-slate-600">
                Escoge las categorías que te interesan en la página de{" "}
                <Link href="/setup" className="underline">
                  configuración
                </Link>{" "}
                para ver noticias personalizadas aquí.
              </div>
            ) : (
              <section className="mt-6 grid grid-cols-1 gap-6 sm:auto-rows-[200px] sm:grid-cols-2 xl:grid-cols-3">
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
    </div>
  );
}
