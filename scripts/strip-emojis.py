#!/usr/bin/env python3
"""Remove emoji characters from docs markdown (en + i18n) at build time.

The skills content that generate-skill-docs.py copies into the docs tree
contains emojis; the repo convention (and the landing site) is emoji-free UI,
so this runs after content generation and before the Docusaurus build.

Keeps: playing-card suits (the brand system), check/cross marks (mapped to
their text forms), arrows, stars, warning sign and prompt carets.
"""

import os
import sys

# Emoji-presentation characters mapped to their text-symbol equivalent
REPLACEMENTS = {
    "\u2705": "\u2713",  # white heavy check mark -> check
    "\u2714": "\u2713",  # heavy check mark -> check
    "\u274c": "\u2717",  # cross mark -> ballot x
    "\u2718": "\u2717",  # heavy ballot x -> ballot x
    "\u2b50": "\u2605",  # star emoji -> text star
}

# Codepoint ranges scanned for emoji to drop
DROP_RANGES = (
    (0x1F000, 0x1FFFF),  # emoji planes: Pictographs, Emoticons, Transport, flags...
    (0x2600, 0x26FF),  # Miscellaneous symbols
    (0x2700, 0x27BF),  # Dingbats
    (0x2B00, 0x2BFF),  # Miscellaneous symbols and arrows
)

# Explicitly kept text symbols inside the scanned ranges (stored as codepoints)
KEEP = set(map(ord, "♠♥♦♣♤♡♢♧"))  # suits
KEEP |= set(map(ord, "⚠★☆✓✗❯…"))  # warning, stars, checks, quote-caret
KEEP_RANGES = (
    (0x2794, 0x27BF),  # heavy arrows / curly bracket symbols
    (0x2B05, 0x2B07),  # heavy cardinal arrows
)

ALWAYS_DROP = {0xFE0F, 0x200D}  # variation selector-16, zero-width joiner


def should_drop(cp: int) -> bool:
    if cp in ALWAYS_DROP:
        return True
    if cp in KEEP:
        return False
    for lo, hi in KEEP_RANGES:
        if lo <= cp <= hi:
            return False
    for lo, hi in DROP_RANGES:
        if lo <= cp <= hi:
            return True
    return False


def clean(text: str) -> tuple[str, int]:
    out = []
    removed = 0
    for ch in text:
        ch = REPLACEMENTS.get(ch, ch)
        if should_drop(ord(ch)):
            removed += 1
            continue
        out.append(ch)
    return "".join(out), removed


def main(argv: list[str]) -> int:
    if len(argv) < 2:
        print("usage: strip-emojis.py DIR [DIR ...]", file=sys.stderr)
        return 2
    total_files = 0
    total_chars = 0
    for root in argv[1:]:
        for dirpath, _dirnames, filenames in os.walk(root):
            for name in filenames:
                if not name.endswith((".md", ".mdx")):
                    continue
                path = os.path.join(dirpath, name)
                with open(path, encoding="utf-8") as fh:
                    original = fh.read()
                cleaned, removed = clean(original)
                if cleaned != original:
                    with open(path, "w", encoding="utf-8") as fh:
                        fh.write(cleaned)
                    total_files += 1
                    total_chars += removed
    print(f"[strip-emojis] {total_files} files cleaned, {total_chars} emoji removed")
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv))
