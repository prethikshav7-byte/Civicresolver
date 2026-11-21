import os
from datetime import datetime
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.app.core.config import settings
from backend.app.api.routes import complaints, ai, maps, admin, analytics, authentication

app = FastAPI(
    title="CivicResolve API",
    description="AI-Powered Citizen Grievance Management and Real-Time GIS Intelligence for Coimbatore, Tamil Nadu.",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Parse allowed origins from environment or settings
env_cors = os.environ.get("CORS_ORIGINS", "")
if env_cors:
    allowed_origins = [orig.strip() for orig in env_cors.split(",") if orig.strip()]
elif settings.ENVIRONMENT == "production":
    allowed_origins = settings.CORS_ORIGINS
else:
    # Development mode: local vite, local ports, and vercel preview
    allowed_origins = settings.CORS_ORIGINS + ["http://localhost:5173", "http://127.0.0.1:5173", "https://civicresolver.vercel.app"]

# CORS Middleware setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

# Mount API v1 Routers
api_v1_prefix = settings.API_V1_PREFIX

app.include_router(complaints.router, prefix=api_v1_prefix)
app.include_router(ai.router, prefix=api_v1_prefix)
app.include_router(maps.router, prefix=api_v1_prefix)
app.include_router(admin.router, prefix=api_v1_prefix)
app.include_router(analytics.router, prefix=api_v1_prefix)
app.include_router(authentication.router, prefix=api_v1_prefix)

@app.get("/health", tags=["System Health"])
def health_check():
    """Application health endpoint returning system status without revealing private secrets."""
    has_gemini = bool(settings.GEMINI_API_KEY and settings.GEMINI_API_KEY != "your-gemini-api-key-here")
    has_supabase = bool(settings.SUPABASE_URL and settings.SUPABASE_ANON_KEY)

    return {
        "status": "healthy",
        "service": "CivicResolve API",
        "city_focus": settings.CITY_FOCUS,
        "default_coordinates": {
            "latitude": settings.COIMBATORE_LAT,
            "longitude": settings.COIMBATORE_LNG
        },
        "version": settings.PROJECT_VERSION,
        "environment": settings.ENVIRONMENT,
        "timestamp": datetime.utcnow().isoformat(),
        "integrations": {
            "gemini_ai": "active" if has_gemini else "fallback_classifier_active",
            "supabase_database": "connected" if has_supabase else "local_persistent_mode",
            "gis_geocoding": "active"
        }
    }

@app.get("/", tags=["Root"])
def root():
    return {
        "name": "CivicResolve — AI-Powered Civic Intelligence Platform",
        "tagline": "Your city. Your voice. Your impact.",
        "city": "Coimbatore, Tamil Nadu",
        "documentation": "/docs",
        "health": "/health"
    }

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", settings.PORT))
    uvicorn.run("backend.app.main:app", host="0.0.0.0", port=port, reload=(settings.ENVIRONMENT == "development"))
