#!/usr/bin/env bash
set -euo pipefail

ACR_NAME="${1:-techsalaryacr}"
REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$REPO_ROOT"

if ! command -v docker >/dev/null 2>&1; then
  echo "Error: docker is not installed."
  exit 1
fi

SERVICES=(frontend bff salary-submission identity vote search stats)

missing=()
for svc in "${SERVICES[@]}"; do
  dockerfile="services/${svc}/Dockerfile"
  if [[ ! -s "$dockerfile" ]]; then
    missing+=("$svc")
  fi
done

if [[ ${#missing[@]} -gt 0 ]]; then
  echo "Error: missing/empty Dockerfiles for services:"
  printf '  - %s\n' "${missing[@]}"
  echo "These must be completed by service owners before M1 can push all images."
  exit 1
fi

if ! command -v az >/dev/null 2>&1; then
  echo "Error: Azure CLI (az) is not installed."
  exit 1
fi

echo "Logging in to ACR: ${ACR_NAME}"
az acr login --name "$ACR_NAME"

for svc in "${SERVICES[@]}"; do
  image="${ACR_NAME}.azurecr.io/${svc}:latest"
  context="services/${svc}"
  echo "Building ${image}"
  docker build -t "$image" "$context"
  echo "Pushing ${image}"
  docker push "$image"
done

echo "Image build/push completed."
