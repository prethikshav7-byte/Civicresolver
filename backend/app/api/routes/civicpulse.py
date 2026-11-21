from fastapi import APIRouter
from backend.app.schemas.civicpulse import CivicPulseOverview
from backend.app.services.civicpulse_service import CivicPulseService

router = APIRouter(prefix="/civicpulse", tags=["CivicPulse: Predictive Civic Intelligence"])

@router.get("/overview", response_model=CivicPulseOverview)
def get_civicpulse_overview():
    return CivicPulseService.get_pulse_overview()
