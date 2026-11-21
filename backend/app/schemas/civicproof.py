from pydantic import BaseModel, Field
from typing import Optional, List, Literal
from datetime import datetime

class CommunityVoteRequest(BaseModel):
    citizen_name: Optional[str] = "Priya Sundaram"
    citizen_id: Optional[str] = "cit-demo-1"
    vote: Literal["Resolved", "Partially resolved", "Still exists"]
    comment: Optional[str] = None
    evidence_photo_url: Optional[str] = None

class AdminReopenRequest(BaseModel):
    reason: str = Field(..., min_length=5)
    reopened_by: str = "Dr. Anand Ramanathan, IAS"
    new_instructions: Optional[str] = None

class CivicProofItem(BaseModel):
    id: str
    complaint_reference: str
    title: str
    category: str
    locality: str
    ward_number: int
    department_name: str
    officer_name: str
    resolved_at: str
    rectification_summary: str
    before_image_url: Optional[str] = None
    after_image_url: Optional[str] = None
    ai_vision_confidence: Optional[float] = None
    ai_vision_assessment: Optional[str] = None
    votes_resolved: int = 0
    votes_partial: int = 0
    votes_still_exists: int = 0
    proof_status: Literal["Pending Community Review", "Community Confirmed", "Disputed / Escalated", "Reopened for Reinspection"]
    admin_reopened_reason: Optional[str] = None
