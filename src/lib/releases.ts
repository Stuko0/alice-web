/**
 * Resolve the latest Alice Agent release from GitHub at build time.
 * Falls back to a known-good version if the API is unreachable so the
 * static build never breaks on a transient network error.
 */

export interface ReleaseInfo {
  tag: string;
  version: string; // tag without leading "v"
  winExeUrl: string;
  linuxTarUrl: string;
  winExeName: string;
  linuxTarName: string;
}

const REPO = "Stuko0/alice-agent";
const FALLBACK: ReleaseInfo = {
  tag: "v0.18.1",
  version: "0.18.1",
  winExeUrl: `https://github.com/${REPO}/releases/latest/download/Alice-0.17.0-Setup.exe`,
  linuxTarUrl: `https://github.com/${REPO}/releases/latest/download/alice-linux-x86_64.tar.gz`,
  winExeName: "Alice-0.17.0-Setup.exe",
  linuxTarName: "alice-linux-x86_64.tar.gz",
};

// Latest-download URLs never hardcode a version — GitHub redirects them to the
// newest release automatically. Only the displayed label needs the real tag.
export const LATEST_DOWNLOAD = {
  winExe: `https://github.com/${REPO}/releases/latest/download/${FALLBACK.winExeName}`,
  linuxTar: `https://github.com/${REPO}/releases/latest/download/${FALLBACK.linuxTarName}`,
};

export async function getLatestRelease(): Promise<ReleaseInfo> {
  try {
    const res = await fetch(
      `https://api.github.com/repos/${REPO}/releases/latest`,
      { headers: { "User-Agent": "alice-web", Accept: "application/vnd.github+json" } },
    );
    if (!res.ok) throw new Error(`GitHub API ${res.status}`);
    const rel = await res.json();
    const tag: string = rel.tag_name ?? FALLBACK.tag;
    const version = tag.replace(/^v/, "");

    const asset = (pattern: RegExp, fallbackName: string) => {
      const hit = (rel.assets ?? []).find((a: { name: string }) => pattern.test(a.name));
      return {
        name: hit?.name ?? fallbackName,
        url: hit
          ? hit.browser_download_url
          : `https://github.com/${REPO}/releases/latest/download/${fallbackName}`,
      };
    };

    const win = asset(/Setup\.exe$/, FALLBACK.winExeName);
    const linux = asset(/linux-x86_64\.tar\.gz$/, FALLBACK.linuxTarName);

    return { tag, version, winExeUrl: win.url, linuxTarUrl: linux.url, winExeName: win.name, linuxTarName: linux.name };
  } catch {
    return FALLBACK;
  }
}
