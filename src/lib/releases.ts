/**
 * Resolve the latest Alice Agent release from GitHub at build time.
 * Falls back to a known-good version if the API is unreachable so the
 * static build never breaks on a transient network error.
 */

export interface ReleaseInfo {
  tag: string;
  version: string; // tag without leading "v"
  winExeUrl: string | null;
  linuxTarUrl: string;
  winExeName: string | null;
  linuxTarName: string;
}

const REPO = "Stuko0/alice-agent";
const LATEST = `https://github.com/${REPO}/releases/latest/download`;
const FALLBACK: ReleaseInfo = {
  tag: "v0.23.1",
  version: "0.23.1",
  winExeUrl: `${LATEST}/alice-desktop.exe`,
  linuxTarUrl: `${LATEST}/alice-linux-x86_64.tar.gz`,
  winExeName: "alice-desktop.exe",
  linuxTarName: "alice-linux-x86_64.tar.gz",
};

// One API call per build process (frontmatter runs once per lang per page)
let cached: Promise<ReleaseInfo> | null = null;

export async function getLatestRelease(): Promise<ReleaseInfo> {
  cached ??= fetchLatest().catch((err) => {
    console.warn(`[releases] GitHub API unreachable, using fallback: ${err}`);
    cached = null; // allow a retry on the next build if this one failed
    return FALLBACK;
  });
  return cached;
}

async function fetchLatest(): Promise<ReleaseInfo> {
  const res = await fetch(
    `https://api.github.com/repos/${REPO}/releases/latest`,
    { headers: { "User-Agent": "alice-web", Accept: "application/vnd.github+json" } },
  );
  if (!res.ok) throw new Error(`GitHub API ${res.status}`);
  const rel = await res.json();
  const tag: string = rel.tag_name ?? FALLBACK.tag;
  const version = tag.replace(/^v/, "");

  const asset = (pattern: RegExp) => {
    const hit = (rel.assets ?? []).find((a: { name: string }) => pattern.test(a.name));
    return hit
      ? { name: hit.name, url: hit.browser_download_url }
      : null;
  };

  // Windows installer: the repo ships "alice-desktop.exe" (older releases used "*-Setup.exe")
  const win = asset(/\.exe$/);
  const linux = asset(/linux-x86_64\.tar\.gz$/);

  return {
    tag,
    version,
    // When an asset is missing, the generic latest/download URL still tracks
    // the newest release — safer than baking in a tag that goes stale.
    winExeUrl: win?.url ?? FALLBACK.winExeUrl,
    linuxTarUrl: linux?.url ?? FALLBACK.linuxTarUrl,
    winExeName: win?.name ?? FALLBACK.winExeName,
    linuxTarName: linux?.name ?? FALLBACK.linuxTarName,
  };
}
