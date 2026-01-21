type NewsCardProps = {
  title: string;
  macroCategory?: string;
  category?: string;
  summary: string;
  date: string;
  spanClass?: string;
};

export default function NewsCard({
  title,
  macroCategory,
  category,
  summary,
  date,
  spanClass,
}: NewsCardProps) {
  const categoryLabel = macroCategory && category
    ? `${macroCategory} · ${category}`
    : macroCategory ?? category ?? "—";

  return (
    <article
      className={`group relative flex flex-col justify-between rounded-2xl border border-slate-200/80 py-4 transition hover:outline hover:outline-2 hover:outline-slate-300 px-5 ${spanClass ?? ""}`}
    >
      <div className="relative">
        <p className="text-xs uppercase tracking-[0.32em] text-slate-500">
          {categoryLabel}
        </p>
        <h2
          className="mt-3 text-lg font-semibold leading-snug text-slate-900"
          style={{ fontFamily: "var(--font-fraunces)" }}
        >
          {title}
        </h2>
      </div>
      <div className="relative">
        <p className="text-sm text-slate-600">{summary}</p>
        <div className="mt-4 flex items-center justify-between text-xs uppercase tracking-[0.3em] text-slate-500">
          <span>{date}</span>
        </div>
      </div>
    </article>
  );
}
