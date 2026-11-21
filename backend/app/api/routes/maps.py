from fastapi import APIRouter
from typing import Optional, List, Dict, Any
from backend.app.database.connection import local_store
from backend.app.services.location_service import LocationService

router = APIRouter(tags=["Geographical Services"])

@router.get("/map/complaints")
def get_map_complaints(
    category: Optional[str] = None,
    status: Optional[str] = None,
    priority: Optional[str] = None
):
    """Returns complaints with coordinates for Leaflet map markers and clustering."""
    items = local_store.complaints
    if category:
        items = [c for c in items if c.get("category", "").lower() == str(category).lower()]
    if status:
        items = [c for c in items if c.get("status", "").lower() == str(status).lower()]
    if priority:
        items = [c for c in items if c.get("priority", "").lower() == str(priority).lower()]

    markers = []
    for c in items:
        markers.append({
            "id": c["id"],
            "reference": c["complaint_reference"],
            "title": c["title"],
            "category": c["category"],
            "priority": c["priority"],
            "status": c["status"],
            "latitude": c["latitude"],
            "longitude": c["longitude"],
            "address": c["address"],
            "locality": c.get("locality_name"),
            "ward": c.get("ward_number"),
            "department": c.get("department_name"),
            "created_at": c["created_at"],
            "supports_count": c.get("supports_count", 0)
        })
    return {"count": len(markers), "markers": markers}

@router.get("/map/hotspots")
def get_complaint_hotspots():
    """Generates density heatmap coordinate points with weights based on severity and status."""
    hotspots = []
    for c in local_store.complaints:
        weight = float(c.get("severity", 3)) / 5.0
        if c.get("status") in ["Reported", "Under Review", "In Progress"]:
            weight += 0.3
        hotspots.append({
            "lat": c["latitude"],
            "lng": c["longitude"],
            "intensity": min(1.0, round(weight, 2)),
            "category": c["category"]
        })
    return {"city": "Coimbatore", "hotspots": hotspots}

@router.get("/locations/search")
def search_locations(q: str):
    return LocationService.search_locations(q)

@router.get("/locations/reverse-geocode")
def reverse_geocode(lat: float, lng: float):
    return LocationService.reverse_geocode(lat, lng)
