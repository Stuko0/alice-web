#!/usr/bin/env python3
"""Sync static data + assets from ~/Projects/alice-agent/website into alice-web.

Source of truth: the Docusaurus site that serves https://alice-agent.stuko.dev/docs/
This script pulls its generated JSON manifests and images into the marketing site.

Usage:  python3 scripts/sync-from-website.py
"""
import json
import shutil
from pathlib import Path

from PIL import Image

WEBSITE = Path.home() / "Projects/alice-agent/website"
ROOT = Path(__file__).resolve().parent.parent
PUBLIC = ROOT / "public"

SKILLS_OUT = PUBLIC / "api" / "skills.json"
MODELS_OUT = PUBLIC / "api" / "model-catalog.json"
BLUEPRINTS_OUT = PUBLIC / "api" / "automation-blueprints.json"
STORIES_OUT = PUBLIC / "data" / "user-stories.json"
IMG_OUT = PUBLIC / "img"

# Bundled skills (source built-in) — the ones that ship with Alice and have
# docs pages under /docs/user-guide/skills/bundled/. External/optional catalog
# (LobeHub + optional + Anthropic, 622 skills) is NOT included; the /skills
# page mentions it as "600+ more available via the Skills Hub".
BUNDLED_SOURCES = {"built-in"}

SKILL_FIELDS = ["name", "description", "category", "categoryLabel", "source", "tags", "platforms", "docsPath"]
STORY_FIELDS = ["id", "author", "headline", "quote", "url", "source", "date", "category"]
STORY_TOP_N = 12

# Dashboard screenshots to ship (subset of website/static/img/dashboard/)
DASHBOARD_SHOTS = [
    "admin-sessions.png", "admin-channels.png", "admin-skills-hub.png",
    "admin-mcp.png", "admin-config.png", "admin-webhooks.png",
    "admin-hook-create.png", "admin-pairing.png", "admin-system-curator.png",
    "admin-system-ops.png", "admin-system-top.png",
]
# Kanban tutorial shots for the features deep-dive
KANBAN_SHOTS = ["01-board-overview.png", "02-board-flat.png", "03-drawer-schema-task.png"]
DOCS_SVGS = ["cli-layout.svg", "session-recap.svg"]


def die(msg: str) -> None:
    raise SystemExit(f"error: {msg}")


def read_json(path: Path):
    if not path.exists():
        die(f"missing source file: {path}")
    return json.loads(path.read_text())


def write_json(path: Path, data) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(data, ensure_ascii=False, indent=1) + "\n")


def sync_skills(total: list) -> dict:
    bundled = [s for s in total if s.get("source") in BUNDLED_SOURCES]
    reduced = [{f: s.get(f) for f in SKILL_FIELDS if s.get(f) not in (None, "", [])} for s in bundled]
    reduced.sort(key=lambda s: (s.get("categoryLabel", "zzz"), s.get("name", "")))
    meta = {
        "version": 1,
        "extractedAt": read_json(WEBSITE / "static/api/skills-meta.json").get("extractedAt"),
        "bundledSkills": len(reduced),
        "totalSkills": len(total),
        "docsBase": "https://alice-agent.stuko.dev/docs/user-guide/skills/",
    }
    write_json(SKILLS_OUT, {"meta": meta, "skills": reduced})
    return meta


def sync_models() -> None:
    catalog = read_json(WEBSITE / "static/api/model-catalog.json")
    write_json(MODELS_OUT, catalog)


def sync_blueprints() -> None:
    bp = read_json(WEBSITE / "static/api/automation-blueprints-index.json")
    write_json(BLUEPRINTS_OUT, bp)


def sync_stories() -> dict:
    # NOTE: user-stories.json is hand-curated (mocked testimonials, sources deprecated).
    # Never overwrite it from the website repo — return the local copy untouched.
    if STORIES_OUT.exists():
        return read_json(STORIES_OUT)
    stories = read_json(WEBSITE / "src/data/userStories.json")
    usable = [s for s in stories if len(s.get("quote", "")) > 40 and s.get("url")]
    usable.sort(key=lambda s: s.get("date", ""), reverse=True)
    top = [{f: s.get(f) for f in STORY_FIELDS if s.get(f)} for s in usable[:STORY_TOP_N]]
    payload = {"totalStories": len(stories), "stories": top}
    write_json(STORIES_OUT, payload)
    return payload


def optimize_png(src: Path, dst: Path, width: int = 960) -> None:
    dst.parent.mkdir(parents=True, exist_ok=True)
    im = Image.open(src)
    if im.mode != "RGB":
        im = im.convert("RGB")
    if im.width > width:
        ratio = width / im.width
        im = im.resize((width, round(im.height * ratio)), Image.LANCZOS)
    im.save(dst, "PNG", optimize=True)


def sync_images() -> list:
    copied = []
    for name in DASHBOARD_SHOTS:
        optimize_png(WEBSITE / "static/img/dashboard" / name, IMG_OUT / "dashboard" / name)
        copied.append(f"img/dashboard/{name}")
    for name in KANBAN_SHOTS:
        optimize_png(WEBSITE / "static/img/kanban-tutorial" / name, IMG_OUT / "kanban" / name, width=880)
        copied.append(f"img/kanban/{name}")
    for name in DOCS_SVGS:
        dst = IMG_OUT / "docs" / name
        dst.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy(WEBSITE / "static/img/docs" / name, dst)
        copied.append(f"img/docs/{name}")
    return copied


def sync_favicons() -> list:
    copied = []
    pairs = [
        ("static/img/favicon.ico", "favicon.ico"),
        ("static/img/favicon-16x16.png", "favicon-16x16.png"),
        ("static/img/favicon-32x32.png", "favicon-32x32.png"),
        ("static/img/apple-touch-icon.png", "apple-touch-icon.png"),
    ]
    for src_rel, name in pairs:
        shutil.copy(WEBSITE / src_rel, PUBLIC / name)
        copied.append(name)
    manifest = {
        "name": "Alice Agent",
        "short_name": "Alice",
        "description": "The self-improving AI agent",
        "start_url": "/",
        "display": "standalone",
        "background_color": "#191724",
        "theme_color": "#f0c040",
        "icons": [
            {"src": "/favicon-16x16.png", "sizes": "16x16", "type": "image/png"},
            {"src": "/favicon-32x32.png", "sizes": "32x32", "type": "image/png"},
            {"src": "/apple-touch-icon.png", "sizes": "180x180", "type": "image/png"},
        ],
    }
    write_json(PUBLIC / "site.webmanifest", manifest)
    copied.append("site.webmanifest")
    return copied


def main() -> None:
    total_skills = read_json(WEBSITE / "static/api/skills.json")
    skills_meta = sync_skills(total_skills)
    sync_models()
    sync_blueprints()
    stories_meta = sync_stories()
    imgs = sync_images()
    favs = sync_favicons()

    print(f"skills: {skills_meta['bundledSkills']} bundled of {skills_meta['totalSkills']} total -> {SKILLS_OUT.relative_to(ROOT)}")
    print(f"models: {MODELS_OUT.relative_to(ROOT)}")
    print(f"blueprints: {BLUEPRINTS_OUT.relative_to(ROOT)}")
    print(f"stories: top {len(stories_meta['stories'])} of {stories_meta['totalStories']} -> {STORIES_OUT.relative_to(ROOT)}")
    print(f"images: {len(imgs)} files -> public/img/")
    print(f"favicons: {len(favs)} files")


if __name__ == "__main__":
    main()
