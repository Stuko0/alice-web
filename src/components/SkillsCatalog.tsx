import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Search, Layers, ExternalLink } from "lucide-react";

export interface Skill {
  name: string;
  description: string;
  category: string;
  categoryLabel: string;
  source: string;
  tags: string[];
  platforms: string[];
  docsPath: string;
}

interface SkillsCatalogProps {
  skills: Skill[];
  labels: {
    search: string;
    allCategories: string;
    results: string;
    badge: string;
    title: string;
    subtitle: string;
    moreTitle: string;
    moreDesc: string;
    docsCta: string;
  };
  docsBase: string;
}

const suits = ["♠", "♥", "♦", "♣"];
const suitColors = ["suit-spade", "suit-heart", "suit-diamond", "suit-club"];
const suitBorders = ["border-suit-spade", "border-suit-heart", "border-suit-diamond", "border-suit-club"];
const suitBgs = ["bg-suit-spade", "bg-suit-heart", "bg-suit-diamond", "bg-suit-club"];

export function SkillsCatalog({ skills, labels, docsBase }: SkillsCatalogProps) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string | null>(null);

  const categories = useMemo(() => {
    const map = new Map<string, number>();
    for (const s of skills) map.set(s.categoryLabel, (map.get(s.categoryLabel) ?? 0) + 1);
    return [...map.entries()].sort((a, b) => b[1] - a[1]);
  }, [skills]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return skills.filter((s) => {
      if (category && s.categoryLabel !== category) return false;
      if (!q) return true;
      return (
        s.name.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q) ||
        (s.tags ?? []).some((tag) => tag.toLowerCase().includes(q))
      );
    });
  }, [skills, query, category]);

  return (
    <div>
      {/* Controls */}
      <div className="mb-10 flex flex-col gap-4">
        <div className="relative mx-auto w-full max-w-xl">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-rpm-muted" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={labels.search}
            aria-label={labels.search}
            className="w-full rounded-full border border-rpm-highlight-med/50 bg-rpm-base/80 py-3 pl-11 pr-4 text-sm text-rpm-text placeholder:text-rpm-muted/70 outline-none transition focus:border-rpm-iris/60 focus:bg-rpm-surface"
          />
        </div>
        <div className="flex flex-wrap items-center justify-center gap-2">
          <button
            onClick={() => setCategory(null)}
            className={`rounded-full border px-4 py-1.5 text-xs font-medium transition ${
              category === null
                ? "border-rpm-iris/60 bg-rpm-iris/15 text-rpm-iris"
                : "border-rpm-highlight-med/40 bg-rpm-surface/40 text-rpm-subtle hover:border-rpm-iris/40 hover:text-rpm-text"
            }`}
          >
            {labels.allCategories} ({skills.length})
          </button>
          {categories.map(([cat, n]) => (
            <button
              key={cat}
              onClick={() => setCategory(cat === category ? null : cat)}
              className={`rounded-full border px-4 py-1.5 text-xs font-medium transition ${
                cat === category
                  ? "border-rpm-iris/60 bg-rpm-iris/15 text-rpm-iris"
                  : "border-rpm-highlight-med/40 bg-rpm-surface/40 text-rpm-subtle hover:border-rpm-iris/40 hover:text-rpm-text"
              }`}
            >
              {cat} ({n})
            </button>
          ))}
        </div>
        <p className="text-center text-xs text-rpm-muted" aria-live="polite">
          {filtered.length} {labels.results}
        </p>
      </div>

      {/* Grid */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((skill, i) => {
          const idx = i % 4;
          const suit = suits[idx];
          const colorCls = suitColors[idx];
          const borderCls = suitBorders[idx];
          const bgCls = suitBgs[idx];
          return (
            <motion.a
              key={skill.name}
              href={docsBase + skill.docsPath}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.45, delay: Math.min(i, 8) * 0.05, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -4 }}
              className={`card-alice block ${borderCls} ${bgCls}`}
            >
              <span className={`suit-watermark ${colorCls}`}>{suit}</span>
              <span className={`suit-corner suit-corner-tl ${colorCls}`}>{suit}</span>
              <span className={`suit-corner suit-corner-br ${colorCls}`}>{suit}</span>
              <div className="p-6 pt-12">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <span className={`rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${borderCls} ${colorCls}`}>
                    {skill.categoryLabel}
                  </span>
                  <ExternalLink className="h-3.5 w-3.5 shrink-0 text-rpm-muted transition group-hover:text-rpm-iris" />
                </div>
                <h3 className="font-display text-lg text-rpm-text">{skill.name}</h3>
                <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-rpm-subtle">{skill.description}</p>
                {(skill.tags?.length ?? 0) > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {skill.tags.slice(0, 4).map((tag) => (
                      <span key={tag} className="rounded bg-rpm-base/70 px-2 py-0.5 text-[10px] text-rpm-muted">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </motion.a>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <p className="py-16 text-center text-sm text-rpm-muted">—</p>
      )}
    </div>
  );
}
