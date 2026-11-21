from fastapi import APIRouter, HTTPException, Query, status
from typing import Optional, List, Dict, Any
from backend.app.schemas.civicproof import CommunityVoteRequest, AdminReopenRequest
from backend.app.services.civicproof_service import civicproof_service

router = APIRouter(prefix="/civicproof", tags=["CivicProof: Community Verification"])

@router.get("/list", response_model=List[Dict[str, Any]])
def get_proof_list(status: Optional[str] = None):
    return civicproof_service.list_verifications(status)

@router.get("/{id_or_ref}")
def get_proof_item(id_or_ref: str):
    item = civicproof_service.get_verification(id_or_ref)
    if not item:
        raise HTTPException(status_code=404, detail="CivicProof item not found")
    return item

@router.post("/{id_or_ref}/vote")
def record_community_vote(id_or_ref: str, payload: CommunityVoteRequest):
    updated = civicproof_service.record_vote(id_or_ref, payload)
    if not updated:
        raise HTTPException(status_code=404, detail="CivicProof record not found")
    return {"message": "Vote recorded successfully", "proof_item": updated}

@router.post("/{id_or_ref}/reopen")
def admin_reopen_complaint(id_or_ref: str, payload: AdminReopenRequest):
    updated = civicproof_service.admin_reopen(id_or_ref, payload)
    if not updated:
        raise HTTPException(status_code=404, detail="CivicProof record not found")
    return {"message": "Complaint reopened for official reinspection", "proof_item": updated}
