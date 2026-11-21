from fastapi import APIRouter
from backend.app.schemas.ai import (
    AIAnalysisRequest, AIAnalysisResponse, 
    DuplicateCheckRequest, DuplicateCheckResponse,
    AIChatRequest, AIChatResponse
)
from backend.app.ai.gemini_service import GeminiService
from backend.app.services.duplicate_service import DuplicateService

router = APIRouter(prefix="/ai", tags=["Civic AI Engine"])

@router.post("/analyze", response_model=AIAnalysisResponse)
async def analyze_complaint(request: AIAnalysisRequest):
    return await GeminiService.analyze_complaint(request)

@router.post("/find-duplicates", response_model=DuplicateCheckResponse)
def check_duplicates(request: DuplicateCheckRequest):
    return DuplicateService.find_duplicates(request)

@router.post("/chat", response_model=AIChatResponse)
def chat_with_assistant(request: AIChatRequest):
    return GeminiService.chat_assistant(request)
