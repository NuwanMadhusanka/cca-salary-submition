#!/usr/bin/env bash
set -euo pipefail

# =============================================================================
# scripts/m1/build-local-images.sh
# Builds all 7 service images for Docker Desktop Kubernetes (local dev).
#
# Usage:
#   ./scripts/m1/build-local-images.sh           # build all services
#   ./scripts/m1/build-local-images.sh bff vote  # build specific services only
#
# Images are tagged as techsalary-local/<service>:latest
# Docker Desktop shares the local Docker daemon with Kubernetes,
# so no push is needed — built images are immediately available to pods.
# =============================================================================

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$REPO_ROOT"

ALL_SERVICES=(frontend bff salary-submission identity vote search stats)

# If specific services passed as args, build only those
if [[ $# -gt 0 ]]; then
  SERVICES=("$@")
else
  SERVICES=("${ALL_SERVICES[@]}")
fi

if ! command -v docker >/dev/null 2>&1; then
  echo "Error: docker is not installed or not running."
  exit 1
fi

# Check all required Dockerfiles exist before starting
missing=()
for svc in "${SERVICES[@]}"; do
  if [[ ! -s "services/${svc}/Dockerfile" ]]; then
    missing+=("$svc")
  fi
done

if [[ ${#missing[@]} -gt 0 ]]; then
  echo "Error: missing or empty Dockerfiles:"
  printf '  - services/%s/Dockerfile\n' "${missing[@]}"
  exit 1
fi

echo "Building ${#SERVICES[@]} image(s) for Docker Desktop..."
echo ""

failed=()
for svc in "${SERVICES[@]}"; do
  image="techsalary-local/${svc}:latest"
  echo ">>> Building ${image}"
  if docker build -t "$image" "services/${svc}/"; then
    echo "    Done: ${image}"
  else
    echo "    FAILED: ${image}"
    failed+=("$svc")
  fi
  echo ""
done

echo "===== Build summary ====="
for svc in "${SERVICES[@]}"; do
  image="techsalary-local/${svc}:latest"
  if printf '%s\n' "${failed[@]}" | grep -q "^${svc}$"; then
    echo "  FAIL  ${image}"
  else
    echo "  OK    ${image}"
  fi
done

if [[ ${#failed[@]} -gt 0 ]]; then
  echo ""
  echo "Error: ${#failed[@]} build(s) failed. Fix the errors above before deploying."
  exit 1
fi

echo ""
echo "All images built. No push needed — Docker Desktop uses the local daemon directly."
echo "Next: ./scripts/m1/deploy-k8s.sh"
