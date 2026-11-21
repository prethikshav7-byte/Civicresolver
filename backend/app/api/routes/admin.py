from fastapi import APIRouter, HTTPException, status
from typing import Optional, Dict, Any, List
from backend.app.schemas.complaint import StatusUpdate, DepartmentAssign
from backend.app.services.complaint_service import ComplaintService
from backend.app.services.analytics_service import AnalyticsService
from backend.app.database.connection import local_store

router = APIRouter(prefix="/admin", tags=["Administration"])

@router.get("/overview")
def get_admin_overview():
    return AnalyticsService.get_overview_stats()

@router.get("/complaints")
def get_admin_complaints(
    category: Optional[str] = None,
    priority: Optional[str] = None,
    status: Optional[str] = None,
    department: Optional[str] = None,
    search: Optional[str] = None,
    limit: int = 50,
    offset: int = 0
):
    results = ComplaintService.list_complaints(
        category=category,
        priority=priority,
        status=status,
        search=search,
        limit=limit,
        offset=offset
    )
    if department:
        results["items"] = [
            c for c in results["items"] 
            if (c.get("department_name") or "").lower() == str(department).lower()
        ]
        results["total"] = len(results["items"])
    return results

@router.post("/assign")
def assign_department(payload: DepartmentAssign, complaint_id: str):
    updated = ComplaintService.assign_department(complaint_id, payload, performed_by="Zonal Commissioner")
    if not updated:
        raise HTTPException(status_code=404, detail="Complaint not found")
    return {"message": "Department successfully assigned", "complaint": updated}

@router.post("/complaints/{id}/status")
def update_complaint_status(id: str, payload: StatusUpdate):
    updated = ComplaintService.update_status(id, payload, changed_by=payload.officer_name or "Admin")
    if not updated:
        raise HTTPException(status_code=404, detail="Complaint not found")
    return {"message": "Status updated successfully", "complaint": updated}

@router.post("/complaints/{id}/resolve")
def resolve_complaint(id: str, payload: StatusUpdate):
    if payload.status != "Resolved":
        payload.status = "Resolved"
    updated = ComplaintService.update_status(id, payload, changed_by=payload.officer_name or "Executive Engineer")
    if not updated:
        raise HTTPException(status_code=404, detail="Complaint not found")
    return {"message": "Complaint verified and resolved", "complaint": updated}

@router.get("/departments")
def list_departments():
    return local_store.departments

@router.get("/audit-logs")
def get_audit_logs():
    return local_store.audit_logs[:50]

@router.get("/export/csv")
def export_complaints_csv():
    """Generates sanitized, non-PII CSV export of municipal grievances for audit compliance."""
    import io
    import csv
    from fastapi.responses import Response

    output = io.StringIO()
    writer = csv.writer(output)
    
    # Headers without PII (no citizen phone/email)
    writer.writerow([
        "Reference_ID", "Title", "Category", "Priority", "Severity", 
        "Status", "Locality", "Ward_Number", "Department", 
        "Assigned_Officer", "Created_At", "Resolved_At", "Resolution_Summary"
    ])

    for c in local_store.complaints:
        writer.writerow([
            c.get("complaint_reference", ""),
            c.get("title", ""),
            c.get("category", ""),
            c.get("priority", ""),
            c.get("severity", 3),
            c.get("status", ""),
            c.get("locality_name", ""),
            c.get("ward_number", 70),
            c.get("department_name", ""),
            c.get("assigned_officer_name", "Unassigned"),
            c.get("created_at", ""),
            c.get("resolved_at", ""),
            (c.get("resolution_notes") or "").replace("\n", " ")
        ])

    csv_data = output.getvalue()
    return Response(
        content=csv_data,
        media_type="text/csv",
        headers={
            "Content-Disposition": "attachment; filename=civicresolve_coimbatore_audit.csv"
        }
    )
