#!/usr/bin/env bash
# Automated smoke tests for the mock database plan:
#   1. Auth (login Alice, login Bob, /me)
#   2. Properties CRUD (list, detail, images)
#   3. Matches & conversations
#   4. AI compatibility
#   5. MinIO image accessibility
set -euo pipefail

API="http://localhost:4001/api/v1"
MINIO="http://localhost:9000"
PASS=0
FAIL=0
TOTAL=0

green() { printf "\033[32m✓ %s\033[0m\n" "$1"; }
red()   { printf "\033[31m✗ %s\033[0m\n" "$1"; }

assert_status() {
  local label="$1" url="$2" expected="$3" method="${4:-GET}" data="${5:-}" headers="${6:-}"
  TOTAL=$((TOTAL + 1))
  local cmd=(curl -sS -o /dev/null -w "%{http_code}" -X "$method")
  [[ -n "$headers" ]] && cmd+=(-H "$headers")
  [[ -n "$data" ]] && cmd+=(-H "Content-Type: application/json" -d "$data")
  cmd+=("$url")
  local code
  code=$("${cmd[@]}" 2>&1) || true
  if [[ "$code" == "$expected" ]]; then
    green "$label → $code"
    PASS=$((PASS + 1))
  else
    red "$label → expected $expected, got $code"
    FAIL=$((FAIL + 1))
  fi
}

assert_json() {
  local label="$1" url="$2" jq_expr="$3" expected="$4" headers="${5:-}"
  TOTAL=$((TOTAL + 1))
  local cmd=(curl -sS)
  [[ -n "$headers" ]] && cmd+=(-H "$headers")
  cmd+=("$url")
  local val
  val=$("${cmd[@]}" 2>&1 | python3 -c "import sys,json; d=json.load(sys.stdin); print($jq_expr)" 2>/dev/null) || true
  if [[ "$val" == "$expected" ]]; then
    green "$label → $val"
    PASS=$((PASS + 1))
  else
    red "$label → expected '$expected', got '$val'"
    FAIL=$((FAIL + 1))
  fi
}

assert_json_match() {
  local label="$1" url="$2" jq_expr="$3" regex="$4" headers="${5:-}"
  TOTAL=$((TOTAL + 1))
  local cmd=(curl -sS)
  [[ -n "$headers" ]] && cmd+=(-H "$headers")
  cmd+=("$url")
  local val
  val=$("${cmd[@]}" 2>&1 | python3 -c "import sys,json; d=json.load(sys.stdin); print($jq_expr)" 2>/dev/null) || true
  if [[ "$val" =~ $regex ]]; then
    green "$label → matches"
    PASS=$((PASS + 1))
  else
    red "$label → no match for '$regex', got '$val'"
    FAIL=$((FAIL + 1))
  fi
}

echo "═══════════════════════════════════════════════════"
echo "  SwitchAppart Mock Plan — Automated Smoke Tests"
echo "═══════════════════════════════════════════════════"
echo

# ── 1. Auth ──────────────────────────────────────────
echo "── Auth ───────────────────────────"

ALICE_RESP=$(curl -sS -X POST "$API/auth/login" -H "Content-Type: application/json" -d '{"email":"mock.alice@example.com","password":"mock12345"}' 2>&1)
ALICE_TOKEN=$(echo "$ALICE_RESP" | python3 -c "import sys,json; print(json.load(sys.stdin)['data']['token'])" 2>/dev/null) || ALICE_TOKEN=""
if [[ -n "$ALICE_TOKEN" ]]; then
  green "Login Alice → token obtained"
  PASS=$((PASS + 1))
else
  red "Login Alice → no token"
  FAIL=$((FAIL + 1))
fi
TOTAL=$((TOTAL + 1))

