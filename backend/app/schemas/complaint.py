from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from enum import Enum

class ComplaintCategory(str, Enum):
    ROADS = "Roads"
    SANITATION = "Sanitation"
    ELECTRICAL = "Electrical"
    WATER = "Water"
    DRAINAGE = "Drainage"
    PARKS = "Parks"
    PUBLIC_INFRA = "Public Infrastructure"
    OTHER = "Other"

class ComplaintPriority(str, Enum):
    CRITICAL = "Critical"
    HIGH = "High"
    MEDIUM = "Medium"
    LOW = "Low"

class ComplaintStatus(str, Enum):
    REPORTED = "Reported"
    UNDER_REVIEW = "Under Review"
    ASSIGNED = "Assigned"
    IN_PROGRESS = "In Progress"
    RESOLVED = "Resolved"
    REOPENED = "Reopened"

class ComplaintBase(BaseModel):
    title: Optional[str] = None
    description: str = Field(..., min_length=5, max_length=2000)
    category: ComplaintCategory = ComplaintCategory.ROADS
    issue_type: Optional[str] = None
    priority: ComplaintPriority = ComplaintPriority.MEDIUM
    priority_score: Optional[int] = Field(default=60, ge=1, le=100)
    severity: int = Field(default=3, ge=1, le=5)
    latitude: float = Field(..., ge=-90.0, le=90.0)
    longitude: float = Field(..., ge=-180.0, le=180.0)
    address: str = Field(..., min_length=3)
    locality_name: Optional[str] = None
    ward_number: Optional[int] = None
    image_url: Optional[str] = None
    after_image_url: Optional[str] = None
    language: Optional[str] = "en"

class ComplaintCreate(ComplaintBase):
    citizen_name: Optional[str] = "Anonymous Citizen"
    citizen_email: Optional[str] = None

class StatusUpdate(BaseModel):
    status: ComplaintStatus
    reason: str = Field(..., min_length=3)
    resolution_notes: Optional[str] = None
    evidence_image_url: Optional[str] = None
    officer_name: Optional[str] = None

class DepartmentAssign(BaseModel):
    department_id: str
    department_name: str
    officer_id: Optional[str] = None
    officer_name: Optional[str] = None
    instructions: Optional[str] = None

class StatusTimelineItem(BaseModel):
    id: str
    previous_status: Optional[str]
    new_status: str
    change_reason: Optional[str]
    changed_by: Optional[str]
    created_at: datetime

class ComplaintResponse(ComplaintBase):
    id: str
    complaint_reference: str
    title: str
    citizen_id: Optional[str] = None
    citizen_name: Optional[str] = None
    citizen_email: Optional[str] = None
    status: ComplaintStatus
    department_name: Optional[str] = None
    assigned_officer_name: Optional[str] = None
    resolution_notes: Optional[str] = None
    resolved_at: Optional[datetime] = None
    supports_count: int = 0
    created_at: datetime
    updated_at: datetime
    timeline: List[StatusTimelineItem] = []

    class Config:
        from_attributes = True
