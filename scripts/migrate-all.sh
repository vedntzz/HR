#!/bin/bash
set -e

echo "══════════════════════════════════════════"
echo "  HRFlow - Running All Migrations"
echo "══════════════════════════════════════════"

SERVICES=(
  "auth-service"
  "employee-service"
  "attendance-service"
  "payroll-service"
  "recruitment-service"
  "lms-service"
  "policy-service"
)

for service in "${SERVICES[@]}"; do
  echo ""
  echo "▸ Migrating $service..."
  cd "$(dirname "$0")/../services/$service"
  npx ts-node src/config/migrate.ts
  echo "  ✓ $service migrated"
  cd - > /dev/null
done

echo ""
echo "══════════════════════════════════════════"
echo "  All migrations completed successfully"
echo "══════════════════════════════════════════"
