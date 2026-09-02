import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Clock, Terminal } from "lucide-react";

export interface Blueprint {
  key: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  schedule: string;
  scheduleHuman: string;
  command: string;
}

interface BlueprintsGridProps {
  blueprints: Blueprint[];
  labels: {
    all: string;
    scheduleLabel: string;
    commandLabel: string;
    badge: string;
    title: string;
    subtitle: string;
    guideCta: string;
  };
}

const suits = ["♠", "♥", "♦", "♣"];
const suitColors = ["suit-spade", "suit-heart", "suit-diamond", "suit-club"];
const suitBorders = ["border-suit-spade", "border-suit-heart", "border-suit-diamond", "border-suit-club"];
const suitBgs = ["bg-suit-spade", "bg-suit-heart", "bg-suit-diamond", "bg-suit-club"];

export function BlueprintsGrid({ blueprints, labels }: BlueprintsGridProps) {
  const [category, setCategory] = useState<string | null>(null);

  const categories = useMemo(() => {
    const map = new Map<string, number>();
    for (const b of blueprints) map.set(b.category, (map.get(b.category) ?? 0) + 1);
    return [...map.entries()].sort((a, b) => b[1] - a[1]);
  }, [blueprints]);

  const filtered = useMemo(
    () => (category ? blueprints.filter((b) => b.category === category) : blueprints),
    [blueprints, category]
  );

  return (
    <div>
      {/* Filters */}
      <div className="mb-10 flex flex-wrap items-center justify-center gap-2">
        <button
          onClick={() => setCategory(null)}
          className={`rounded-full border px-4 py-1.5 text-xs font-medium transition ${
            category === null
              ? "border-rpm-iris/60 bg-rpm-iris/15 text-rpm-iris"
              : "border-rpm-highlight-med/40 bg-rpm-surface/40 text-rpm-subtle hover:border-rpm-iris/40 hover:text-rpm-text"
          }`}
        >
          {labels.all} ({blueprints.length})
        </button>
        {categories.map(([cat, n]) => (
          <button
            key={cat}
            onClick={() => setCategory(cat === category ? null : cat)}
            className={`rounded-full border px-4 py-1.5 text-xs font-medium capitalize transition ${
              cat === category
                ? "border-rpm-iris/60 bg-rpm-iris/15 text-rpm-iris"
                : "border-rpm-highlight-med/40 bg-rpm-surface/40 text-rpm-subtle hover:border-rpm-iris/40 hover:text-rpm-text"
            }`}
          >
            {cat} ({n})
          </button>
        ))}
      </div>

      {/* Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((bp, i) => {
          const idx = i % 4;
          const suit = suits[idx];
          const colorCls = suitColors[idx];
          const borderCls = suitBorders[idx];
          const bgCls = suitBgs[idx];
          return (
            <motion.article
              key={bp.key}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.45, delay: Math.min(i, 8) * 0.05, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -4 }}
              className={`card-alice ${borderCls} ${bgCls}`}
            >
              <span className={`suit-watermark ${colorCls}`}>{suit}</span>
              <span className={`suit-corner suit-corner-tl ${colorCls}`}>{suit}</span>
              <span className={`suit-corner suit-corner-br ${colorCls}`}>{suit}</span>
              <div className="flex h-full flex-col p-6 pt-12">
                <div className="mb-3 flex items-center gap-2">
                  <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${borderCls} ${colorCls}`}>
                    <Clock className="h-3 w-3" />
                    {bp.category}
                  </span>
                </div>
                <h3 className="font-display text-lg text-rpm-text">{bp.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-rpm-subtle">{bp.description}</p>

                <div class="mt-4 space-y-3">
                  <div>
                    <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-rpm-muted">{labels.scheduleLabel}</p>
                    <p className="text-xs text-rpm-subtle">{bp.scheduleHuman}</p>
                  </div>
                  <div>
                    <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-rpm-muted">{labels.commandLabel}</p>
                    <code className="block overflow-x-auto rounded-lg border border-rpm-highlight-med/40 bg-rpm-base/80 px-3 py-2 font-mono text-[11px] leading-relaxed text-rpm-subtle">
                      <Terminal className="mr-1 inline h-3 w-3 align-[-1px] text-rpm-muted" />
                      {bp.command}
                    </code>
                  </div>
                </div>
              </div>
            </motion.article>
          );
        })}
      </div>
    </div>
  );
}
