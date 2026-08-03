import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Copy, Terminal } from "lucide-react";

const labels: Record<string, string> = { macos: "macOS", linux: "Linux", windows: "Windows" };

export function InstallCommand() {
  const commands: Record<string, string> = {
    macos: "curl -fsSL https://alice-agent.stuko.dev/install.sh | bash",
    linux: "curl -fsSL https://alice-agent.stuko.dev/install.sh | bash",
    windows: "iex (irm https://alice-agent.stuko.dev/install.ps1)",
  };
  const [tab, setTab] = useState<"macos" | "linux" | "windows">("macos");
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(commands[tab]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-2xl overflow-hidden rounded-2xl border border-rpm-highlight-med/40 bg-rpm-surface/80 shadow-2xl">
      <div className="flex items-center justify-between border-b border-rpm-highlight-low/60 px-4 py-3">
        <div className="flex items-center gap-2 text-rpm-subtle">
          <Terminal className="h-4 w-4" />
          <span className="text-xs font-medium uppercase tracking-wider">Terminal</span>
        </div>
        <div className="flex gap-1.5">
          {(["macos", "linux", "windows"] as const).map((tName) => (
            <button
              key={tName}
              onClick={() => setTab(tName)}
              className={`rounded-md px-3 py-1 text-xs font-medium transition ${tab === tName ? "bg-rpm-iris/20 text-rpm-iris" : "text-rpm-muted hover:text-rpm-text"}`}
            >
              {labels[tName]}
            </button>
          ))}
        </div>
      </div>
      <div className="relative flex min-h-[6.5rem] items-center justify-between gap-4 px-5 py-4 font-mono text-sm text-rpm-text">
        <AnimatePresence mode="wait">
          <motion.code
            key={tab}
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -8 }}
            transition={{ duration: 0.2 }}
            className="break-all"
          >
            $ {commands[tab]}
          </motion.code>
        </AnimatePresence>
        <motion.button
          whileTap={{ scale: 0.92 }}
          onClick={copy}
          className="flex shrink-0 items-center gap-1.5 rounded-lg border border-rpm-highlight-med/40 bg-rpm-base/80 px-3 py-1.5 text-xs text-rpm-subtle transition hover:border-rpm-iris hover:text-rpm-iris"
        >
          {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
          {copied ? "Copied" : "Copy"}
        </motion.button>
      </div>
    </div>
  );
}