BOB_RESP=$(curl -sS -X POST "$API/auth/login" -H "Content-Type: application/json" -d '{"email":"mock.bob@example.com","password":"mock12345"}' 2>&1)
BOB_TOKEN=$(echo "$BOB_RESP" | python3 -c "import sys,json; print(json.load(sys.stdin)['data']['token'])" 2>/dev/null) || BOB_TOKEN=""
if [[ -n "$BOB_TOKEN" ]]; then
  green "Login Bob → token obtained"
  PASS=$((PASS + 1))
else
  red "Login Bob → no token"
  FAIL=$((FAIL + 1))
fi
TOTAL=$((TOTAL + 1))

assert_json "GET /me Alice" "$API/auth/me" "d['data']['user']['email']" "mock.alice@example.com" "Authorization: Bearer $ALICE_TOKEN"
assert_json "GET /me Bob" "$API/auth/me" "d['data']['user']['email']" "mock.bob@example.com" "Authorization: Bearer $BOB_TOKEN"

assert_status "Login wrong password → 401" "$API/auth/login" "401" "POST" '{"email":"mock.alice@example.com","password":"wrongpw"}'

# ── 2. Properties ────────────────────────────────────
echo
echo "── Properties ─────────────────────"

assert_json "GET /properties total == 2" "$API/properties?limit=10" "d['data']['total']" "2"

PROP_LIST=$(curl -sS "$API/properties?limit=10" 2>&1)
ALICE_PROP_ID=$(echo "$PROP_LIST" | python3 -c "import sys,json; ps=json.load(sys.stdin)['data']['properties']; print([p['id'] for p in ps if 'Alice' in p['owner']['full_name']][0])" 2>/dev/null) || ALICE_PROP_ID=""
BOB_PROP_ID=$(echo "$PROP_LIST" | python3 -c "import sys,json; ps=json.load(sys.stdin)['data']['properties']; print([p['id'] for p in ps if 'Bob' in p['owner']['full_name']][0])" 2>/dev/null) || BOB_PROP_ID=""

assert_status "GET /properties/:id (Alice prop)" "$API/properties/$ALICE_PROP_ID" "200"
assert_status "GET /properties/:id (Bob prop)" "$API/properties/$BOB_PROP_ID" "200"

assert_json "Alice prop title" "$API/properties/$ALICE_PROP_ID" "d['data']['title']" "Studio lumineux – Paris 11e"
assert_json "Bob prop city" "$API/properties/$BOB_PROP_ID" "d['data']['city']" "Lyon"
assert_json "Bob prop has photo_paths" "$API/properties/$BOB_PROP_ID" "len(d['data']['photo_paths'])" "1"
assert_json "Alice prop cover_path" "$API/properties/$ALICE_PROP_ID" "d['data']['cover_path']" "mock/paris-a.jpg"

# ── 3. MinIO images ──────────────────────────────────
echo
echo "── MinIO Images ───────────────────"

assert_status "Image paris-a.jpg accessible" "$MINIO/properties/mock/paris-a.jpg" "200"
assert_status "Image lyon-b.jpg accessible" "$MINIO/properties/mock/lyon-b.jpg" "200"
assert_status "Image nonexistent → 404" "$MINIO/properties/mock/no-such.jpg" "404" "GET" "" "dummy: 1"

# ── 4. Matches & Conversations ──────────────────────
echo
echo "── Matches & Conversations ────────"

assert_json "Alice has 1 match" "$API/matches" "len(d['data'])" "1" "Authorization: Bearer $ALICE_TOKEN"
assert_json "Bob has 1 match" "$API/matches" "len(d['data'])" "1" "Authorization: Bearer $BOB_TOKEN"
assert_json_match "Match partner is Bob" "$API/matches" "d['data'][0]['otherUser']['full_name']" "Bob" "Authorization: Bearer $ALICE_TOKEN"

assert_json "Alice has 1 conversation" "$API/messages/conversations" "len(d['data'])" "1" "Authorization: Bearer $ALICE_TOKEN"
assert_json_match "Last message text" "$API/messages/conversations" "d['data'][0]['last_message_text']" "créneau" "Authorization: Bearer $ALICE_TOKEN"

