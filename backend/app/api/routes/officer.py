from fastapi import APIRouter, HTTPException, Query
from typing import Optional, List, Dict, Any
from datetime import datetime
from backend.app.database.connection import local_store
from backend.app.schemas.complaint import StatusUpdate
from backend.app.services.complaint_service import ComplaintService

router = APIRouter(prefix="/officer", tags=["Officer Portal: Field Execution Queue"])

@router.get("/queue")
def get_officer_queue(department: Optional[str] = None):
    """Retrieves active complaints assigned to officer's department."""
    complaints = local_store.complaints
    target_dept = department or "Roads Department"
    assigned = [
        c for c in complaints 
        if (c.get("department_name") or "").lower() == target_dept.lower()
        and c.get("status") in ["Assigned", "In Progress", "Reopened"]
    ]
    return {
        "department": target_dept,
        "officer": "Er. Vigneshwaran K.",
        "count": len(assigned),
        "items": assigned
    }

@router.post("/inspect/{id_or_ref}")
def record_inspection(id_or_ref: str, notes: str = Query(...)):
    """Records on-site inspection note from field officer."""
    c = ComplaintService.get_complaint(id_or_ref)
    if not c:
        raise HTTPException(status_code=404, detail="Complaint not found")
    
    c["status"] = "In Progress"
    c["updated_at"] = datetime.utcnow().isoformat()
    c.setdefault("timeline", []).append({
        "id": f"t-{datetime.utcnow().timestamp()}",
        "previous_status": "Assigned",
        "new_status": "In Progress",
        "change_reason": f"Field inspection conducted: {notes}",
        "changed_by": "Er. Vigneshwaran K. (Executive Engineer)",
        "created_at": datetime.utcnow().isoformat()
    })
    return {"message": "Inspection noted and work status moved to In Progress", "complaint": c}

@router.post("/resolve/{id_or_ref}")
def submit_resolution(
    id_or_ref: str,
    resolution_notes: str = Query(...),
    after_image_url: Optional[str] = Query(None)
):
    """Submits resolution evidence with mandatory rectification summary and photo proof."""
    update_payload = StatusUpdate(
        status="Resolved",
        reason=resolution_notes,
        resolution_notes=resolution_notes,
        evidence_image_url=after_image_url,
        officer_name="Er. Vigneshwaran K."
    )
    res = ComplaintService.update_status(id_or_ref, update_payload, changed_by="Er. Vigneshwaran K.")
    if not res:
        raise HTTPException(status_code=404, detail="Complaint not found")
    return {"message": "Resolution submitted and forwarded to CivicProof community verification", "complaint": res}
