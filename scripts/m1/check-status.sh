#!/usr/bin/env bash
set -euo pipefail

if ! command -v kubectl >/dev/null 2>&1; then
  echo "Error: kubectl is not installed."
  exit 1
fi

echo "=== DATA NAMESPACE ==="
kubectl get pods -n data
kubectl get svc -n data

echo
echo "=== APP NAMESPACE ==="
kubectl get pods -n app
kubectl get svc -n app
kubectl get ingress -n app
