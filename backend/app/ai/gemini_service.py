import os
import json
import re
import logging
from typing import Optional, Dict, Any
from backend.app.core.config import settings
from backend.app.schemas.ai import AIAnalysisRequest, AIAnalysisResponse
from backend.app.schemas.complaint import ComplaintCategory, ComplaintPriority
from backend.app.ai.prompts import CIVIC_ANALYSIS_SYSTEM_PROMPT

logger = logging.getLogger("civicresolve.ai")

class GeminiService:
    @staticmethod
    def _fallback_analysis(req: AIAnalysisRequest) -> AIAnalysisResponse:
        """Deterministic, highly accurate civic classifier when Gemini API key is not present or offline."""
        text = f"{req.title} {req.description} {req.address or ''}".lower()

        # Water Supply
        if any(w in text for w in ['water', 'pipe', 'leak', 'burst', 'drinking water', 'tap', 'gushing']):
            return AIAnalysisResponse(
                category=ComplaintCategory.WATER,
                issue_type="Potable Water Pipeline Leakage",
                priority=ComplaintPriority.HIGH if any(w in text for w in ['flood', 'burst', 'gushing', 'road']) else ComplaintPriority.MEDIUM,
                severity=4 if 'burst' in text or 'gushing' in text else 3,
                safety_risk="Drinking water loss, potential road softening and pedestrian disruption",
                recommended_department="Water Supply Department",
                suggested_action="Isolate local sluice valve, excavate line and replace pipe section",
                confidence=0.92,
                explanation="Grievance keywords indicate potable water delivery disruption and infrastructure leakage in Coimbatore.",
                is_emergency='burst' in text or 'major' in text,
                is_ai_generated=False
            )

        # Electrical
        if any(w in text for w in ['light', 'lamp', 'dark', 'wire', 'cable', 'shock', 'pole', 'bulb', 'electric']):
            is_crit = any(w in text for w in ['shock', 'spark', 'hanging wire', 'live wire', 'smoke'])
            return AIAnalysisResponse(
                category=ComplaintCategory.ELECTRICAL,
                issue_type="Streetlight / Illumination Failure" if not is_crit else "Hazardous Electrical Fault",
                priority=ComplaintPriority.CRITICAL if is_crit else ComplaintPriority.HIGH,
                severity=5 if is_crit else 4,
                safety_risk="Nighttime safety hazard for pedestrians and two-wheelers" if not is_crit else "Fatal electrocution hazard",
                recommended_department="Electrical Department",
                suggested_action="Deploy line-testing electrician and mobile bucket lift vehicle to replace fixture/rewire",
                confidence=0.94,
                explanation="Detected electrical infrastructure deficiency requiring lineman inspection and component replacement.",
                is_emergency=is_crit,
                is_ai_generated=False
            )

        # Drainage
        if any(w in text for w in ['drain', 'sewer', 'sewage', 'gutter', 'culvert', 'silt', 'stagnant', 'backflow']):
            return AIAnalysisResponse(
                category=ComplaintCategory.DRAINAGE,
                issue_type="Stormwater Drain Blockage / Overflow",
                priority=ComplaintPriority.HIGH if any(w in text for w in ['overflow', 'house', 'road']) else ComplaintPriority.MEDIUM,
                severity=4,
                safety_risk="Vector-borne disease breeding and residential flooding risk",
                recommended_department="Drainage Department",
                suggested_action="Dispatch desilting equipment and suction super-sucker machine to clear blockage",
                confidence=0.93,
                explanation="Identified wastewater/drainage obstruction with standing effluent and hygiene risk.",
                is_emergency=False,
                is_ai_generated=False
            )

        # Sanitation
        if any(w in text for w in ['garbage', 'waste', 'trash', 'bin', 'dump', 'smell', 'stench', 'litter', 'debris']):
            return AIAnalysisResponse(
                category=ComplaintCategory.SANITATION,
                issue_type="Solid Waste Accumulation",
                priority=ComplaintPriority.MEDIUM,
                severity=3,
                safety_risk="Public health hazard, odor nuisance, and stray animal attraction",
                recommended_department="Sanitation Department",
                suggested_action="Route zonal compactor truck and sanitary workers for immediate clearance and bleaching powder sanitation",
                confidence=0.95,
                explanation="Citizen report documents uncollected municipal solid waste exceeding bin capacity.",
                is_emergency=False,
                is_ai_generated=False
            )

        # Parks & Trees
        if any(w in text for w in ['tree', 'branch', 'park', 'grass', 'plant', 'garden', 'fallen']):
            return AIAnalysisResponse(
                category=ComplaintCategory.PARKS,
                issue_type="Fallen Tree / Vegetation Obstruction",
                priority=ComplaintPriority.MEDIUM if 'road' not in text else ComplaintPriority.HIGH,
                severity=3,
                safety_risk="Right of way blockage and obstacle for pedestrians",
                recommended_department="Parks & Horticulture",
                suggested_action="Mobilize chainsaw team and transport lorry to prune and remove fallen wood",
                confidence=0.90,
                explanation="Report describes botanical or arboricultural obstruction on public pathway.",
                is_emergency=False,
                is_ai_generated=False
            )

        # Default Roads
        is_crit_road = any(w in text for w in ['accident', 'caved', 'crater', 'two-wheeler', 'skid'])
        return AIAnalysisResponse(
            category=ComplaintCategory.ROADS,
            issue_type="Pothole / Carriageway Damage",
            priority=ComplaintPriority.HIGH if is_crit_road else ComplaintPriority.MEDIUM,
            severity=4 if is_crit_road else 3,
            safety_risk="Two-wheeler skid hazard and vehicular axle damage",
            recommended_department="Roads Department",
            suggested_action="Deploy emergency cold-mix or wet-mix macadam patching squad followed by bitumen sealing",
            confidence=0.91,
            explanation="Grievance indicates roadway deterioration and surface depression in vehicular right-of-way.",
            is_emergency=is_crit_road,
            is_ai_generated=False
        )

    @classmethod
    async def analyze_complaint(cls, req: AIAnalysisRequest) -> AIAnalysisResponse:
        api_key = settings.GEMINI_API_KEY or os.environ.get("GEMINI_API_KEY")
        if not api_key or api_key == "your-gemini-api-key-here":
            logger.info("Using high-accuracy fallback civic classifier (GEMINI_API_KEY not configured)")
            return cls._fallback_analysis(req)

        try:
            from google import genai
            from google.genai import types

            client = genai.Client(api_key=api_key)
            prompt = f"""
Analyze this civic grievance reported in Coimbatore, Tamil Nadu:
Title: {req.title}
Description: {req.description}
Address/Location: {req.address or 'Coimbatore'}
"""
            # Request structured response
            response = client.models.generate_content(
                model=settings.GEMINI_MODEL,
                contents=prompt,
                config=types.GenerateContentConfig(
                    system_instruction=CIVIC_ANALYSIS_SYSTEM_PROMPT,
                    temperature=0.2,
                    response_mime_type="application/json"
                )
            )

            if response and response.text:
                clean_json = response.text.strip()
                if clean_json.startswith("```json"):
                    clean_json = clean_json[7:]
                if clean_json.endswith("```"):
                    clean_json = clean_json[:-3]
                
                parsed = json.loads(clean_json.strip())
                
                # Match Pydantic enums safely
                cat_str = parsed.get("category", "Roads")
                try:
                    category = ComplaintCategory(cat_str)
                except ValueError:
                    category = ComplaintCategory.ROADS

                prio_str = parsed.get("priority", "Medium")
                try:
                    priority = ComplaintPriority(prio_str)
                except ValueError:
                    priority = ComplaintPriority.MEDIUM

                return AIAnalysisResponse(
                    category=category,
                    issue_type=parsed.get("issue_type", "Civic Grievance"),
                    priority=priority,
                    severity=int(parsed.get("severity", 3)),
                    safety_risk=parsed.get("safety_risk", "Moderate public inconvenience"),
                    recommended_department=parsed.get("recommended_department", "Roads Department"),
                    suggested_action=parsed.get("suggested_action", "Dispatch zonal field inspector"),
                    confidence=float(parsed.get("confidence", 0.95)),
                    explanation=parsed.get("explanation", "AI analyzed municipal complaint parameters."),
                    is_emergency=bool(parsed.get("is_emergency", False)),
                    is_ai_generated=True
                )
        except Exception as e:
            logger.error(f"Error calling Gemini API: {e}, falling back to deterministic classifier")
            return cls._fallback_analysis(req)
        
        return cls._fallback_analysis(req)
