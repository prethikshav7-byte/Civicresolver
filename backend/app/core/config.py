import os
from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    PROJECT_NAME: str = "CivicResolve"
    PROJECT_VERSION: str = "1.0.0"
    ENVIRONMENT: str = "development"
    PORT: int = 8000
    API_V1_PREFIX: str = "/api/v1"
    
    # CORS
    CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "https://civicresolve.vercel.app"
    ]
    
    # Supabase Database & Auth
    SUPABASE_URL: str = ""
    SUPABASE_ANON_KEY: str = ""
    SUPABASE_SERVICE_ROLE_KEY: str = ""
    DATABASE_URL: str = ""
    
    # Google Gemini AI
    GEMINI_API_KEY: str = ""
    GEMINI_MODEL: str = "gemini-2.5-flash"
    
    # Geographic Focus (Coimbatore, Tamil Nadu)
    CITY_FOCUS: str = "Coimbatore"
    COIMBATORE_LAT: float = 11.0168
    COIMBATORE_LNG: float = 76.9558
    NOMINATIM_USER_AGENT: str = "CivicResolve-Coimbatore/1.0"
    
    # Demo Mode
    ENABLE_DEMO_MODE: bool = True

    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()
