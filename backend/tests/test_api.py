import pytest
from fastapi.testclient import TestClient
from backend.app.main import app

client = TestClient(app)

def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["city_focus"] == "Coimbatore"

def test_list_complaints():
    response = client.get("/api/v1/complaints")
    assert response.status_code == 200
    data = response.json()
    assert "total" in data
    assert "items" in data
    assert len(data["items"]) >= 6

def test_get_complaint_by_reference():
    response = client.get("/api/v1/complaints/CR-2026-00001")
    assert response.status_code == 200
    data = response.json()
    assert data["complaint_reference"] == "CR-2026-00001"
    assert data["category"] == "Roads"
    assert len(data["timeline"]) >= 1

def test_create_and_lifecycle():
    # 1. Create complaint
    payload = {
        "title": "Severe pothole on Race Course loop",
        "description": "Deep asphalt depression causing cyclists and walkers to stumble near Thomas Park.",
        "category": "Roads",
        "priority": "High",
        "severity": 4,
        "latitude": 11.0065,
        "longitude": 76.9733,
        "address": "Opposite Thomas Park, Race Course, Coimbatore",
        "locality_name": "Race Course",
        "ward_number": 72,
        "citizen_name": "Test Citizen",
        "citizen_email": "test@civicresolve.in"
    }
    create_res = client.post("/api/v1/complaints", json=payload)
    assert create_res.status_code == 201
    created = create_res.json()
    assert created["complaint_reference"].startswith("CR-2026-")
    ref_id = created["complaint_reference"]

    # 2. Assign department
    assign_payload = {
        "department_id": "dept-1",
        "department_name": "Roads Department",
        "officer_name": "Er. Vigneshwaran K.",
        "instructions": "Inspect road damage and patch immediately"
    }
    assign_res = client.post(f"/api/v1/admin/assign?complaint_id={ref_id}", json=assign_payload)
    assert assign_res.status_code == 200

    # 3. Resolve complaint
    resolve_payload = {
        "status": "Resolved",
        "reason": "Cold asphalt patch successfully laid down and rolled",
        "resolution_notes": "Repaired 2.5 sqm pothole with Bitumen mix.",
        "officer_name": "Er. Vigneshwaran K."
    }
    resolve_res = client.post(f"/api/v1/admin/complaints/{ref_id}/resolve", json=resolve_payload)
    assert resolve_res.status_code == 200
    resolved = resolve_res.json()["complaint"]
    assert resolved["status"] == "Resolved"
    assert resolved["resolution_notes"] is not None

def test_ai_analyze_complaint():
    payload = {
        "title": "Dead streetlight on Cross Cut Road",
        "description": "The entire street is dark near the shopping mall, pedestrian danger at night.",
        "address": "Cross Cut Road, Gandhipuram, Coimbatore"
    }
    res = client.post("/api/v1/ai/analyze", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["category"] == "Electrical"
    assert data["recommended_department"] == "Electrical Department"
    assert data["confidence"] > 0.8

def test_duplicate_detection():
    # Check duplicate near Gandhipuram coordinates (11.0168, 76.9558)
    payload = {
        "title": "Pothole near bus stand",
        "description": "Big crater on road right outside the Gandhipuram bus terminal",
        "category": "Roads",
        "latitude": 11.0168,
        "longitude": 76.9558,
        "radius_meters": 200.0
    }
    res = client.post("/api/v1/ai/find-duplicates", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["has_possible_duplicates"] is True
    assert data["count"] >= 1
    assert data["matches"][0]["complaint_reference"] == "CR-2026-00001"

def test_map_markers_and_hotspots():
    res_markers = client.get("/api/v1/map/complaints")
    assert res_markers.status_code == 200
    assert len(res_markers.json()["markers"]) >= 6

    res_hotspots = client.get("/api/v1/map/hotspots")
    assert res_hotspots.status_code == 200
    assert len(res_hotspots.json()["hotspots"]) >= 6

def test_analytics_overview():
    res = client.get("/api/v1/analytics/overview")
    assert res.status_code == 200
    data = res.json()
    assert data["total_complaints"] >= 6
    assert data["resolution_rate_percent"] > 0
