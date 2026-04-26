#!/usr/bin/env bash
set -euo pipefail

# =============================================================================
# scripts/m1/init-db.sh
# Copies db/init.sql into the running PostgreSQL pod and executes it.
#
# Usage:
#   ./scripts/m1/init-db.sh              # uses defaults
#   ./scripts/m1/init-db.sh --verify     # run schema check only (no re-init)
#
# Prerequisites:
#   - kubectl configured and pointing at the correct cluster/context
#   - postgres pod must be Running in the 'data' namespace
#   - db/init.sql must exist (assembled by M1)
# =============================================================================

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$REPO_ROOT"

# --- Config (matches k8s/postgres/postgres-secret.yaml + configmap.yaml) ----
NS_DATA="data"
PG_LABEL="app=postgres"
PG_USER="salaryapp"
PG_DB="salarydb"
INIT_SQL="db/init.sql"
REMOTE_PATH="/tmp/init.sql"

# --- Guards ------------------------------------------------------------------
if ! command -v kubectl >/dev/null 2>&1; then
  echo "Error: kubectl is not installed."
  exit 1
fi

if [[ "${1:-}" == "--verify" ]]; then
  VERIFY_ONLY=true
else
  VERIFY_ONLY=false
fi

if [[ "$VERIFY_ONLY" == "false" && ! -f "$INIT_SQL" ]]; then
  echo "Error: $INIT_SQL not found. Run from the repository root."
  exit 1
fi

# --- Find the postgres pod ---------------------------------------------------
echo "Looking for postgres pod in namespace '${NS_DATA}'..."
POD=$(kubectl get pod -n "$NS_DATA" -l "$PG_LABEL" \
  -o jsonpath='{.items[0].metadata.name}' 2>/dev/null || true)

if [[ -z "$POD" ]]; then
  echo "Error: No postgres pod found with label '${PG_LABEL}' in namespace '${NS_DATA}'."
  echo "  Make sure deploy-k8s.sh has been run first."
  exit 1
fi

echo "Found pod: ${POD}"

# --- Wait for pod to be ready ------------------------------------------------
echo "Waiting for postgres pod to be Ready..."
if ! kubectl wait --for=condition=ready pod "$POD" -n "$NS_DATA" --timeout=120s; then
  echo "Error: postgres pod did not become Ready in time."
  kubectl describe pod "$POD" -n "$NS_DATA"
  exit 1
fi

# --- Verify only mode --------------------------------------------------------
if [[ "$VERIFY_ONLY" == "true" ]]; then
  echo ""
  echo "=== Schema verification ==="
  kubectl exec -n "$NS_DATA" "$POD" -- \
    psql -U "$PG_USER" -d "$PG_DB" -c "\dn"
  echo ""
  echo "=== Tables per schema ==="
  kubectl exec -n "$NS_DATA" "$POD" -- \
    psql -U "$PG_USER" -d "$PG_DB" \
    -c "\dt identity.*" \
    -c "\dt salary.*" \
    -c "\dt community.*"
  exit 0
fi

# --- Copy init.sql into the pod ----------------------------------------------
echo "Copying ${INIT_SQL} → ${POD}:${REMOTE_PATH}"
kubectl cp "$INIT_SQL" "${NS_DATA}/${POD}:${REMOTE_PATH}"

# --- Execute init.sql --------------------------------------------------------
echo "Executing init.sql against database '${PG_DB}'..."
kubectl exec -n "$NS_DATA" "$POD" -- \
  psql -U "$PG_USER" -d "$PG_DB" -f "$REMOTE_PATH"

# --- Verify schemas were created ---------------------------------------------
echo ""
echo "=== Schema verification ==="
kubectl exec -n "$NS_DATA" "$POD" -- \
  psql -U "$PG_USER" -d "$PG_DB" -c "\dn"

echo ""
echo "=== Tables per schema ==="
kubectl exec -n "$NS_DATA" "$POD" -- \
  psql -U "$PG_USER" -d "$PG_DB" \
  -c "\dt identity.*" \
  -c "\dt salary.*" \
  -c "\dt community.*"

echo ""
echo "Database initialisation complete."
echo "Expected schemas: identity, salary, community"
echo "Run with --verify at any time to re-check schema state."
