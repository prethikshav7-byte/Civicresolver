from fastapi import APIRouter
from typing import Dict, Any

router = APIRouter(prefix="/auth", tags=["Authentication & Profiles"])

# Demo profiles for instant judging and testing without mandatory signup hurdles
DEMO_PROFILES = {
    "citizen": {
        "id": "e0000001-0000-0000-0000-000000000003",
        "email": "citizen.demo@civicresolve.in",
        "full_name": "Priya Sundaram",
        "role": "citizen",
        "phone_number": "+91 98940 22000",
        "city": "Coimbatore",
        "ward": 70
    },
    "officer": {
        "id": "e0000001-0000-0000-0000-000000000002",
        "email": "officer.roads@civicresolve.in",
        "full_name": "Er. Vigneshwaran K.",
        "role": "officer",
        "department": "Roads Department",
        "designation": "Executive Engineer (Roads)",
        "phone_number": "+91 94430 11001",
        "city": "Coimbatore"
    },
    "admin": {
        "id": "e0000001-0000-0000-0000-000000000001",
        "email": "admin@civicresolve.in",
        "full_name": "Dr. Anand Ramanathan, IAS",
        "role": "admin",
        "designation": "Municipal Commissioner, Coimbatore Corporation",
        "phone_number": "+91 94430 11000",
        "city": "Coimbatore"
    }
}

@router.get("/profile")
def get_current_profile(role: str = "citizen"):
    return DEMO_PROFILES.get(role, DEMO_PROFILES["citizen"])

@router.get("/roles")
def get_available_roles():
    return [
        {"role": "citizen", "label": "Citizen (Priya Sundaram)", "desc": "Report issues, follow grievance progress"},
        {"role": "admin", "label": "Administrator (Commissioner Anand Ramanathan)", "desc": "Assign departments, manage triage"},
        {"role": "officer", "label": "Department Officer (Er. Vigneshwaran K.)", "desc": "Update status, upload resolution proof"}
    ]
