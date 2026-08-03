import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Sparkles, Heart, BookOpen, GitBranch, Download } from "lucide-react";
import { LanguageSwitcher } from "./LanguageSwitcher";

interface NavigationProps {
  currentPath: string;
  lng: string;
  labels: {
    home: string;
    features: string;
    docs: string;
    github: string;
    install: string;
  };
}

const suits = ["♠", "♥", "♦", "♣"];

const links = [
  { key: "home", href: "/" },
  { key: "features", href: "/features" },
  { key: "docs", href: "/docs" },
];

export function Navigation({ currentPath, lng, labels }: NavigationProps) {
  const [open, setOpen] = useState(false);
  const mobileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (mobileRef.current && !mobileRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  const resolvedHref = (href: string) => (href === "/" ? `/${lng}` : `/${lng}${href}`);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-rpm-highlight-low/60 bg-rpm-base/80 glass">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <a href={`/${lng}`} className="group flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-rpm-iris/40 bg-rpm-surface text-rpm-iris transition group-hover:scale-105">
            <Sparkles className="h-5 w-5" />
          </span>
          <span className="font-display text-lg tracking-wide text-rpm-text">Alice Agent</span>
        </a>

        <div className="hidden items-center gap-5 md:flex">
          {links.map(({ key, href }, i) => {
            const isActive = currentPath === href;
            const Icon = key === "home" ? Sparkles : key === "features" ? Heart : BookOpen;
            return (
              <a
                key={key}
                href={resolvedHref(href)}
                aria-current={isActive ? "page" : undefined}
                className={`group flex items-center gap-1.5 text-sm font-medium transition-colors hover:text-rpm-iris ${isActive ? "text-rpm-iris" : "text-rpm-subtle"}`}
              >
                <Icon className="h-4 w-4" />
                {labels[key as keyof typeof labels]}
                <span className="ml-0.5 text-[10px] opacity-0 transition-opacity group-hover:opacity-40" aria-hidden>{suits[i % suits.length]}</span>
              </a>
            );
          })}
          <a
            href="https://github.com/Stuko0/alice-agent"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-sm font-medium text-rpm-subtle transition-colors hover:text-rpm-iris"
          >
            <GitBranch className="h-4 w-4" />
            {labels.github}
          </a>
          <a
            href={resolvedHref("/") + "#install"}
            className="flex items-center gap-1.5 rounded-full border border-rpm-iris/30 bg-rpm-iris/10 px-4 py-2 text-sm font-medium text-rpm-iris ring-1 ring-rpm-iris/20 transition hover:bg-rpm-iris/20"
          >
            <Download className="h-4 w-4" />
            {labels.install}
          </a>
          <LanguageSwitcher currentLng={lng} />
        </div>

        <div className="flex items-center gap-3 md:hidden">
          <LanguageSwitcher currentLng={lng} />
          <button
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-rpm-highlight-med/40 text-rpm-text"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            ref={mobileRef}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-rpm-highlight-low/60 bg-rpm-base/95 backdrop-blur-xl md:hidden"
          >
            <div className="flex flex-col gap-3 px-6 py-5">
              {links.map(({ key, href }, i) => {
                const Icon = key === "home" ? Sparkles : key === "features" ? Heart : BookOpen;
                return (
                  <a
                    key={key}
                    href={resolvedHref(href)}
                    onClick={() => setOpen(false)}
                    className="group flex items-center gap-2 rounded-lg px-3 py-2 text-rpm-text transition hover:bg-rpm-surface"
                  >
                    <Icon className="h-4 w-4 text-rpm-iris" />
                    {labels[key as keyof typeof labels]}
                    <span className="ml-auto text-xs opacity-30" aria-hidden>{suits[i % suits.length]}</span>
                  </a>
                );
              })}
              <a
                href="https://github.com/Stuko0/alice-agent"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-rpm-text transition hover:bg-rpm-surface"
              >
                <GitBranch className="h-4 w-4 text-rpm-iris" />
                {labels.github}
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
