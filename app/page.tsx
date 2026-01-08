'use client';
import { checkNewsServiceHealth, getAllCategories } from "@/src/lib/api/news.service";
import Image from "next/image";
import { useEffect } from "react";

const stories = [
  {
    title: "Ocean Data Corridors",
    category: "Climate Desk",
    summary:
      "Satellites reveal new heat currents, reshaping coastal forecasts and shipping routes.",
    time: "08:45",
    span: "xl:col-span-2 xl:row-span-2",
    theme: "bg-gradient-to-br from-[#0b1f2b] via-[#102b3f] to-[#2b4c7e] text-white",
  },
  {
    title: "Markets Quietly Rebalance",
    category: "Business",
    summary: "Investors rotate into resilient health and green energy names.",
    time: "07:20",
    span: "xl:col-span-1",
    theme: "bg-white",
  },
  {
    title: "Culture: Studio Notes",
    category: "Arts",
    summary: "Three new galleries push kinetic light installations downtown.",
    time: "06:50",
    span: "xl:col-span-1",
    theme: "bg-gradient-to-br from-[#fef6e6] via-[#fce8c3] to-[#f8d4b3]",
  },
  {
    title: "Neighborhood Grid Upgrades",
    category: "City",
    summary: "Microgrids and rooftop storage pilots expand after summer trials.",
    time: "09:05",
    span: "xl:col-span-1 xl:row-span-2",
    theme: "bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#334155] text-white",
  },
  {
    title: "Science: Forest Canopies",
    category: "Science",
    summary: "Drones map recovery after last year's wildfire season.",
    time: "10:15",
    span: "xl:col-span-1",
    theme: "bg-white",
  },
  {
    title: "Science: Forest Canopies",
    category: "Science",
    summary: "Drones map recovery after last year's wildfire season.",
    time: "10:15",
    span: "xl:col-span-1",
    theme: "bg-white",
  },
  {
    title: "Science: Forest Canopies",
    category: "Science",
    summary: "Drones map recovery after last year's wildfire season.",
    time: "10:15",
    span: "xl:col-span-1",
    theme: "bg-white",
  },
  {
    title: "Ocean Data Corridors",
    category: "Climate Desk",
    summary:
      "Satellites reveal new heat currents, reshaping coastal forecasts and shipping routes.",
    time: "08:45",
    span: "xl:col-span-2 xl:row-span-2",
    theme: "bg-gradient-to-br from-[#0b1f2b] via-[#102b3f] to-[#2b4c7e] text-white",
  },
  {
    title: "Opinion: Slow Journalism",
    category: "Perspectives",
    summary: "Why deliberate reporting creates longer-lasting public trust.",
    time: "11:02",
    span: "xl:col-span-2",
    theme: "bg-gradient-to-br from-[#fff4ef] via-[#fde4d3] to-[#fbc7b2]",
  },
];

export default function Home() {
useEffect(() => {
  checkNewsServiceHealth().then(console.log);
  getAllCategories().then(console.log);
})
  return (
    <div className="h-screen overflow-hidden bg-[#ECEADE] text-slate-900">
      <div className="relative h-full overflow-hidden">
        <div className="pointer-events-none absolute left-[-140px] top-[-120px] h-[340px] w-[340px] rounded-full bg-[#f9ddc6]/70 blur-3xl" />
        <div className="pointer-events-none absolute bottom-[-180px] right-[-120px] h-[320px] w-[320px] rounded-full bg-[#cfe1d4]/80 blur-3xl" />
        <div className="relative mx-auto flex h-full max-w-6xl flex-col gap-6 px-6 py-10 lg:flex-row">
          <aside className="flex h-full w-full flex-col rounded-[32px] bg-#ffffff83/90 p-6 lg:max-w-[300px]">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#0f1c1a]">
                <Image src="/window.svg" alt="InfoWise" width={28} height={28} />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-slate-500">
                  Infowise
                </p>
                <p
                  className="text-xl font-semibold text-slate-900"
                  style={{ fontFamily: "var(--font-fraunces)" }}
                >
                  Morning Desk
                </p>
              </div>
            </div>

            <div className="mt-8 flex flex-1 flex-col justify-center gap-6">
              <div className="rounded-2xl border border-slate-200/80 bg-white p-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#f4efe5]">
                    <svg
                      viewBox="0 0 24 24"
                      className="h-5 w-5 text-slate-700"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.6"
                    >
                      <path
                        d="M7 4v2m10-2v2M4 9h16M5.5 6h13a1.5 1.5 0 0 1 1.5 1.5v10a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 17.5v-10A1.5 1.5 0 0 1 5.5 6Z"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900">
                      Filter by date
                    </p>
                    <p className="text-xs text-slate-500">
                      Pick a day to refresh headlines
                    </p>
                  </div>
                </div>
                <input
                  type="date"
                  className="mt-4 w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 shadow-sm focus:border-slate-400 focus:outline-none"
                />
              </div>

              <div className="rounded-2xl bg-[#f8f1e4] p-4 text-sm text-slate-700">
                <p className="font-medium text-slate-900">Daily signal</p>
                <p className="mt-2">
                  12 new briefings, 4 investigations, 2 long reads.
                </p>
              </div>
            </div>

            <button className="mt-6 flex items-center justify-between rounded-2xl bg-slate-900 px-4 py-3 text-sm font-medium text-white shadow-lg shadow-slate-900/20 transition hover:-translate-y-0.5">
              Configuration
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
            </button>
          </aside>

          <main className="flex-1 overflow-y-auto pb-10 pr-2">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.4em] text-slate-500">
                  Noticias de hoy
                </p>
                <h1
                  className="mt-3 text-3xl font-semibold text-slate-900 sm:text-4xl"
                  style={{ fontFamily: "var(--font-fraunces)" }}
                >
                  The news atlas, curated for calm reading
                </h1>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 shadow-sm">
                  Today
                </button>
                <button className="rounded-full border border-transparent bg-[#e7efe7] px-4 py-2 text-sm text-slate-700">
                  Week
                </button>
                <button className="rounded-full border border-transparent bg-[#f4e9de] px-4 py-2 text-sm text-slate-700">
                  Long Reads
                </button>
              </div>
            </div>

            <section className="mt-6 grid auto-rows-[180px] gap-10 sm:grid-cols-2 xl:grid-cols-3">
              {stories.map((story) => (
                <article
                  key={story.title}
                  className={`group relative flex h-full border flex-col justify-between overflow-hidden ${story.span}`}
                >
                  <div className="h-full w-full rounded-2xl bg-slate-200" />
                  <div className="relative">
                    <p className="text-xs uppercase tracking-[0.32em] opacity-70">
                      {story.category}
                    </p>
                    <h2
                      className="mt-3 text-lg font-semibold leading-snug"
                      style={{ fontFamily: "var(--font-fraunces)" }}
                    >
                      {story.title}
                    </h2>
                  </div>
                  <div className="relative">
                    <p className="text-sm opacity-80">{story.summary}</p>
                    <div className="mt-4 flex items-center justify-between text-xs uppercase tracking-[0.3em] opacity-70">
                      <span>{story.time}</span>
                    </div>
                  </div>
                </article>
              ))}
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}
