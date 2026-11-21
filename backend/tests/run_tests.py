import sys
import os
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent.parent))

from backend.app.main import health_check
from backend.app.schemas.ai import DuplicateCheckRequest, AIAnalysisRequest
from backend.app.schemas.complaint import (
    ComplaintCreate, ComplaintCategory, ComplaintPriority, ComplaintStatus, StatusUpdate, DepartmentAssign
)
from backend.app.api.routes.ai import check_duplicates
from backend.app.ai.gemini_service import GeminiService
from backend.app.api.routes.complaints import list_complaints, create_complaint, get_complaint, support_complaint, get_complaint_timeline
from backend.app.api.routes.admin import assign_department, resolve_complaint, get_admin_overview
from backend.app.api.routes.maps import get_map_complaints, get_complaint_hotspots, search_locations, reverse_geocode

def run_tests():
    print("=" * 70, flush=True)
    print("CIVICRESOLVE SYSTEM VERIFICATION: COIMBATORE CIVIC SUITE", flush=True)
    print("=" * 70, flush=True)
    passed = 0
    total = 0

    # 1. Health check
    total += 1
    h = health_check()
    assert h["status"] == "healthy"
    assert h["city_focus"] == "Coimbatore"
    print(f"[PASS] 1. Health check: status={h['status']}, city={h['city_focus']}", flush=True)
    passed += 1

    # 2. List complaints
    total += 1
    comps = list_complaints()
    assert comps["total"] >= 6
    print(f"[PASS] 2. List complaints: {comps['total']} seeded complaints in Coimbatore", flush=True)
    passed += 1

    # 3. Retrieve complaint by reference & timeline
    total += 1
    c1 = get_complaint("CR-2026-00001")
    assert c1["complaint_reference"] == "CR-2026-00001"
    assert c1["locality_name"] == "Gandhipuram"
    tl = get_complaint_timeline("CR-2026-00001")
    assert len(tl) >= 3
    print(f"[PASS] 3. Complaint reference & timeline: ID=CR-2026-00001 in {c1['locality_name']}, {len(tl)} history events", flush=True)
    passed += 1

    # 4. Duplicate Check (Near Gandhipuram Bus Stand)
    total += 1
    dup_res = check_duplicates(DuplicateCheckRequest(
        title="Severe pothole near bus stand",
        description="Massive puddle crater on road where buses enter",
        category="Roads",
        latitude=11.0168,
        longitude=76.9558,
        radius_meters=200.0
    ))
    assert dup_res.has_possible_duplicates is True
    assert dup_res.count >= 1
    assert dup_res.matches[0].complaint_reference == "CR-2026-00001"
    print(f"[PASS] 4. Proximity duplicate detection: found {dup_res.count} match within {dup_res.matches[0].distance_meters}m", flush=True)
    passed += 1

    # 5. Civic AI Analysis Triage
    total += 1
    ai_res = GeminiService._fallback_analysis(AIAnalysisRequest(
        title="Continuous drinking water leakage on main road",
        description="Water pipe burst near bus stop, clean potable water gushing onto road",
        address="Singanallur, Coimbatore"
    ))
    assert ai_res.category == ComplaintCategory.WATER
    assert ai_res.recommended_department == "Water Supply Department"
    assert ai_res.confidence >= 0.8
    print(f"[PASS] 5. Civic AI triage: Category={ai_res.category.value}, Dept={ai_res.recommended_department}, Confidence={ai_res.confidence*100:.0f}%", flush=True)
    passed += 1

    # 6. Complete End-to-End Lifecycle: Create -> Assign -> Resolve
    total += 1
    new_c = create_complaint(ComplaintCreate(
        title="Broken underground drainage lid on DB Road",
        description="Heavy cast iron chamber lid cracked, pedestrians may fall inside at night",
        category=ComplaintCategory.DRAINAGE,
        priority=ComplaintPriority.CRITICAL,
        severity=5,
        latitude=11.0089,
        longitude=76.9464,
        address="DB Road near Post Office, RS Puram, Coimbatore",
        locality_name="RS Puram",
        ward_number=23,
        citizen_name="S. Sundaram",
        citizen_email="sundaram@test.in"
    ))
    ref = new_c["complaint_reference"]
    assert ref.startswith("CR-2026-")

    # Assign Department
    assign_res = assign_department(
        payload=DepartmentAssign(
            department_id="dept-5",
            department_name="Drainage Department",
            officer_name="AE Drainage M. Suresh",
            instructions="Deploy replacement heavy-duty chamber slab immediately"
        ),
        complaint_id=ref
    )
    assert assign_res["complaint"]["status"] == "Assigned"

    # Resolve with evidence notes
    resolve_res = resolve_complaint(
        id=ref,
        payload=StatusUpdate(
            status=ComplaintStatus.RESOLVED,
            reason="Concrete heavy-duty slab installed and leveled with road surface",
            resolution_notes="New reinforced precast concrete manhole cover fitted. Inspected by AE Suresh.",
            officer_name="AE Drainage M. Suresh"
        )
    )
    assert resolve_res["complaint"]["status"] == "Resolved"
    assert resolve_res["complaint"]["resolved_at"] is not None
    print(f"[PASS] 6. End-to-end lifecycle verified: {ref} created -> assigned -> resolved with audit trail", flush=True)
    passed += 1

    # 7. Map Markers & Hotspots
    total += 1
    markers = get_map_complaints()
    assert markers["count"] >= 7
    hotspots = get_complaint_hotspots()
    assert len(hotspots["hotspots"]) >= 7
    print(f"[PASS] 7. GIS Mapping: {markers['count']} markers and {len(hotspots['hotspots'])} hotspots in Coimbatore", flush=True)
    passed += 1

    # 8. Geocoding & Localities
    total += 1
    search_res = search_locations("RS Puram")
    assert len(search_res) >= 1
    rev_res = reverse_geocode(11.0168, 76.9558)
    assert "Gandhipuram" in rev_res["address"] or rev_res["locality_name"] == "Gandhipuram"
    print(f"[PASS] 8. Coimbatore Geocoding: found '{search_res[0]['name']}', reverse geocoded to '{rev_res['locality_name']}'", flush=True)
    passed += 1

    # 9. Civic Analytics Overview
    total += 1
    ov = get_admin_overview()
    assert ov.total_complaints >= 7
    assert ov.resolved >= 3
    print(f"[PASS] 9. Civic Analytics: total={ov.total_complaints}, resolved={ov.resolved}, rate={ov.resolution_rate_percent}%", flush=True)
    passed += 1

    print("=" * 70, flush=True)
    print(f"ALL TESTS PASSED: {passed}/{total} (100% SUCCESS)", flush=True)
    print("=" * 70, flush=True)

if __name__ == "__main__":
    run_tests()
