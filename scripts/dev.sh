#!/bin/bash
set -e

echo "══════════════════════════════════════════"
echo "  HRFlow - Starting Development Mode"
echo "══════════════════════════════════════════"
echo ""
echo "Starting all services..."
echo ""

# Start each service in background
cd "$(dirname "$0")/.."

# Start API Gateway
echo "▸ Starting API Gateway on :3000"
cd api-gateway && npm run dev &
cd ..

# Start microservices
SERVICES=("auth-service:3001" "employee-service:3002" "attendance-service:3003" "payroll-service:3004" "recruitment-service:3005" "lms-service:3006" "policy-service:3007")

for entry in "${SERVICES[@]}"; do
  service="${entry%%:*}"
  port="${entry##*:}"
  echo "▸ Starting $service on :$port"
  cd "services/$service" && npm run dev &
  cd ../..
done

# Start frontend
echo "▸ Starting Web Frontend on :8080"
cd web && npm run dev -- -p 8080 &
cd ..

echo ""
echo "══════════════════════════════════════════"
echo "  All services started!"
echo "  Gateway:  http://localhost:3000"
echo "  Frontend: http://localhost:8080"
echo "══════════════════════════════════════════"

# Wait for all background processes
wait
