from fastapi import APIRouter
from backend.app.services.analytics_service import AnalyticsService

router = APIRouter(prefix="/analytics", tags=["Civic Analytics & Transparency"])

@router.get("/overview")
def get_analytics_overview():
    return AnalyticsService.get_overview_stats()

@router.get("/categories")
def get_category_analytics():
    return AnalyticsService.get_category_breakdown()

@router.get("/departments")
def get_department_analytics():
    return AnalyticsService.get_department_performance()

@router.get("/wards")
def get_ward_analytics():
    return AnalyticsService.get_ward_metrics()
