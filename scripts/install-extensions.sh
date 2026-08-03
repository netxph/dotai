#!/usr/bin/env bash
set -euo pipefail

if ! command -v pi >/dev/null 2>&1; then
  echo "pi not found in PATH" >&2
  exit 1
fi

if ! command -v npm >/dev/null 2>&1; then
  echo "npm not found in PATH" >&2
  exit 1
fi

packages=(
  "npm:pi-openplan"
  "npm:pi-lmstudio"
  "npm:pi-web-access"
  "npm:pi-agent-browser-native"
  "git:github.com/DietrichGebert/ponytail"
)

installed="$(pi list 2>/dev/null || true)"

for pkg in "${packages[@]}"; do
  if grep -Fq "$pkg" <<<"$installed"; then
    echo "skip  $pkg"
  else
    echo "install $pkg"
    pi install "$pkg"
  fi
done

if command -v agent-browser >/dev/null 2>&1; then
  echo "skip  agent-browser"
else
  echo "install agent-browser"
  npm install -g agent-browser
fi

echo "done"
