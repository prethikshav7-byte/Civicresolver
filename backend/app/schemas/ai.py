from pydantic import BaseModel, Field
from typing import Optional, List
from backend.app.schemas.complaint import ComplaintCategory, ComplaintPriority

class AIAnalysisRequest(BaseModel):
    description: str = Field(..., min_length=5)
    title: Optional[str] = None
    language: Optional[str] = "en"  # "en" or "ta" (Tamil)
    address: Optional[str] = None
    category_hint: Optional[str] = None
    image_data_url: Optional[str] = None  # Base64 data URL if user attached photo

class AIAnalysisResponse(BaseModel):
    title: str = Field(..., description="Concise, professional headline for the grievance")
    category: ComplaintCategory
    priority: ComplaintPriority
    priority_score: int = Field(ge=1, le=100, description="Explainable urgency rating between 1 and 100")
    department: str = Field(..., description="Recommended Coimbatore Municipal Department")
    urgency_reason: str = Field(..., description="Why this issue requires immediate or scheduled action")
    safety_risks: str = Field(..., description="Specific hazards to commuters, pedestrians, or public health")
    public_impact: str = Field(..., description="Estimated population or traffic flow impact")
    recommended_sla: str = Field(default="48 Hours", description="Recommended resolution timeline")
    suggested_action: str = Field(..., description="Specific technical municipal action suggested")
    confidence: float = Field(ge=0.0, le=1.0)
    explanation: str
    is_emergency: bool = False
    is_ai_generated: bool = True
    is_fallback: bool = False

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

class AIChatRequest(BaseModel):
    message: str = Field(..., min_length=1)
    role: str = Field(default="citizen", description="Role context: citizen, officer, or commissioner")
    complaint_reference: Optional[str] = None

class AIChatResponse(BaseModel):
    reply: str
    role: str
    suggested_questions: List[str]
