import uuid
from datetime import datetime
from typing import List, Dict, Any, Optional
from backend.app.schemas.civicproof import CommunityVoteRequest, AdminReopenRequest, CivicProofItem
from backend.app.database.connection import local_store

class CivicProofService:
    def __init__(self):
        now = datetime.utcnow()
        # Seed realistic resolution verifications in Coimbatore
        self.verifications: List[Dict[str, Any]] = [
            {
                "id": "proof-1",
                "complaint_reference": "CR-2026-00005",
                "title": "Blocked stormwater culvert causing sewage backflow",
                "category": "Drainage",
                "locality": "Ukkadam",
                "ward_number": 84,
                "department_name": "Drainage Department",
                "officer_name": "AE Drainage M. Suresh",
                "resolved_at": (now).isoformat(),
                "rectification_summary": "Super-sucker desilting machine deployed. Cleared 4.2 tons of silt and plastic debris. Free gravity flow verified.",
                "before_image_url": "https://images.unsplash.com/photo-1541888946425-d0fbb1861593?w=500&auto=format&fit=crop&q=60",
                "after_image_url": "https://images.unsplash.com/photo-1517646287270-a5a9ca602e5c?w=500&auto=format&fit=crop&q=60",
                "ai_vision_confidence": 0.94,
                "ai_vision_assessment": "Visual comparison confirms water channel is cleared of solid obstructions; water level reduced to normal bed depth.",
                "votes_resolved": 8,
                "votes_partial": 1,
                "votes_still_exists": 0,
                "proof_status": "Community Confirmed",
                "admin_reopened_reason": None,
                "voters": ["cit-demo-1", "cit-demo-2"]
            },
            {
                "id": "proof-2",
                "complaint_reference": "CR-2026-00006",
                "title": "Fallen banyan tree limb blocking pedestrian jogging loop",
                "category": "Parks",
                "locality": "Race Course",
                "ward_number": 72,
                "department_name": "Parks & Horticulture",
                "officer_name": "Horticulture Officer G. Ramesh",
                "resolved_at": (now).isoformat(),
                "rectification_summary": "Chainsaw squad cleared and safely removed fallen timber within 3 hours. Footpath restored.",
                "before_image_url": "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=500&auto=format&fit=crop&q=60",
                "after_image_url": "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=500&auto=format&fit=crop&q=60",
                "ai_vision_confidence": 0.91,
                "ai_vision_assessment": "Obstacle eliminated from walking lane. Pavement clear of physical branch debris.",
                "votes_resolved": 6,
                "votes_partial": 0,
                "votes_still_exists": 0,
                "proof_status": "Community Confirmed",
                "admin_reopened_reason": None,
                "voters": ["cit-demo-3"]
            },
            {
                "id": "proof-3",
                "complaint_reference": "CR-2026-00001",
                "title": "Deep crater pothole with standing water",
                "category": "Roads",
                "locality": "Gandhipuram",
                "ward_number": 70,
                "department_name": "Roads Department",
                "officer_name": "Er. Vigneshwaran K.",
                "resolved_at": (now).isoformat(),
                "rectification_summary": "Cold-mix asphalt patch laid and rolled across 3.5 sq.m depression.",
                "before_image_url": "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=500&auto=format&fit=crop&q=60",
                "after_image_url": "https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=500&auto=format&fit=crop&q=60",
                "ai_vision_confidence": 0.82,
                "ai_vision_assessment": "Surface filled with bitumen aggregate. Level requires secondary roller compaction.",
                "votes_resolved": 2,
                "votes_partial": 3,
                "votes_still_exists": 1,
                "proof_status": "Disputed / Escalated",
                "admin_reopened_reason": None,
                "voters": []
            }
        ]

    def list_verifications(self, status: Optional[str] = None) -> List[Dict[str, Any]]:
        if status and isinstance(status, str) and status != "All":
            return [v for v in self.verifications if v["proof_status"].lower() == status.lower()]
        return self.verifications

    def get_verification(self, id_or_ref: str) -> Optional[Dict[str, Any]]:
        for v in self.verifications:
            if v["id"] == id_or_ref or v["complaint_reference"] == id_or_ref:
                return v
        return None

    def record_vote(self, id_or_ref: str, vote_req: CommunityVoteRequest) -> Optional[Dict[str, Any]]:
        v = self.get_verification(id_or_ref)
        if not v:
            return None

        voter_id = vote_req.citizen_id or "anonymous"
        voters = v.setdefault("voters", [])
        
        # Check duplicate voting
        if voter_id in voters and voter_id != "anonymous":
            return v

        voters.append(voter_id)

        if vote_req.vote == "Resolved":
            v["votes_resolved"] += 1
        elif vote_req.vote == "Partially resolved":
            v["votes_partial"] += 1
        elif vote_req.vote == "Still exists":
            v["votes_still_exists"] += 1

        # Automatically evaluate proof status
        if v["votes_still_exists"] >= 2 or (v["votes_partial"] + v["votes_still_exists"] >= 3):
            v["proof_status"] = "Disputed / Escalated"
        elif v["votes_resolved"] >= 3 and v["votes_still_exists"] == 0:
            v["proof_status"] = "Community Confirmed"

        # Log audit entry
        local_store.audit_logs.insert(0, {
            "id": f"log-{uuid.uuid4().hex[:6]}",
            "action": "COMMUNITY_VERIFICATION_VOTE",
            "entity_type": "civicproof",
            "entity_id": v["complaint_reference"],
            "performed_by": vote_req.citizen_name or "Citizen",
            "details": {"vote": vote_req.vote, "comment": vote_req.comment},
            "created_at": datetime.utcnow().isoformat()
        })

        return v

    def admin_reopen(self, id_or_ref: str, reopen_req: AdminReopenRequest) -> Optional[Dict[str, Any]]:
        v = self.get_verification(id_or_ref)
        if not v:
            return None

        v["proof_status"] = "Reopened for Reinspection"
        v["admin_reopened_reason"] = reopen_req.reason

        # Synchronize with main complaint store
        for c in local_store.complaints:
            if c["complaint_reference"] == v["complaint_reference"]:
                c["status"] = "Reopened"
                c["updated_at"] = datetime.utcnow().isoformat()
                c.setdefault("timeline", []).append({
                    "id": f"t-{uuid.uuid4().hex[:6]}",
                    "previous_status": "Resolved",
                    "new_status": "Reopened",
                    "change_reason": f"CivicProof Community Escalation: {reopen_req.reason}",
                    "changed_by": reopen_req.reopened_by,
                    "created_at": datetime.utcnow().isoformat()
                })
                break

        # Log audit
        local_store.audit_logs.insert(0, {
            "id": f"log-{uuid.uuid4().hex[:6]}",
            "action": "REOPEN_CIVICPROOF_COMPLAINT",
            "entity_type": "complaint",
            "entity_id": v["complaint_reference"],
            "performed_by": reopen_req.reopened_by,
            "details": {"reason": reopen_req.reason},
            "created_at": datetime.utcnow().isoformat()
        })

        return v

civicproof_service = CivicProofService()
