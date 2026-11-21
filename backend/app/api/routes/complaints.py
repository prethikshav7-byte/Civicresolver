from fastapi import APIRouter, HTTPException, status
from typing import Optional, List, Dict, Any
from backend.app.schemas.complaint import ComplaintCreate, ComplaintResponse, StatusUpdate
from backend.app.services.complaint_service import ComplaintService

router = APIRouter(prefix="/complaints", tags=["Complaints"])

@router.get("", response_model=Dict[str, Any])
def list_complaints(
    category: Optional[str] = None,
    priority: Optional[str] = None,
    status: Optional[str] = None,
    locality: Optional[str] = None,
    ward: Optional[int] = None,
    search: Optional[str] = None,
    limit: int = 50,
    offset: int = 0
):
    return ComplaintService.list_complaints(
        category=category,
        priority=priority,
        status=status,
        locality=locality,
        ward=ward,
        search=search,
        limit=limit,
        offset=offset
    )

@router.post("", status_code=status.HTTP_201_CREATED)
def create_complaint(payload: ComplaintCreate):
    new_complaint = ComplaintService.create_complaint(payload)
    return new_complaint

@router.get("/{id}")
def get_complaint(id: str):
    complaint = ComplaintService.get_complaint(id)
    if not complaint:
        raise HTTPException(status_code=404, detail=f"Complaint '{id}' not found")
    return complaint

@router.post("/{id}/support")
def support_complaint(id: str):
    complaint = ComplaintService.support_complaint(id)
    if not complaint:
        raise HTTPException(status_code=404, detail=f"Complaint '{id}' not found")
    return {"message": "Support recorded", "supports_count": complaint["supports_count"]}

@router.get("/{id}/timeline")
def get_complaint_timeline(id: str):
    complaint = ComplaintService.get_complaint(id)
    if not complaint:
        raise HTTPException(status_code=404, detail=f"Complaint '{id}' not found")
    return complaint.get("timeline", [])
