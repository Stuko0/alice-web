# ============================================================================
# Alice Agent Installer (Windows)
# ============================================================================
# Downloads the latest Windows Setup .exe release from GitHub and launches it.
#
# Usage (PowerShell):
#   iex (irm https://alice-agent.stuko.dev/install.ps1)
#
# Options:
#   -DownloadOnly       Just download the installer, do not launch it.
#   -Version <tag>      Install a specific release (default: latest).
# ============================================================================

[CmdletBinding()]
param(
    [switch]$DownloadOnly,
    [string]$Version = "latest"
)

$ErrorActionPreference = "Stop"

$Repo    = "Stuko0/alice-agent"
$Pattern = "Alice-.*-Setup\.exe$"

function Write-Step([string]$msg) { Write-Host "ℹ  $msg" -ForegroundColor Cyan }
function Write-Ok([string]$msg)   { Write-Host "✔  $msg" -ForegroundColor Green }
function Write-Err([string]$msg)  { Write-Host "✘  $msg" -ForegroundColor Red }

if ($Version -eq "latest") {
    $api = "https://api.github.com/repos/$Repo/releases/latest"
} else {
    $api = "https://api.github.com/repos/$Repo/releases/tags/$Version"
}

Write-Step "Resolving release from $Repo ($Version)..."
try {
    $rel = Invoke-RestMethod -Uri $api -Headers @{ "User-Agent" = "AliceInstaller" } -ErrorAction Stop
} catch {
    Write-Err "Failed to query GitHub releases: $_"
    exit 1
}

$asset = $rel.assets | Where-Object { $_.name -match $Pattern } | Select-Object -First 1
if (-not $asset) {
    Write-Err "No Windows installer asset matching '$Pattern' in release $($rel.tag_name)."
    Write-Err "See https://github.com/$Repo/releases"
    exit 1
}

$destDir = Join-Path $env:TEMP "alice-agent-installer"
New-Item -ItemType Directory -Path $destDir -Force | Out-Null
$dest = Join-Path $destDir $asset.name

Write-Step "Downloading $($rel.tag_name) → $($asset.browser_download_url)"
try {
    Invoke-WebRequest -Uri $asset.browser_download_url -OutFile $dest -UseBasicParsing -ErrorAction Stop
} catch {
    Write-Err "Download failed: $_"
    exit 1
}
Write-Ok "Saved → $dest"

if ($DownloadOnly) {
    Write-Ok "Download-only mode — finished. Run the file manually to install."
    Write-Host ""
    Write-Host "  & `"$dest`"" -ForegroundColor Yellow
    exit 0
}

Write-Step "Launching installer (GUI)…"
Start-Process -FilePath $dest -Wait
Write-Ok "Alice Agent installed. Start it from the Start Menu or run 'Alice' from a new terminal."
