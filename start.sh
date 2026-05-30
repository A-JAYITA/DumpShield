#!/bin/bash

echo "🚀 Starting DUMP SHIELD AI Platform..."

# Start Backend
echo "Starting Backend (FastAPI) on port 8000..."
./backend/venv/bin/python backend/main.py &

# Start Frontend
echo "Starting Frontend (Vite) on port 5173..."
cd frontend && npm run dev -- --host &

echo "✅ Both services are starting."
echo "🔗 Frontend: http://localhost:5173"
echo "🔗 Backend: http://localhost:8000"
echo "Press Ctrl+C to stop both (you may need to kill processes manually if they background)."
wait
