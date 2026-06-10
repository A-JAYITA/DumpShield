#!/bin/bash

echo "🚀 Starting DUMP SHIELD AI Platform..."

echo "Checking backend auth routes..."
cd backend || exit 1
./venv/bin/python -c "from main import app; print('Auth routes:', [route.path for route in app.routes if route.path.startswith('/api/v1/auth')])"
cd .. || exit 1

# Start Backend
echo "Starting Backend (FastAPI) on port 8000..."
cd backend && ./venv/bin/python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000 &

# Start Frontend
echo "Starting Frontend (Vite) on port 5173..."
cd frontend && npm run dev -- --host 0.0.0.0 &

echo "✅ Both services are starting."
echo "🔗 Frontend: http://localhost:5173"
echo "🔗 Backend: http://localhost:8000"
echo "Press Ctrl+C to stop both (you may need to kill processes manually if they background)."
wait
