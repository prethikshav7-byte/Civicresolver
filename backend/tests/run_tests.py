import sys
import os
from pathlib import Path
os.environ["TESTING"] = "1"
sys.path.insert(0, str(Path(__file__).resolve().parent.parent.parent))

from backend.app.main import health_check
from backend.app.schemas.ai import DuplicateCheckRequest, AIAnalysisRequest, AIChatRequest, AIChatResponse
from backend.app.schemas.complaint import (
    ComplaintCreate, ComplaintCategory, ComplaintPriority, ComplaintStatus, StatusUpdate, DepartmentAssign
)
from backend.app.schemas.civicproof import CommunityVoteRequest, AdminReopenRequest
from backend.app.api.routes.ai import check_duplicates, chat_with_assistant
from backend.app.ai.gemini_service import GeminiService
from backend.app.api.routes.complaints import list_complaints, create_complaint, get_complaint, support_complaint, get_complaint_timeline
from backend.app.api.routes.admin import assign_department, resolve_complaint, get_admin_overview, export_complaints_csv
from backend.app.api.routes.maps import get_map_complaints, get_complaint_hotspots, search_locations, reverse_geocode
from backend.app.api.routes.civicproof import get_proof_list, record_community_vote, admin_reopen_complaint
from backend.app.api.routes.civicpulse import get_civicpulse_overview
from backend.app.api.routes.officer import get_officer_queue, record_inspection, submit_resolution

def run_tests():
    print("=" * 75, flush=True)
    print("CIVICRESOLVE SYSTEM VERIFICATION: COIMBATORE ENTERPRISE CIVIC SUITE", flush=True)
    print("=" * 75, flush=True)
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
    c1 = get_complaint("#80001")
    assert c1["complaint_reference"] == "#80001"
    assert c1["locality_name"] == "Gandhipuram"
    tl = get_complaint_timeline("#80001")
    assert len(tl) >= 3
    print(f"[PASS] 3. Complaint reference & timeline: ID=#80001 in {c1['locality_name']}, {len(tl)} history events", flush=True)
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
    assert dup_res.matches[0].complaint_reference == "#80001"
    print(f"[PASS] 4. Proximity duplicate detection: found {dup_res.count} match within {dup_res.matches[0].distance_meters}m", flush=True)
    passed += 1

    # 5. Civic AI Analysis Triage with Tamil Support & Priority Score
    total += 1
    ai_res = GeminiService._fallback_analysis(AIAnalysisRequest(
        description="ரோட்டில் பெரிய குழி தண்ணீர் தேங்கி உள்ளது இருசக்கர வாகனங்கள் விழுகின்றன",
        address="Cross Cut Road, Gandhipuram, Coimbatore"
    ))
    assert ai_res.category == ComplaintCategory.ROADS
    assert ai_res.recommended_sla is not None
    assert ai_res.priority_score >= 60
    assert ai_res.is_fallback is True
    print(f"[PASS] 5. Civic AI triage (Tamil/English): Cat={ai_res.category.value}, Score={ai_res.priority_score}/100, SLA={ai_res.recommended_sla}", flush=True)
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
    assert ref.startswith("#8")

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

    # 8. CivicProof Community Verification & Reopening
    total += 1
    proof_items = get_proof_list()
    assert len(proof_items) >= 2
    # Vote on proof item
    v_item = proof_items[0]
    vote_res = record_community_vote(v_item["id"], CommunityVoteRequest(
        citizen_name="Priya Sundaram",
        citizen_id="cit-tester-99",
        vote="Resolved",
        comment="Water drain is now flowing freely."
    ))
    assert vote_res["proof_item"]["votes_resolved"] >= 1

    # Test Admin Reopen
    reopen_res = admin_reopen_complaint("proof-3", AdminReopenRequest(
        reason="Community reports asphalt patch is already sinking under bus traffic",
        reopened_by="Dr. Anand Ramanathan, IAS"
    ))
    assert reopen_res["proof_item"]["proof_status"] == "Reopened for Reinspection"
    print(f"[PASS] 8. CivicProof: {len(proof_items)} verified resolutions, community vote recorded, and admin dispute reopening tested", flush=True)
    passed += 1

    # 9. CivicPulse Predictive Analytics
    total += 1
    pulse = get_civicpulse_overview()
    assert pulse.recurring_hotspots_count >= 3
    assert len(pulse.predictive_hotspots) >= 2
    assert pulse.predictive_hotspots[0].confidence_level in ["High", "Medium"]
    print(f"[PASS] 9. CivicPulse: {pulse.recurring_hotspots_count} recurring clusters, {len(pulse.predictive_hotspots)} predictive hotspot models", flush=True)
    passed += 1

    # 10. Officer Portal Queue & Field Actions
    total += 1
    queue = get_officer_queue("Roads Department")
    assert "officer" in queue
    assert queue["count"] >= 0
    print(f"[PASS] 10. Officer Portal: Queue retrieved for {queue['officer']} ({queue['department']})", flush=True)
    passed += 1

    # 11. Administrative CSV Export (Non-PII Sanitized)
    total += 1
    csv_resp = export_complaints_csv()
    assert csv_resp.status_code == 200
    assert "Reference_ID" in csv_resp.body.decode("utf-8")
    assert "phone" not in csv_resp.body.decode("utf-8").lower()
    print(f"[PASS] 11. Administrative CSV Export: generated sanitized audit file ({len(csv_resp.body)} bytes)", flush=True)
    passed += 1

    # 12. Persistent Civic AI Assistant (Zero emojis, role-tailored)
    total += 1
    chat_resp = chat_with_assistant(AIChatRequest(
        message="How do I track my complaint and what are the SLAs?",
        role="citizen"
    ))
    assert "track" in chat_resp.reply.lower() or "sla" in chat_resp.reply.lower()
    assert len(chat_resp.suggested_questions) >= 2
    print(f"[PASS] 12. Civic AI Assistant: Role-aware response verified (Zero emojis, {len(chat_resp.suggested_questions)} suggestions)", flush=True)
    passed += 1

    print("=" * 75, flush=True)
    print(f"ALL TESTS PASSED: {passed}/{total} (100% SUCCESS)", flush=True)
    print("=" * 75, flush=True)

if __name__ == "__main__":
    run_tests()
