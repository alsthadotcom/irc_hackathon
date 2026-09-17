from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os

from backend.database import engine, Base
from backend.seed_data import seed_database
from backend.routers import auth, projects, mentors, opportunities, admin

# Initialize FastAPI application
app = FastAPI(
    title="Islington College Research & Opportunity Platform API",
    description="Centralized Institutional Project Discovery, Mentor Validation Pipeline, and Global Opportunity Discovery Engine.",
    version="1.0.0"
)

# Enable CORS for React Frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API Routers
app.include_router(auth.router)
app.include_router(projects.router)
app.include_router(mentors.router)
app.include_router(opportunities.router)
app.include_router(admin.router)

@app.on_event("startup")
def startup_event():
    print("[FastAPI] Initializing Database Schemas & Seed Dataset...")
    seed_database()

@app.get("/")
def root():
    return {
        "status": "online",
        "platform": "Islington College Research & Opportunity Platform",
        "documentation": "/docs",
        "version": "1.0.0"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host="0.0.0.0", port=8000, reload=True)
