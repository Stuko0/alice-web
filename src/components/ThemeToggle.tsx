import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

const LABELS: Record<string, { toLight: string; toDark: string }> = {
  es: { toLight: "Cambiar a modo claro", toDark: "Cambiar a modo oscuro" },
  en: { toLight: "Switch to light mode", toDark: "Switch to dark mode" },
  it: { toLight: "Passa alla modalita chiusa", toDark: "Passa alla modalita scura" },
};

export function ThemeToggle({ lng = "es" }: { lng?: string }) {
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    const current = document.documentElement.getAttribute("data-theme");
    setTheme(current === "light" ? "light" : "dark");
  }, []);

  const toggle = () => {
    const next = theme === "dark" ? "light" : "dark";
    // Congela las transiciones durante el cambio para que los colores
    // aplicados por var() cambien sin latencia (Chrome retrasa los
    // CSSTransition dependientes de custom properties).
    const root = document.documentElement;
    root.classList.add("theme-switching");
    root.setAttribute("data-theme", next);
    window.setTimeout(() => root.classList.remove("theme-switching"), 120);
    try {
      localStorage.setItem("theme", next);
    } catch {
      /* almacenamiento no disponible */
    }
    const meta = document.getElementById("theme-color-meta");
    if (meta) meta.setAttribute("content", next === "dark" ? "#191724" : "#ede7db");
    setTheme(next);
  };

  const labels = LABELS[lng] ?? LABELS.es;
  const label = theme === "dark" ? labels.toLight : labels.toDark;

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={label}
      title={label}
      className="flex h-9 w-9 items-center justify-center rounded-full border border-rpm-highlight-med/50 bg-rpm-surface/60 text-rpm-subtle transition hover:border-rpm-iris hover:text-rpm-iris"
    >
      {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  );
}
