import random
from datetime import datetime, timedelta
from typing import List, Optional
from fastapi import FastAPI, UploadFile, File, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from app.config import get_settings
from app.database import ensure_indexes
from app.routes.auth import router as auth_router

app = FastAPI(title="DUMP SHIELD AI - Hyderabad Smart City Intelligence")
settings = get_settings()

# CORS for Frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=settings.cors_origins != ["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)


@app.on_event("startup")
def startup_event():
    ensure_indexes()

# Models
class Hotspot(BaseModel):
    id: int
    lat: float
    lng: float
    name: str
    risk_score: float
    garbage_percentage: float  # Added field
    status: str  # "active", "predicted", "cleaned"
    severity: str # "high", "medium", "low"

class Forecast(BaseModel):
    date: str
    probability: float
    risk_level: str

class ClassificationResult(BaseModel):
    waste_type: str
    confidence: float
    description: str

class VerificationResult(BaseModel):
    cleanup_percentage: float
    verified: bool
    savings_estimated: float

# Mock Data
MOCK_HOTSPOTS = [
    {"id": 1, "lat": 17.4447, "lng": 78.3483, "name": "Gachibowli Junction", "risk_score": 0.85, "garbage_percentage": 75.5, "status": "active", "severity": "high"},
    {"id": 2, "lat": 17.4065, "lng": 78.4772, "name": "Charminar Area", "risk_score": 0.65, "garbage_percentage": 42.0, "status": "predicted", "severity": "medium"},
    {"id": 3, "lat": 17.4486, "lng": 78.4468, "name": "Ameerpet Metro", "risk_score": 0.92, "garbage_percentage": 88.4, "status": "active", "severity": "high"},
    {"id": 4, "lat": 17.3850, "lng": 78.4867, "name": "Koti Market", "risk_score": 0.45, "garbage_percentage": 15.2, "status": "cleaned", "severity": "low"},
    {"id": 5, "lat": 17.4375, "lng": 78.4482, "name": "Punjagutta Flyover", "risk_score": 0.78, "garbage_percentage": 62.1, "status": "predicted", "severity": "high"},
    {"id": 6, "lat": 17.4239, "lng": 78.4519, "name": "Banjara Hills Rd 12", "risk_score": 0.35, "garbage_percentage": 10.5, "status": "cleaned", "severity": "low"},
    {"id": 7, "lat": 17.4933, "lng": 78.3914, "name": "Kukatpally Housing Board", "risk_score": 0.88, "garbage_percentage": 79.8, "status": "active", "severity": "high"},
    {"id": 8, "lat": 17.3616, "lng": 78.4747, "name": "Old City Chowmahalla", "risk_score": 0.72, "garbage_percentage": 55.4, "status": "active", "severity": "medium"},
    {"id": 9, "lat": 17.4435, "lng": 78.4983, "name": "Secunderabad Station", "risk_score": 0.95, "garbage_percentage": 92.1, "status": "active", "severity": "high"},
    {"id": 10, "lat": 17.4344, "lng": 78.3844, "name": "HITEC City Phase 2", "risk_score": 0.55, "garbage_percentage": 30.2, "status": "predicted", "severity": "medium"},
    {"id": 11, "lat": 17.4121, "lng": 78.4321, "name": "Mehdipatnam Rythu Bazar", "risk_score": 0.82, "garbage_percentage": 68.5, "status": "active", "severity": "high"},
    {"id": 12, "lat": 17.3989, "lng": 78.5012, "name": "Malakpet Market", "risk_score": 0.89, "garbage_percentage": 84.3, "status": "active", "severity": "high"},
    {"id": 13, "lat": 17.4600, "lng": 78.3500, "name": "Madhapur Tech Park", "risk_score": 0.40, "garbage_percentage": 20.0, "status": "cleaned", "severity": "low"},
    {"id": 14, "lat": 17.3700, "lng": 78.4500, "name": "Masab Tank", "risk_score": 0.70, "garbage_percentage": 50.0, "status": "predicted", "severity": "medium"},
    {"id": 15, "lat": 17.4800, "lng": 78.4200, "name": "Balanagar Industrial", "risk_score": 0.98, "garbage_percentage": 95.0, "status": "active", "severity": "high"},
    {"id": 16, "lat": 17.4100, "lng": 78.5200, "name": "Uppal Ring Road", "risk_score": 0.80, "garbage_percentage": 70.0, "status": "active", "severity": "high"},
]

@app.get("/")
def read_root():
    return {"message": "Welcome to Dump Shield AI - Hyderabad Smart City Intelligence Platform"}

@app.get("/api/v1/dashboard/stats")
def get_stats():
    return {
        "total_reports": 1240,
        "active_hotspots": 12,
        "predicted_hotspots": 8,
        "cleanup_success_rate": 92.5,
        "total_savings": 450000, # in INR
        "city_cleanliness_index": 78.4
    }

@app.get("/api/v1/map/hotspots", response_model=List[Hotspot])
def get_hotspots():
    return MOCK_HOTSPOTS

@app.get("/api/v1/forecast/{area_id}", response_model=List[Forecast])
def get_forecast(area_id: int):
    forecasts = []
    base_date = datetime.now()
    for i in range(1, 8):
        date = (base_date + timedelta(days=i)).strftime("%Y-%m-%d")
        prob = random.uniform(0.1, 0.95)
        level = "High" if prob > 0.7 else "Medium" if prob > 0.4 else "Low"
        forecasts.append({"date": date, "probability": round(prob, 2), "risk_level": level})
    return forecasts

@app.post("/api/v1/ai/classify", response_model=ClassificationResult)
async def classify_waste(file: UploadFile = File(...)):
    # Mock AI Logic
    types = ["Plastic", "Organic", "Construction Debris", "Mixed Waste", "Industrial"]
    waste_type = random.choice(types)
    confidence = random.uniform(0.85, 0.99)
    return {
        "waste_type": waste_type,
        "confidence": round(confidence, 2),
        "description": f"Detected {waste_type} with high confidence using YOLOv8."
    }

@app.post("/api/v1/ai/verify", response_model=VerificationResult)
async def verify_cleanup(before: UploadFile = File(...), after: UploadFile = File(...)):
    # Mock AI Verification Logic
    cleanup_pct = random.uniform(85.0, 100.0)
    savings = random.uniform(5000, 25000)
    return {
        "cleanup_percentage": round(cleanup_pct, 1),
        "verified": cleanup_pct > 90.0,
        "savings_estimated": round(savings, 2)
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
