#!/usr/bin/env bash
set -euo pipefail

BASE="${1:-http://localhost}"
FAILED=0

green() { printf "\033[32m%s\033[0m\n" "$1"; }
red()   { printf "\033[31m%s\033[0m\n" "$1"; }

check() {
  local label="$1" url="$2" expect="$3"
  local status
  status=$(curl -s -o /dev/null -w "%{http_code}" "$url" 2>/dev/null || true)
  if [ "$status" = "$expect" ]; then
    green "  ✓ $label"
  else
    red "  ✗ $label (expected $expect, got $status)"
    FAILED=1
  fi
}

check_body() {
  local label="$1" url="$2" pattern="$3"
  if curl -s "$url" 2>/dev/null | grep -q "$pattern"; then
    green "  ✓ $label"
  else
    red "  ✗ $label (pattern not found)"
    FAILED=1
  fi
}

echo "=== Dominion Deck Health Checks ==="
echo ""

echo "Backend"
check "GET /api/expansions returns 200" "$BASE/api/expansions" 200

echo ""
echo "Frontend"
check "GET / returns 200" "$BASE/" 200
check_body "GET / returns HTML" "$BASE/" "<html"

echo ""
echo "API Proxy"
check "GET /api/expansions via nginx returns 200" "$BASE/api/expansions" 200

echo ""
echo "Database"
CARD_COUNT=$(curl -s "$BASE/api/cards?kingdom_only=false" 2>/dev/null | python3 -c "import sys,json; print(len(json.load(sys.stdin)))" 2>/dev/null || echo "0")
if [ "$CARD_COUNT" -gt 0 ]; then
  green "  ✓ DB has $CARD_COUNT cards after startup"
else
  red "  ✗ DB has 0 cards — seed may have failed"
  FAILED=1
fi

echo ""
if [ "$FAILED" = 0 ]; then
  green "All checks passed"
else
  red "Some checks failed"
  exit 1
fi