CONV_ID=$(curl -sS "$API/messages/conversations" -H "Authorization: Bearer $ALICE_TOKEN" 2>&1 | python3 -c "import sys,json; print(json.load(sys.stdin)['data'][0]['id'])" 2>/dev/null) || CONV_ID=""
if [[ -n "$CONV_ID" ]]; then
  assert_json "Conversation has 4 messages" "$API/messages/conversations/$CONV_ID/messages" "len(d['data'])" "4" "Authorization: Bearer $ALICE_TOKEN"
fi

# ── 5. AI Compatibility ─────────────────────────────
echo
echo "── AI Compatibility ───────────────"

COMPAT_RESP=$(curl -sS "$API/properties/$BOB_PROP_ID/compatibility" -H "Authorization: Bearer $ALICE_TOKEN" 2>&1)
COMPAT_SCORE=$(echo "$COMPAT_RESP" | python3 -c "import sys,json; print(json.load(sys.stdin)['data']['score'])" 2>/dev/null) || COMPAT_SCORE=""
TOTAL=$((TOTAL + 1))
if [[ -n "$COMPAT_SCORE" ]] && [[ "$COMPAT_SCORE" =~ ^[0-9]+$ ]]; then
  green "Compatibility score → $COMPAT_SCORE/100"
  PASS=$((PASS + 1))
else
  red "Compatibility score → failed to get numeric score"
  FAIL=$((FAIL + 1))
fi

COMMON_COUNT=$(echo "$COMPAT_RESP" | python3 -c "import sys,json; print(len(json.load(sys.stdin)['data']['commonPoints']))" 2>/dev/null) || COMMON_COUNT="0"
TOTAL=$((TOTAL + 1))
if [[ "$COMMON_COUNT" -gt 0 ]]; then
  green "Common points → $COMMON_COUNT items"
  PASS=$((PASS + 1))
else
  red "Common points → empty"
  FAIL=$((FAIL + 1))
fi

WEAK_COUNT=$(echo "$COMPAT_RESP" | python3 -c "import sys,json; print(len(json.load(sys.stdin)['data']['weakPoints']))" 2>/dev/null) || WEAK_COUNT="0"
TOTAL=$((TOTAL + 1))
if [[ "$WEAK_COUNT" -gt 0 ]]; then
  green "Weak points → $WEAK_COUNT items"
  PASS=$((PASS + 1))
else
  red "Weak points → empty"
  FAIL=$((FAIL + 1))
fi

RECO=$(echo "$COMPAT_RESP" | python3 -c "import sys,json; r=json.load(sys.stdin)['data']['recommendation']; print(len(r))" 2>/dev/null) || RECO="0"
TOTAL=$((TOTAL + 1))
if [[ "$RECO" -gt 10 ]]; then
  green "Recommendation → $RECO chars"
  PASS=$((PASS + 1))
else
  red "Recommendation → too short ($RECO)"
  FAIL=$((FAIL + 1))
fi

assert_status "Compatibility without auth → 401" "$API/properties/$BOB_PROP_ID/compatibility" "401"

# ── 6. Edge Cases ────────────────────────────────────
echo
echo "── Edge Cases ─────────────────────"

assert_status "GET /properties nonexistent → 404" "$API/properties/00000000-0000-0000-0000-000000000000" "404"
assert_status "GET /auth/me without token → 401" "$API/auth/me" "401"

# ═══════════════════════════════════════════════════
echo
echo "═══════════════════════════════════════════════════"
if [[ $FAIL -eq 0 ]]; then
  printf "\033[32m  ALL %d TESTS PASSED ✓\033[0m\n" "$TOTAL"
else
  printf "\033[31m  %d/%d FAILED\033[0m — \033[32m%d passed\033[0m\n" "$FAIL" "$TOTAL" "$PASS"
fi
echo "═══════════════════════════════════════════════════"
exit "$FAIL"
