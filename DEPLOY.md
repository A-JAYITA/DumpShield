# Deployment Guide: DUMP SHIELD AI

This guide outlines how to build and deploy the DUMP SHIELD AI platform for production environments.

## 1. Prerequisites
- Docker (recommended for production)
- Node.js 20+
- Python 3.11+
- PostgreSQL (if moving away from mock data)

## 2. Production Build

### Frontend (Vite)
1. Build the production bundle:
   ```bash
   cd frontend
   npm install
   npm run build
   ```
2. The static files will be generated in `frontend/dist`. These can be served via Nginx or any static web host.

### Backend (FastAPI)
1. Install production dependencies:
   ```bash
   cd backend
   python3 -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   ```
2. Run with production server:
   ```bash
   gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker -b 0.0.0.0:8000
   ```

## 3. Docker Deployment (Recommended)
Use the following `Dockerfile` approach to containerize the solution:

### Backend Dockerfile
```dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["gunicorn", "app.main:app", "-k", "uvicorn.workers.UvicornWorker", "-b", "0.0.0.0:8000"]
```

### Frontend Dockerfile
```dockerfile
FROM node:20 as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
```

## 4. Environment Variables
- `API_BASE_URL`: The URL where the backend is hosted (used by the frontend).
- `DATABASE_URL`: Connection string for PostgreSQL (if upgrading from mock data).

## 5. Deployment Options
- **Vercel/Netlify:** Deploy the `frontend/dist` folder for high-speed CDN hosting.
- **Render/Railway:** Use for FastAPI backend hosting.
- **GHMC Cloud:** Recommended private infrastructure deployment.
