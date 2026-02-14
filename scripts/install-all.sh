#!/bin/bash
set -e

echo "══════════════════════════════════════════"
echo "  HRFlow - Installing All Dependencies"
echo "══════════════════════════════════════════"

ROOT_DIR="$(dirname "$0")/.."
cd "$ROOT_DIR"

# Shared
echo ""
echo "▸ Installing shared dependencies..."
cd shared && npm install && cd ..

# API Gateway
echo ""
echo "▸ Installing api-gateway dependencies..."
cd api-gateway && npm install && cd ..

# Services
SERVICES=("auth-service" "employee-service" "attendance-service" "payroll-service" "recruitment-service" "lms-service" "policy-service")

for service in "${SERVICES[@]}"; do
  echo ""
  echo "▸ Installing $service dependencies..."
  cd "services/$service" && npm install && cd ../..
done

# Frontend
echo ""
echo "▸ Installing web frontend dependencies..."
cd web && npm install && cd ..

echo ""
echo "══════════════════════════════════════════"
echo "  All dependencies installed!"
echo "══════════════════════════════════════════"
