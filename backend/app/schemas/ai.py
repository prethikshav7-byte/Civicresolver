from pydantic import BaseModel, Field
from typing import Optional, List
from backend.app.schemas.complaint import ComplaintCategory, ComplaintPriority

class AIAnalysisRequest(BaseModel):
    title: str = Field(..., min_length=3)
    description: str = Field(..., min_length=10)
    address: Optional[str] = None
    image_data_url: Optional[str] = None  # Base64 data URL if user attached photo

class AIAnalysisResponse(BaseModel):
    category: ComplaintCategory
    issue_type: str
    priority: ComplaintPriority
    severity: int = Field(ge=1, le=5)
    safety_risk: str
    recommended_department: str
    suggested_action: str
    confidence: float = Field(ge=0.0, le=1.0)
    explanation: str
    is_emergency: bool = False
    is_ai_generated: bool = True

class DuplicateCheckRequest(BaseModel):
    title: str
    description: str
    category: Optional[str] = None
    latitude: float
    longitude: float
    radius_meters: float = 300.0

class DuplicateMatch(BaseModel):
    complaint_reference: str
    title: str
    category: str
    distance_meters: float
    similarity_score: float
    status: str
    created_at: str

class DuplicateCheckResponse(BaseModel):
    has_possible_duplicates: bool
    count: int
    matches: List[DuplicateMatch]
    recommendation: str
