#!/bin/bash
# ============================================================================
# Alice Agent Installer (Linux / macOS)
# ============================================================================
# Downloads the latest standalone release binary from GitHub and installs it.
#
# Usage:
#   curl -fsSL https://alice-agent.stuko.dev/install.sh | bash
#
# Options:
#   --install-dir DIR   Where to install (default: ~/.local/bin/alice)
#   --version TAG       Install a specific release (default: latest)
#   --uninstall         Remove the installed binary
# ============================================================================

set -e

REPO="Stuko0/alice-agent"
BIN="alice"
DEFAULT_INSTALL_DIR="$HOME/.local/bin"

RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[0;33m'; CYAN='\033[0;36m'; NC='\033[0m'

log_info()    { printf "${CYAN}ℹ${NC}  %s\n" "$1"; }
log_success() { printf "${GREEN}✔${NC}  %s\n" "$1"; }
log_warn()    { printf "${YELLOW}⚠${NC}  %s\n" "$1"; }
log_error()   { printf "${RED}✘${NC}  %s\n" "$1" >&2; }

INSTALL_DIR=""
VERSION="latest"
UNINSTALL=false

# ------ args ------
while [ $# -gt 0 ]; do
    case "$1" in
        --install-dir) INSTALL_DIR="$2"; shift 2 ;;
        --version)     VERSION="$2"; shift 2 ;;
        --uninstall)   UNINSTALL=true; shift ;;
        -h|--help)
            sed -n '4,15p' "$0"; exit 0 ;;
        *) log_error "Unknown option: $1"; exit 1 ;;
    esac
done

OS="$(uname -s)"
ARCH="$(uname -m)"

# ------ uninstall ------
if [ "$UNINSTALL" = true ]; then
    TARGET="${INSTALL_DIR:-$DEFAULT_INSTALL_DIR}/$BIN"
    if [ -f "$TARGET" ]; then
        rm -f "$TARGET"
        log_success "Removed $TARGET"
        log_info "Data dir ~/.alice was left untouched (remove manually if desired)"
    else
        log_warn "Nothing installed at $TARGET"
    fi
    exit 0
fi

# ------ platform mapping ------
case "$OS:$ARCH" in
    Linux:x86_64)        ASSET_PATTERN="alice-linux-x86_64.tar.gz" ;;
    Linux:aarch64|Linux:arm64)
        log_error "Linux ARM64 builds are not available yet."; exit 1 ;;
    Darwin:*)
        log_error "macOS binaries are not released yet — próximamente."
        exit 1 ;;
    *)
        log_error "Unsupported platform: $OS/$ARCH"; exit 1 ;;
esac

# ------ resolve release ------
if [ "$VERSION" = "latest" ]; then
    API="https://api.github.com/repos/$REPO/releases/latest"
else
    API="https://api.github.com/repos/$REPO/releases/tags/$VERSION"
fi

log_info "Resolving release from $REPO ($VERSION)..."
DOWNLOAD_URL="$(curl -fsSL "$API" | grep -oP '"browser_download_url":\s*"\K[^"]+' | grep -F "$ASSET_PATTERN" | head -n 1 || true)"
TAG_NAME="$(curl -fsSL "$API" | grep -oP '"tag_name":\s*"\K[^"]+' | head -n 1 || true)"

if [ -z "$DOWNLOAD_URL" ]; then
    log_error "Asset '$ASSET_PATTERN' not found in release ${TAG_NAME:-unknown}."
    log_error "List available assets at https://github.com/$REPO/releases"
    exit 1
fi

DEST_DIR="${INSTALL_DIR:-$DEFAULT_INSTALL_DIR}"
DEST="$DEST_DIR/$BIN"

log_info "Downloading $TAG_NAME → $DOWNLOAD_URL"
TMPDIR_DOWNLOAD="$(mktemp -d)"
trap 'rm -rf "$TMPDIR_DOWNLOAD"' EXIT
curl -fsSL -o "$TMPDIR_DOWNLOAD/alice.tar.gz" "$DOWNLOAD_URL"

log_info "Extracting..."
tar -xzf "$TMPDIR_DOWNLOAD/alice.tar.gz" -C "$TMPDIR_DOWNLOAD"
if [ ! -f "$TMPDIR_DOWNLOAD/$BIN" ]; then
    log_error "Tarball did not contain a top-level '$BIN' binary."
    tar -tzf "$TMPDIR_DOWNLOAD/alice.tar.gz" | head >&2
    exit 1
fi

# ------ install ------
mkdir -p "$DEST_DIR"
install -m 0755 "$TMPDIR_DOWNLOAD/$BIN" "$DEST"

log_success "Installed Alice Agent $TAG_NAME → $DEST"

# PATH hint
case ":$PATH:" in
    *":$DEST_DIR:"*) ;;
    *)
        log_warn "$DEST_DIR is not in your PATH."
        log_info "Add it:  echo 'export PATH=\"$DEST_DIR:\$PATH\"' >> ~/.bashrc (or ~/.zshrc)"
        ;;
esac

echo
log_success "Run:  $BIN --help     or     $BIN chat"
log_info  "First run creates ~/.alice/ (config, sessions, memory, skills)."
