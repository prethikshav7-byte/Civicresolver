import uuid
from datetime import datetime
from typing import List, Dict, Any, Optional
from backend.app.core.config import settings
from backend.app.schemas.complaint import (
    ComplaintCreate, ComplaintStatus, ComplaintPriority, ComplaintCategory, StatusUpdate, DepartmentAssign
)
from backend.app.database.connection import local_store

class ComplaintService:
    @staticmethod
    def list_complaints(
        category: Optional[str] = None,
        priority: Optional[str] = None,
        status: Optional[str] = None,
        locality: Optional[str] = None,
        ward: Optional[int] = None,
        search: Optional[str] = None,
        limit: int = 50,
        offset: int = 0
    ) -> Dict[str, Any]:
        results = local_store.complaints
        
        if category:
            results = [c for c in results if c.get("category", "").lower() == category.lower()]
        if priority:
            results = [c for c in results if c.get("priority", "").lower() == priority.lower()]
        if status:
            results = [c for c in results if c.get("status", "").lower() == status.lower()]
        if locality:
            results = [c for c in results if locality.lower() in (c.get("locality_name") or "").lower()]
        if ward:
            results = [c for c in results if c.get("ward_number") == ward]
        if search:
            q = search.lower()
            results = [
                c for c in results 
                if q in c.get("title", "").lower() 
                or q in c.get("description", "").lower() 
                or q in c.get("complaint_reference", "").lower()
                or q in c.get("address", "").lower()
            ]

        # Sort descending by creation date
        sorted_results = sorted(results, key=lambda x: x.get("created_at", ""), reverse=True)
        total = len(sorted_results)
        paged = sorted_results[offset : offset + limit]

        return {
            "total": total,
            "limit": limit,
            "offset": offset,
            "items": paged
        }

    @staticmethod
    def get_complaint(complaint_id: str) -> Optional[Dict[str, Any]]:
        for c in local_store.complaints:
            if c["id"] == complaint_id or c.get("complaint_reference") == complaint_id:
                return c
        return None

    @staticmethod
    def create_complaint(data: ComplaintCreate, user_id: Optional[str] = None) -> Dict[str, Any]:
        local_store.counter += 1
        ref_id = f"CR-2026-{local_store.counter:05d}"
        now_str = datetime.utcnow().isoformat()
        
        # Default department routing based on category
        dept_map = {
            ComplaintCategory.ROADS: "Roads Department",
            ComplaintCategory.SANITATION: "Sanitation Department",
            ComplaintCategory.ELECTRICAL: "Electrical Department",
            ComplaintCategory.WATER: "Water Supply Department",
            ComplaintCategory.DRAINAGE: "Drainage Department",
            ComplaintCategory.PARKS: "Parks & Horticulture",
            ComplaintCategory.PUBLIC_INFRA: "Roads Department",
            ComplaintCategory.OTHER: "Admin Review Desk",
        }
        dept_name = dept_map.get(data.category, "Admin Review Desk")

        new_complaint = {
            "id": f"c-{uuid.uuid4().hex[:8]}",
            "complaint_reference": ref_id,
            "title": data.title,
            "description": data.description,
            "category": data.category.value if hasattr(data.category, 'value') else data.category,
            "issue_type": data.issue_type or data.category.value,
            "priority": data.priority.value if hasattr(data.priority, 'value') else data.priority,
            "severity": data.severity,
            "status": "Reported",
            "latitude": data.latitude,
            "longitude": data.longitude,
            "address": data.address,
            "locality_name": data.locality_name or "Coimbatore Central",
            "ward_number": data.ward_number or 70,
            "citizen_name": data.citizen_name or "Anonymous Citizen",
            "citizen_email": data.citizen_email,
            "department_name": dept_name,
            "assigned_officer_name": None,
            "image_url": data.image_url,
            "resolution_notes": None,
            "resolved_at": None,
            "supports_count": 1,
            "created_at": now_str,
            "updated_at": now_str,
            "timeline": [
                {
                    "id": f"t-{uuid.uuid4().hex[:6]}",
                    "previous_status": None,
                    "new_status": "Reported",
                    "change_reason": "Grievance registered in Coimbatore CivicResolve",
                    "changed_by": data.citizen_name or "Citizen",
                    "created_at": now_str
                }
            ]
        }

        local_store.complaints.insert(0, new_complaint)
        
        # Audit Log
        local_store.audit_logs.insert(0, {
            "id": f"log-{uuid.uuid4().hex[:6]}",
            "action": "CREATE_COMPLAINT",
            "entity_type": "complaint",
            "entity_id": ref_id,
            "performed_by": data.citizen_name or "Citizen",
            "details": {"title": data.title, "category": new_complaint["category"]},
            "created_at": now_str
        })

        return new_complaint

    @staticmethod
    def update_status(complaint_id: str, update: StatusUpdate, changed_by: str = "Admin") -> Optional[Dict[str, Any]]:
        c = ComplaintService.get_complaint(complaint_id)
        if not c:
            return None

        prev_status = c["status"]
        new_status = update.status.value if hasattr(update.status, 'value') else update.status
        now_str = datetime.utcnow().isoformat()

        c["status"] = new_status
        c["updated_at"] = now_str
        
        if update.resolution_notes:
            c["resolution_notes"] = update.resolution_notes
        if update.officer_name:
            c["assigned_officer_name"] = update.officer_name
        if new_status == "Resolved":
            c["resolved_at"] = now_str

        # Add to timeline
        timeline_entry = {
            "id": f"t-{uuid.uuid4().hex[:6]}",
            "previous_status": prev_status,
            "new_status": new_status,
            "change_reason": update.reason,
            "changed_by": update.officer_name or changed_by,
            "created_at": now_str
        }
        c.setdefault("timeline", []).append(timeline_entry)

        # Audit Log
        local_store.audit_logs.insert(0, {
            "id": f"log-{uuid.uuid4().hex[:6]}",
            "action": f"STATUS_CHANGE_{new_status.upper().replace(' ', '_')}",
            "entity_type": "complaint",
            "entity_id": c["complaint_reference"],
            "performed_by": changed_by,
            "details": {
                "previous_status": prev_status,
                "new_status": new_status,
                "reason": update.reason
            },
            "created_at": now_str
        })

        return c

    @staticmethod
    def assign_department(complaint_id: str, assign_data: DepartmentAssign, performed_by: str = "Admin") -> Optional[Dict[str, Any]]:
        c = ComplaintService.get_complaint(complaint_id)
        if not c:
            return None

        now_str = datetime.utcnow().isoformat()
        c["department_name"] = assign_data.department_name
        if assign_data.officer_name:
            c["assigned_officer_name"] = assign_data.officer_name
        c["status"] = "Assigned"
        c["updated_at"] = now_str

        # Add timeline entry
        timeline_entry = {
            "id": f"t-{uuid.uuid4().hex[:6]}",
            "previous_status": "Reported",
            "new_status": "Assigned",
            "change_reason": assign_data.instructions or f"Assigned to {assign_data.department_name}",
            "changed_by": performed_by,
            "created_at": now_str
        }
        c.setdefault("timeline", []).append(timeline_entry)

        # Audit Log
        local_store.audit_logs.insert(0, {
            "id": f"log-{uuid.uuid4().hex[:6]}",
            "action": "ASSIGN_DEPARTMENT",
            "entity_type": "complaint",
            "entity_id": c["complaint_reference"],
            "performed_by": performed_by,
            "details": {
                "department": assign_data.department_name,
                "officer": assign_data.officer_name,
                "instructions": assign_data.instructions
            },
            "created_at": now_str
        })

        return c

    @staticmethod
    def support_complaint(complaint_id: str) -> Optional[Dict[str, Any]]:
        c = ComplaintService.get_complaint(complaint_id)
        if not c:
            return None
        c["supports_count"] = c.get("supports_count", 0) + 1
        return c
